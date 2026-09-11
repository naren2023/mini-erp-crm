import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import * as dashboardService from "../services/dashboard.service.js";

export const get = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getDashboard();
  return success(res, data);
});
