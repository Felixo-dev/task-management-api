import type { Request, Response, NextFunction } from "express";
import { AppError } from "../types/app-error.js";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
};