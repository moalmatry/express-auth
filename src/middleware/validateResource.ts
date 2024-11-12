import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const validateResource =
  (schema: z.AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      res.status(400).json({ errors: error });
      // next(error);
    }
  };

export default validateResource;
