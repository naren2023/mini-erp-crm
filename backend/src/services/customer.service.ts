import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { NotFoundError } from "../utils/AppError.js";

function parseDate(value?: string | null) {
  if (!value) return null;
  return new Date(value);
}

export async function listCustomers(query: {
  page: number;
  limit: number;
  search?: string;
  status?: "LEAD" | "ACTIVE" | "INACTIVE";
  customerType?: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
}) {
  const where: Prisma.CustomerWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.customerType ? { customerType: query.customerType } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { mobile: { contains: query.search } },
            { businessName: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
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

export async function getCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      followUps: {
        include: { creator: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!customer) throw new NotFoundError("Customer not found");
  return customer;
}

export async function createCustomer(input: {
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber?: string | null;
  customerType: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
  address: string;
  status?: "LEAD" | "ACTIVE" | "INACTIVE";
  followUpDate?: string | null;
  notes?: string | null;
}) {
  return prisma.customer.create({
    data: {
      ...input,
      gstNumber: input.gstNumber || null,
      email: input.email.toLowerCase(),
      followUpDate: parseDate(input.followUpDate),
    },
  });
}

export async function updateCustomer(
  id: string,
  input: Partial<{
    name: string;
    mobile: string;
    email: string;
    businessName: string;
    gstNumber: string | null;
    customerType: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
    address: string;
    status: "LEAD" | "ACTIVE" | "INACTIVE";
    followUpDate: string | null;
    notes: string | null;
  }>,
) {
  await getCustomer(id);
  return prisma.customer.update({
    where: { id },
    data: {
      ...input,
      ...(input.email ? { email: input.email.toLowerCase() } : {}),
      ...(input.gstNumber !== undefined ? { gstNumber: input.gstNumber || null } : {}),
      ...(input.followUpDate !== undefined ? { followUpDate: parseDate(input.followUpDate) } : {}),
    },
  });
}

export async function deleteCustomer(id: string) {
  await getCustomer(id);
  await prisma.customer.delete({ where: { id } });
}

export async function addFollowUp(customerId: string, createdBy: string, note: string, followUpDate: string) {
  await getCustomer(customerId);
  const date = new Date(followUpDate);

  const [followUp] = await prisma.$transaction([
    prisma.followUp.create({
      data: { customerId, createdBy, note, followUpDate: date },
      include: { creator: { select: { id: true, name: true, role: true } } },
    }),
    prisma.customer.update({
      where: { id: customerId },
      data: { followUpDate: date },
    }),
  ]);

  return followUp;
}
