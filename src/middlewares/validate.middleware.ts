import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { ValidationError } from "../utils/errors.util.ts";

const HandleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    throw new ValidationError(`Validation Failed : ${errorMessages}`);
  }
  next();
};

const emailValidator = body("email")
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage("Email format is invalid");

const passwordValidatorSignUp = body("password")
  .isLength({ min: 6 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]+$/)
  .withMessage(
    "Password must be at least 6 characters, with 1 uppercase, 1 lowercase, and 1 number"
  );

const nameValidatorSignUp = body("name")
  .trim()
  .isLength({ min: 3 })
  .withMessage("Name must be at least 3 characters long");

const passwordValidatorSignIn = body("password")
  .notEmpty()
  .withMessage("Password is required");

export const validateSignUp = [
  emailValidator,
  passwordValidatorSignUp,
  nameValidatorSignUp,
  HandleValidationResult,
];

export const validateSignIn = [
  emailValidator,
  passwordValidatorSignIn,
  HandleValidationResult,
];
