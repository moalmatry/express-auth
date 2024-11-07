import { NextFunction, Request, Response } from "express";

// Define a generic type for your async function
type AsyncFunction<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

export default function <T>(fn: AsyncFunction<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure that 'next' is a required parameter and handle async errors
    fn(req, res, next).catch((err) => next(err));
  };
}
