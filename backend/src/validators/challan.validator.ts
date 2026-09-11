import { z } from "zod";
import { paginationSchema } from "./customer.validator.js";

const challanItemSchema = z.object({
  productId: z.string().uuid("Invalid product id"),
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
});

export const challanCreateSchema = z.object({
  customerId: z.string().uuid("Invalid customer id"),
  items: z.array(challanItemSchema).min(1, "Add at least one product"),
});

export const challanUpdateSchema = challanCreateSchema;

export const challanListQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
  customerId: z.string().uuid().optional(),
});
