import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/errors.util.ts";
import { createResponse } from "../helpers/response.helper.ts";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handling known errors
  if (error instanceof AppError) {
    res.status(error.status).json(
      createResponse({
        message: error.message,
        success: false,
        errors: null,
        data: null,
      })
    );
    return;
  }

  // Handling unexpected errors
  console.error("Unexpected error: ", error);
  res.status(500).json(
    createResponse({
      message: "Internal server error",
      success: false,
      errors: null,
      data: null,
    })
  );
  return;
};
