import type { Request, Response, NextFunction } from "express";

export const validateTaskId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  next();
};