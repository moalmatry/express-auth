import { createSessionHandler } from "./../controller/auth.controller";
import express, { Router } from "express";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router: Router = express.Router();

router.post("/", validateResource(createSessionSchema), createSessionHandler);

export default router;
