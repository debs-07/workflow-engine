import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/auth/user.model.ts";
import { AuthError, ConflictError } from "../utils/errors.util.ts";

export const signUpService = async (
  email: string,
  password: string,
  name: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ConflictError("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({ email: email, password: hashedPassword, name: name });
  await user.save();
};

export const signInService = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AuthError("Invalid credentials");
  }

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "4h",
  });

  return jwtToken;
};
