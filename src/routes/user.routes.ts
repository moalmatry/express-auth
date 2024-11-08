import express, { Router } from "express";
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

const router: Router = express.Router();

router.post("/", validateResource(createUserSchema), createUserHandler);

router.post(
  "/verify/:id/:verification-code",
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
