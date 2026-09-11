import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, successList } from "../utils/apiResponse.js";
import * as challanService from "../services/challan.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await challanService.listChallans(req.query as never);
  return successList(res, result.data, result.pagination);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challanService.getChallan(req.params.id as string);
  return success(res, challan);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challanService.createChallan(req.user!.id, req.body);
  return success(res, challan, "Draft challan created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challanService.updateChallan(req.params.id as string, req.body);
  return success(res, challan, "Challan updated");
});

export const confirm = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challanService.confirmChallan(req.params.id as string, req.user!.id);
  return success(res, challan, "Challan confirmed");
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challanService.cancelChallan(req.params.id as string);
  return success(res, challan, "Challan cancelled");
});
