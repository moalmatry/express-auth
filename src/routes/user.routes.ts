import express from "express";
import {
  createUserHandler,
  verifyUserHandler,
} from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schema/user.schema";
import {
  forgotPasswordHandler,
  resetPasswordHandler,
} from "./../controller/user.controller";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./../schema/user.schema";

const router = express.Router();

router.post("/", validateResource(createUserSchema), createUserHandler);

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
