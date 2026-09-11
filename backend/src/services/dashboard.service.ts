import { prisma } from "../config/prisma.js";

export async function getDashboard() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalCustomers, totalProducts, totalChallans, lowStockProducts, recentChallans, followUps] =
    await Promise.all([
      prisma.customer.count(),
      prisma.product.count(),
      prisma.salesChallan.count(),
      prisma.$queryRaw<
        Array<{
          id: string;
          name: string;
          sku: string;
          currentStock: number;
          minimumStock: number;
          warehouseLocation: string;
          category: string;
        }>
      >`
        SELECT id, name, sku, "currentStock", "minimumStock", "warehouseLocation", category
        FROM "Product"
        WHERE "currentStock" <= "minimumStock"
        ORDER BY "currentStock" ASC
        LIMIT 8
      `,
      prisma.salesChallan.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true, businessName: true } },
        },
      }),
      prisma.customer.findMany({
        where: { followUpDate: { not: null } },
        orderBy: { followUpDate: "asc" },
        take: 8,
        select: {
          id: true,
          name: true,
          businessName: true,
          status: true,
          followUpDate: true,
          mobile: true,
        },
      }),
    ]);

  const lowStockCountRows = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count FROM "Product" WHERE "currentStock" <= "minimumStock"
  `;

  return {
    cards: {
      totalCustomers,
      totalProducts,
      lowStockProducts: Number(lowStockCountRows[0]?.count ?? 0),
      totalChallans,
    },
    recentChallans,
    lowStockProducts,
    followUps,
  };
}
