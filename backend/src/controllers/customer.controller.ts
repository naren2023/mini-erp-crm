import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, successList } from "../utils/apiResponse.js";
import * as customerService from "../services/customer.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await customerService.listCustomers(req.query as never);
  return successList(res, result.data, result.pagination);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomer(req.params.id as string);
  return success(res, customer);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);
  return success(res, customer, "Customer created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.updateCustomer(req.params.id as string, req.body);
  return success(res, customer, "Customer updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await customerService.deleteCustomer(req.params.id as string);
  return success(res, null, "Customer deleted");
});

export const addFollowUp = asyncHandler(async (req: Request, res: Response) => {
  const followUp = await customerService.addFollowUp(
    req.params.id as string,
    req.user!.id,
    req.body.note,
    req.body.followUpDate,
  );
  return success(res, followUp, "Follow-up added", 201);
});
