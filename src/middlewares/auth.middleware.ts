import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { CustomJwtPayload } from "../@types/jsonwebtoken/index.ts";
import { AuthError } from "../utils/errors.util.ts";

export const verifyJWT = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  const [startString, token] = authHeader?.split(" ") || [];

  if (startString !== "Bearer" || !token) {
    throw new AuthError("Token is invalid or expired");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY!
  ) as CustomJwtPayload;

  if (!decoded.userId) {
    throw new AuthError("Token is invalid or expired");
  }

  req.userId = decoded.userId;

  next();
};
