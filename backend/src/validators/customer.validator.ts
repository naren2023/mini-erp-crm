import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid id"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

const indianMobile = z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

export const customerCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: indianMobile,
  email: z.string().email("Enter a valid email address"),
  businessName: z.string().min(2, "Business name is required"),
  gstNumber: z.union([z.string().length(15, "GST number must be 15 characters"), z.literal(""), z.null()]).optional(),
  customerType: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]),
  address: z.string().min(5, "Address is required"),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).default("LEAD"),
  followUpDate: z
    .union([z.string().min(1), z.literal(""), z.null()])
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Follow-up date must be valid"),
  notes: z.string().optional().nullable(),
});

export const customerUpdateSchema = customerCreateSchema.partial();

export const customerListQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).optional(),
  customerType: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]).optional(),
});

export const followUpSchema = z.object({
  note: z.string().min(2, "Follow-up note is required"),
  followUpDate: z.string().min(1, "Follow-up date is required").refine((value) => !Number.isNaN(Date.parse(value)), "Follow-up date must be valid"),
});
