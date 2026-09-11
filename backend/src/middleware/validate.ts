import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validate(
  schema: ZodType,
  source: "body" | "query" | "params" = "body",
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(result.error);
    }

    if (source === "query") {
      // Express 5 exposes req.query through a getter.
      // Define an own property containing the Zod-parsed values.
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else if (source === "params") {
      req.params = result.data as Request["params"];
    } else {
      req.body = result.data;
    }

    next();
  };
}