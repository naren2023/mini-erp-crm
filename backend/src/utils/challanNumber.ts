import { prisma } from "../config/prisma.js";

export async function generateChallanNumber(date = new Date()): Promise<string> {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const prefix = `CH-${yyyy}${mm}${dd}-`;

  const latest = await prisma.salesChallan.findFirst({
    where: { challanNumber: { startsWith: prefix } },
    orderBy: { challanNumber: "desc" },
    select: { challanNumber: true },
  });

  const nextSeq = latest ? Number(latest.challanNumber.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(nextSeq).padStart(4, "0")}`;
}
