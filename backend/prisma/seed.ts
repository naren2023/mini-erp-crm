import bcrypt from "bcrypt";
import { PrismaClient, CustomerType, CustomerStatus, MovementType, ChallanStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "Password123!";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  await prisma.salesChallanItem.deleteMany();
  await prisma.salesChallan.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const [admin, sales, warehouse, accounts] = await Promise.all([
    prisma.user.create({
      data: { name: "Asha Mehta", email: "admin@example.com", password: passwordHash, role: Role.ADMIN },
    }),
    prisma.user.create({
      data: { name: "Rohit Sharma", email: "sales@example.com", password: passwordHash, role: Role.SALES },
    }),
    prisma.user.create({
      data: { name: "Kiran Patel", email: "warehouse@example.com", password: passwordHash, role: Role.WAREHOUSE },
    }),
    prisma.user.create({
      data: { name: "Neha Gupta", email: "accounts@example.com", password: passwordHash, role: Role.ACCOUNTS },
    }),
  ]);

  const customers = await prisma.customer.createManyAndReturn({
    data: [
      {
        name: "Vikram Singh",
        mobile: "9876543210",
        email: "vikram@singhtraders.com",
        businessName: "Singh Traders",
        gstNumber: "27AABCS1234A1Z5",
        customerType: CustomerType.WHOLESALE,
        address: "12 MG Road, Pune, Maharashtra 411001",
        status: CustomerStatus.ACTIVE,
        followUpDate: new Date("2026-09-15"),
        notes: "Prefers monthly bulk orders of fasteners and tools.",
      },
      {
        name: "Priya Nair",
        mobile: "9123456780",
        email: "priya@nairdistributors.in",
        businessName: "Nair Distributors",
        gstNumber: "32AADCN9988B1Z2",
        customerType: CustomerType.DISTRIBUTOR,
        address: "88 Industrial Estate, Kochi, Kerala 682030",
        status: CustomerStatus.ACTIVE,
        followUpDate: new Date("2026-09-12"),
        notes: "Statewide distributor. Credit terms 30 days.",
      },
      {
        name: "Arjun Reddy",
        mobile: "9988776655",
        email: "arjun@reddyhardware.com",
        businessName: "Reddy Hardware",
        gstNumber: null,
        customerType: CustomerType.RETAIL,
        address: "4 Banjara Hills, Hyderabad, Telangana 500034",
        status: CustomerStatus.LEAD,
        followUpDate: new Date("2026-09-11"),
        notes: "Lead from trade show. Interested in power tools.",
      },
      {
        name: "Meera Joshi",
        mobile: "9012345678",
        email: "accounts@joshiwholesale.com",
        businessName: "Joshi Wholesale Mart",
        gstNumber: "24AAACJ4455C1Z8",
        customerType: CustomerType.WHOLESALE,
        address: "Plot 22, GIDC, Ahmedabad, Gujarat 382445",
        status: CustomerStatus.INACTIVE,
        followUpDate: null,
        notes: "Paused due to warehouse renovation.",
      },
      {
        name: "Sanjay Kapoor",
        mobile: "9765432109",
        email: "sanjay@kapoorenterprises.com",
        businessName: "Kapoor Enterprises",
        gstNumber: "07AAACK7788D1Z1",
        customerType: CustomerType.DISTRIBUTOR,
        address: "Okhla Phase 2, New Delhi 110020",
        status: CustomerStatus.ACTIVE,
        followUpDate: new Date("2026-09-20"),
        notes: "North India distributor for electronics accessories.",
      },
    ],
  });

  await prisma.followUp.createMany({
    data: [
      {
        customerId: customers[0].id,
        note: "Discussed Q3 volume rebate. Follow up after stock replenishment.",
        followUpDate: new Date("2026-08-20"),
        createdBy: sales.id,
      },
      {
        customerId: customers[0].id,
        note: "Confirm September delivery window.",
        followUpDate: new Date("2026-09-15"),
        createdBy: sales.id,
      },
      {
        customerId: customers[1].id,
        note: "Shared updated price list for cables.",
        followUpDate: new Date("2026-09-12"),
        createdBy: sales.id,
      },
      {
        customerId: customers[2].id,
        note: "Send catalogue and sample SKUs.",
        followUpDate: new Date("2026-09-11"),
        createdBy: admin.id,
      },
    ],
  });

  const products = await prisma.product.createManyAndReturn({
    data: [
      {
        name: "Laptop",
        sku: "ELC-LAP-001",
        category: "Electronics",
        unitPrice: 52000,
        currentStock: 5,
        minimumStock: 8,
        warehouseLocation: "WH-A / Rack 12",
      },
      {
        name: "Wireless Mouse",
        sku: "ELC-MOU-014",
        category: "Electronics",
        unitPrice: 650,
        currentStock: 120,
        minimumStock: 40,
        warehouseLocation: "WH-A / Rack 3",
      },
      {
        name: "HDMI Cable 2m",
        sku: "CAB-HDM-002",
        category: "Cables",
        unitPrice: 180,
        currentStock: 18,
        minimumStock: 25,
        warehouseLocation: "WH-B / Bin 7",
      },
      {
        name: "Impact Drill 500W",
        sku: "TOL-DRL-110",
        category: "Tools",
        unitPrice: 2450,
        currentStock: 40,
        minimumStock: 15,
        warehouseLocation: "WH-C / Aisle 2",
      },
      {
        name: "Safety Helmet",
        sku: "PPE-HLM-009",
        category: "Safety",
        unitPrice: 320,
        currentStock: 9,
        minimumStock: 20,
        warehouseLocation: "WH-C / Aisle 8",
      },
      {
        name: "A4 Copier Paper (500 sheets)",
        sku: "STN-PAP-500",
        category: "Stationery",
        unitPrice: 310,
        currentStock: 200,
        minimumStock: 50,
        warehouseLocation: "WH-B / Pallet 1",
      },
    ],
  });

  const laptop = products.find((p) => p.sku === "ELC-LAP-001")!;
  const mouse = products.find((p) => p.sku === "ELC-MOU-014")!;
  const hdmi = products.find((p) => p.sku === "CAB-HDM-002")!;
  const drill = products.find((p) => p.sku === "TOL-DRL-110")!;
  const helmet = products.find((p) => p.sku === "PPE-HLM-009")!;

  await prisma.stockMovement.createMany({
    data: [
      { productId: laptop.id, quantity: 10, movementType: MovementType.IN, reason: "Opening stock", createdBy: warehouse.id },
      { productId: laptop.id, quantity: 5, movementType: MovementType.OUT, reason: "Confirmed challan CH-20260901-0001", createdBy: warehouse.id },
      { productId: mouse.id, quantity: 150, movementType: MovementType.IN, reason: "Opening stock", createdBy: warehouse.id },
      { productId: mouse.id, quantity: 30, movementType: MovementType.OUT, reason: "Confirmed challan CH-20260901-0001", createdBy: warehouse.id },
      { productId: hdmi.id, quantity: 40, movementType: MovementType.IN, reason: "Opening stock", createdBy: warehouse.id },
      { productId: hdmi.id, quantity: 22, movementType: MovementType.OUT, reason: "Retail dispatch", createdBy: warehouse.id },
      { productId: drill.id, quantity: 40, movementType: MovementType.IN, reason: "Vendor GRN", createdBy: warehouse.id },
      { productId: helmet.id, quantity: 25, movementType: MovementType.IN, reason: "Opening stock", createdBy: warehouse.id },
      { productId: helmet.id, quantity: 16, movementType: MovementType.OUT, reason: "Safety kit orders", createdBy: warehouse.id },
    ],
  });

  const confirmed = await prisma.salesChallan.create({
    data: {
      challanNumber: "CH-20260901-0001",
      customerId: customers[0].id,
      totalQuantity: 35,
      status: ChallanStatus.CONFIRMED,
      createdBy: sales.id,
      items: {
        create: [
          {
            productId: laptop.id,
            productNameSnapshot: "Laptop",
            skuSnapshot: "ELC-LAP-001",
            unitPriceSnapshot: 52000,
            quantity: 5,
          },
          {
            productId: mouse.id,
            productNameSnapshot: "Wireless Mouse",
            skuSnapshot: "ELC-MOU-014",
            unitPriceSnapshot: 650,
            quantity: 30,
          },
        ],
      },
    },
  });

  const draft = await prisma.salesChallan.create({
    data: {
      challanNumber: "CH-20260911-0001",
      customerId: customers[1].id,
      totalQuantity: 12,
      status: ChallanStatus.DRAFT,
      createdBy: sales.id,
      items: {
        create: [
          {
            productId: laptop.id,
            productNameSnapshot: "Laptop",
            skuSnapshot: "ELC-LAP-001",
            unitPriceSnapshot: 52000,
            quantity: 8,
          },
          {
            productId: hdmi.id,
            productNameSnapshot: "HDMI Cable 2m",
            skuSnapshot: "CAB-HDM-002",
            unitPriceSnapshot: 180,
            quantity: 4,
          },
        ],
      },
    },
  });

  await prisma.salesChallan.create({
    data: {
      challanNumber: "CH-20260820-0003",
      customerId: customers[4].id,
      totalQuantity: 10,
      status: ChallanStatus.CANCELLED,
      createdBy: admin.id,
      items: {
        create: [
          {
            productId: drill.id,
            productNameSnapshot: "Impact Drill 500W",
            skuSnapshot: "TOL-DRL-110",
            unitPriceSnapshot: 2450,
            quantity: 10,
          },
        ],
      },
    },
  });

  console.log("Seed complete.");
  console.log("Test password for all users:", DEMO_PASSWORD);
  console.log("Users: admin@example.com, sales@example.com, warehouse@example.com, accounts@example.com");
  console.log("Draft challan for insufficient-stock demo:", draft.challanNumber, "(Laptop qty 8 vs stock 5)");
  console.log("Confirmed sample challan:", confirmed.challanNumber);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
