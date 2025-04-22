import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/errors.util.ts";
import { createResponse } from "../helpers/response.helper.ts";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Request error
  if (error instanceof AppError) {
    console.error("Request error : ", error);
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

  // Unexpected errors
  console.error("Unexpected error : ", error);
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
