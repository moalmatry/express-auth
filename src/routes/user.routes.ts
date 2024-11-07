import express, { Request, Response, Router } from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";
import { createUserHandler } from "../controller/user.controller";

const router: Router = express.Router();

router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

export default router;
