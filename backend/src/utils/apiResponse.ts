import type { Response } from "express";

export function success<T>(res: Response, data: T, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, message });
}

export function successList<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number },
  message = "Success",
) {
  return res.status(200).json({ success: true, data, pagination, message });
}
