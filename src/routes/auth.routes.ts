import { Router } from "express";

import {
  validateSignUp,
  validateSignIn,
} from "../middlewares/validate.middleware.ts";
import { signUp, signIn } from "../controllers/auth.controller.ts";

const router = Router();

router.post("/signup", validateSignUp, signUp);
router.post("/login", validateSignIn, signIn);

export default router;
