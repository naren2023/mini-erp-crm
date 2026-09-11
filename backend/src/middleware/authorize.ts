import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { AuthenticationError, AuthorizationError } from "../utils/AppError.js";

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError());
    }
    next();
  };
}
