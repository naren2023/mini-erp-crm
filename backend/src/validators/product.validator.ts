import { z } from "zod";
import { paginationSchema } from "./customer.validator.js";

export const productCreateSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(3, "SKU is required").max(40),
  category: z.string().min(2, "Category is required"),
  unitPrice: z.coerce.number().positive("Unit price must be greater than 0"),
  currentStock: z.coerce.number().int().nonnegative("Stock cannot be negative").default(0),
  minimumStock: z.coerce.number().int().nonnegative("Minimum stock cannot be negative").default(0),
  warehouseLocation: z.string().min(1, "Warehouse location is required"),
});

export const productUpdateSchema = productCreateSchema.omit({ currentStock: true }).partial();

export const productListQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  lowStock: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export const stockMovementSchema = z.object({
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
  movementType: z.enum(["IN", "OUT"]),
  reason: z.string().min(2, "Reason is required"),
});
