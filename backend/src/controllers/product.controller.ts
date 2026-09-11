import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, successList } from "../utils/apiResponse.js";
import * as productService from "../services/product.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.listProducts(req.query as never);
  return successList(res, result.data, result.pagination);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.id as string);
  return success(res, product);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct({ ...req.body, createdBy: req.user!.id });
  return success(res, product, "Product created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id as string, req.body);
  return success(res, product, "Product updated");
});

export const adjustStock = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.adjustStock(req.params.id as string, req.user!.id, req.body);
  return success(res, result, "Stock updated");
});

export const movements = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const result = await productService.listMovements(req.params.id as string, page, limit);
  return successList(res, result.data, result.pagination);
});
