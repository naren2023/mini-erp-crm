import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { DuplicateSkuError, InsufficientStockError, NotFoundError } from "../utils/AppError.js";

export async function listProducts(query: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  lowStock?: boolean;
}) {
  const lowStockFilter = query.lowStock
    ? Prisma.sql`AND p."currentStock" <= p."minimumStock"`
    : Prisma.empty;

  const searchFilter = query.search
    ? Prisma.sql`AND (p.name ILIKE ${"%" + query.search + "%"} OR p.sku ILIKE ${"%" + query.search + "%"} OR p.category ILIKE ${"%" + query.search + "%"})`
    : Prisma.empty;

  const categoryFilter = query.category
    ? Prisma.sql`AND p.category ILIKE ${query.category}`
    : Prisma.empty;

  if (query.lowStock) {
    const countRows = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint AS count
      FROM "Product" p
      WHERE 1=1
      ${categoryFilter}
      ${searchFilter}
      ${lowStockFilter}
    `;
    const total = Number(countRows[0]?.count ?? 0);
    const data = await prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        sku: string;
        category: string;
        unitPrice: Prisma.Decimal;
        currentStock: number;
        minimumStock: number;
        warehouseLocation: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
      SELECT *
      FROM "Product" p
      WHERE 1=1
      ${categoryFilter}
      ${searchFilter}
      ${lowStockFilter}
      ORDER BY p."createdAt" DESC
      LIMIT ${query.limit}
      OFFSET ${(query.page - 1) * query.limit}
    `;

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

  const filter: Prisma.ProductWhereInput = {
    ...(query.category ? { category: { equals: query.category, mode: "insensitive" } } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { sku: { contains: query.search, mode: "insensitive" } },
            { category: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.product.count({ where: filter }),
    prisma.product.findMany({
      where: filter,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: "desc" },
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

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError("Product not found");
  return {
    ...product,
    stockStatus: product.currentStock <= product.minimumStock ? "LOW_STOCK" : "IN_STOCK",
  };
}

export async function createProduct(input: {
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  warehouseLocation: string;
  createdBy: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: input.name,
          sku: input.sku.trim().toUpperCase(),
          category: input.category,
          unitPrice: input.unitPrice,
          currentStock: input.currentStock,
          minimumStock: input.minimumStock,
          warehouseLocation: input.warehouseLocation,
        },
      });

      if (input.currentStock > 0) {
        await tx.stockMovement.create({
          data: {
            productId: product.id,
            quantity: input.currentStock,
            movementType: "IN",
            reason: "Opening stock",
            createdBy: input.createdBy,
          },
        });
      }

      return product;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new DuplicateSkuError();
    }
    throw error;
  }
}

export async function updateProduct(
  id: string,
  input: Partial<{
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    minimumStock: number;
    warehouseLocation: string;
  }>,
) {
  await getProduct(id);
  try {
    return await prisma.product.update({
      where: { id },
      data: {
        ...input,
        ...(input.sku ? { sku: input.sku.trim().toUpperCase() } : {}),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new DuplicateSkuError();
    }
    throw error;
  }
}

export async function adjustStock(
  productId: string,
  createdBy: string,
  input: { quantity: number; movementType: "IN" | "OUT"; reason: string },
) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError("Product not found");

    if (input.movementType === "OUT" && product.currentStock < input.quantity) {
      throw new InsufficientStockError(
        `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${input.quantity}.`,
      );
    }

    const nextStock =
      input.movementType === "IN" ? product.currentStock + input.quantity : product.currentStock - input.quantity;

    if (nextStock < 0) {
      throw new InsufficientStockError(
        `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${input.quantity}.`,
      );
    }

    const updated = await tx.product.update({
      where: { id: productId },
      data: { currentStock: nextStock },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId,
        quantity: input.quantity,
        movementType: input.movementType,
        reason: input.reason,
        createdBy,
      },
    });

    return { product: updated, movement };
  });
}

export async function listMovements(productId: string, page: number, limit: number) {
  await getProduct(productId);
  const where = { productId };
  const [total, data] = await Promise.all([
    prisma.stockMovement.count({ where }),
    prisma.stockMovement.findMany({
      where,
      include: { creator: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
