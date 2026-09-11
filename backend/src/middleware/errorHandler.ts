import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError("Route not found", 404, [], "NOT_FOUND"));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "unique field";
      const isSku = String(target).toLowerCase().includes("sku");
      return res.status(409).json({
        success: false,
        message: isSku ? "A product with this SKU already exists" : `Duplicate value for ${target}`,
        errors: [],
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
        errors: [],
      });
    }
  }

  if (env.NODE_ENV !== "production") {
    console.error(err);
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
    errors: [],
  });
}
