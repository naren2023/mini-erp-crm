import { prisma } from "../config/prisma.js";
import { generateChallanNumber } from "../utils/challanNumber.js";
import {
  InsufficientStockError,
  InvalidChallanStateError,
  NotFoundError,
} from "../utils/AppError.js";
import type { Prisma } from "@prisma/client";

async function snapshotItems(items: Array<{ productId: string; quantity: number }>) {
  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((product) => [product.id, product]));

  return items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new NotFoundError(`Product ${item.productId} not found`);
    }
    return {
      productId: product.id,
      productNameSnapshot: product.name,
      skuSnapshot: product.sku,
      unitPriceSnapshot: product.unitPrice,
      quantity: item.quantity,
    };
  });
}

export async function listChallans(query: {
  page: number;
  limit: number;
  search?: string;
  status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
  customerId?: string;
}) {
  const where: Prisma.SalesChallanWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.customerId ? { customerId: query.customerId } : {}),
    ...(query.search
      ? {
          OR: [
            { challanNumber: { contains: query.search, mode: "insensitive" } },
            { customer: { name: { contains: query.search, mode: "insensitive" } } },
            { customer: { businessName: { contains: query.search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.salesChallan.count({ where }),
    prisma.salesChallan.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, businessName: true } },
        creator: { select: { id: true, name: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}

export async function getChallan(id: string) {
  const challan = await prisma.salesChallan.findUnique({
    where: { id },
    include: {
      customer: true,
      creator: { select: { id: true, name: true, role: true } },
      items: true,
    },
  });
  if (!challan) throw new NotFoundError("Sales challan not found");
  return challan;
}

export async function createChallan(
  createdBy: string,
  input: { customerId: string; items: Array<{ productId: string; quantity: number }> },
) {
  const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
  if (!customer) throw new NotFoundError("Customer not found");

  const snapshots = await snapshotItems(input.items);
  const totalQuantity = snapshots.reduce((sum, item) => sum + item.quantity, 0);
  const challanNumber = await generateChallanNumber();

  return prisma.salesChallan.create({
    data: {
      challanNumber,
      customerId: input.customerId,
      totalQuantity,
      status: "DRAFT",
      createdBy,
      items: { create: snapshots },
    },
    include: {
      customer: true,
      items: true,
    },
  });
}

export async function updateChallan(
  id: string,
  input: { customerId: string; items: Array<{ productId: string; quantity: number }> },
) {
  const existing = await getChallan(id);
  if (existing.status !== "DRAFT") {
    throw new InvalidChallanStateError("Only draft challans can be edited");
  }

  const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
  if (!customer) throw new NotFoundError("Customer not found");

  const snapshots = await snapshotItems(input.items);
  const totalQuantity = snapshots.reduce((sum, item) => sum + item.quantity, 0);

  return prisma.$transaction(async (tx) => {
    await tx.salesChallanItem.deleteMany({ where: { challanId: id } });
    return tx.salesChallan.update({
      where: { id },
      data: {
        customerId: input.customerId,
        totalQuantity,
        items: { create: snapshots },
      },
      include: { customer: true, items: true },
    });
  });
}

export async function confirmChallan(id: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const challan = await tx.salesChallan.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!challan) throw new NotFoundError("Sales challan not found");
    if (challan.status !== "DRAFT") {
      throw new InvalidChallanStateError("Only draft challans can be confirmed");
    }
    if (challan.items.length === 0) {
      throw new InvalidChallanStateError("Cannot confirm a challan with no items");
    }

    for (const item of challan.items) {
      const locked = await tx.$queryRaw<Array<{ id: string; name: string; currentStock: number }>>`
        SELECT id, name, "currentStock"
        FROM "Product"
        WHERE id = ${item.productId}
        FOR UPDATE
      `;

      const product = locked[0];
      if (!product) {
        throw new NotFoundError(`Product ${item.productNameSnapshot} not found`);
      }

      if (product.currentStock < item.quantity) {
        throw new InsufficientStockError(
          `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${item.quantity}.`,
        );
      }

      const updated = await tx.product.updateMany({
        where: { id: product.id, currentStock: { gte: item.quantity } },
        data: { currentStock: { decrement: item.quantity } },
      });

      if (updated.count !== 1) {
        throw new InsufficientStockError(
          `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${item.quantity}.`,
        );
      }

      await tx.stockMovement.create({
        data: {
          productId: product.id,
          quantity: item.quantity,
          movementType: "OUT",
          reason: `Confirmed challan ${challan.challanNumber}`,
          createdBy: userId,
        },
      });
    }

    return tx.salesChallan.update({
      where: { id },
      data: { status: "CONFIRMED" },
      include: { customer: true, items: true },
    });
  });
}

export async function cancelChallan(id: string) {
  const challan = await getChallan(id);
  if (challan.status !== "DRAFT") {
    throw new InvalidChallanStateError("Only draft challans can be cancelled. Confirmed challans do not reverse stock automatically.");
  }

  return prisma.salesChallan.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: { customer: true, items: true },
  });
}
