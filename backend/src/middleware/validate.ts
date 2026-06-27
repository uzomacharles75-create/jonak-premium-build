import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

import { badRequest } from "../middleware/error";

export function validateJsonBody(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(badRequest("Validation failed", parsed.error.flatten()));
      return;
    }

    req.body = parsed.data;
    next();
  };
}
