import {
  forgotPasswordHandler,
  resetPasswordHandler,
} from "./../controller/user.controller";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./../schema/user.schema";
import express, { Request, Response, Router } from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schema/user.schema";
import {
  createUserHandler,
  verifyUserHandler,
} from "../controller/user.controller";
import catchAsync from "../utils/catchAsync";

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
  validateResource(resetPasswordSchema)
);

export default router;
