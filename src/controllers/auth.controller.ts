import { Request, Response, NextFunction } from "express";

import { createResponse } from "../helpers/response.helper.ts";
import { signUpService, signInService } from "../services/auth.service.ts";

export const signUp = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password, name } = req.body;

  await signUpService(email, password, name);

  res.status(201).json(
    createResponse({
      message: "Sign-up successful. You may now log in.",
    })
  );
  return;
};

export const signIn = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password } = req.body;

  const jwtToken = await signInService(email, password);

  res.status(200).json(
    createResponse({
      message: "Sign-in successful.",
      data: { token: jwtToken },
    })
  );
  return;
};
