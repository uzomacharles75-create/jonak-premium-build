import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";

import { HttpError, isHttpError } from "../utils/http-error";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (res.headersSent) {
    return;
  }

  if (isHttpError(error)) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.message, code: error.code });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: "Unexpected server error" });
}

export function badRequest(message: string, details?: unknown) {
  return new HttpError(400, message, details);
}
