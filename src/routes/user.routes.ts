import express, { Request, Response, Router } from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schema/user.schema";
import {
  createUserHandler,
  verifyUserHandler,
} from "../controller/user.controller";

const router: Router = express.Router();

router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

router.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

export default router;
