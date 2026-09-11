import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import * as authService from "../services/auth.service.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);
  return success(
    res,
    {
      token: result.token,
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
    "Logged in successfully",
  );
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  return success(res, user);
});
