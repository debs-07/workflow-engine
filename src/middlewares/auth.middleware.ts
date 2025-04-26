import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { CustomJwtPayload } from "../@types/jsonwebtoken/index.ts";
import { AuthError, CustomError } from "../utils/errors.util.ts";

export const verifyJWT = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  const [startString, token] = authHeader?.split(" ") || [];

  if (startString !== "Bearer" || !token) {
    throw new AuthError("Token is invalid or expired");
  }

  let decoded: CustomJwtPayload;

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as CustomJwtPayload;
  } catch (error: unknown) {
    let errMessage: string;
    let userMessage: string;

    if (error instanceof jwt.TokenExpiredError) {
      errMessage = "Token expired";
      userMessage = "Your session has expired. Please log in again";
    } else if (error instanceof jwt.JsonWebTokenError) {
      errMessage = error.message;
      userMessage = "Invalid token provided";
    } else {
      errMessage = "Unexpected JWT error";
      userMessage = "Internal server error";
    }

    throw new CustomError(403, errMessage, userMessage);
  }

  if (!decoded.userId) {
    throw new AuthError("Token is invalid or expired");
  }

  req.userId = decoded.userId;

  next();
};
