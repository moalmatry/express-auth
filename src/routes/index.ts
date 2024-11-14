import express, { Request, Response, Router } from "express";
import user from "./user.routes";

import log from "../utils/logger";

const router: Router = express.Router();

router.get("/healthCheck", (_: Request, res: Response) => {
  log.info("The Api is Working");
  res.sendStatus(200);
});

router.use("/api/users", user);

export default router;
