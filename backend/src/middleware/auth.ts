import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AuthenticationError } from "../utils/AppError.js";
import type { Role } from "@prisma/client";

export interface AuthPayload {
  userId: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AuthenticationError("Missing or invalid Authorization header"));
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    prisma.user
      .findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true },
      })
      .then((user) => {
        if (!user) {
          next(new AuthenticationError("User no longer exists"));
          return;
        }
        req.user = user;
        next();
      })
      .catch(next);
  } catch {
    next(new AuthenticationError("Invalid or expired token"));
  }
}
