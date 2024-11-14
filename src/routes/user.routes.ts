import express from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schema/user.schema";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./../schema/user.schema";
import { createSessionSchema } from "../schema/auth.schema";
import {
  createSessionHandler,
  createUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controller/auth.controller";

const router = express.Router();

// NOTE: Authentication Routes
router.post("/signup", validateResource(createUserSchema), createUserHandler);

router.post(
  "/login",
  validateResource(createSessionSchema),
  createSessionHandler
);

// NOTE: Verification & Reset Password Routes
router.post(
  "/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.post(
  "/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

router.post(
  "/reset-password/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
