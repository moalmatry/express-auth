import express, { Request, Response, Router } from "express";
import user from "./user.routes";
import auth from "./auth.routes";
import log from "../utils/logger";

const router: Router = express.Router();

router.get("/healthCheck", (_: Request, res: Response) => {
  log.info("The Api is Working");
  res.sendStatus(200);
});

router.use("/api/users", user);
router.use(auth);

export default router;