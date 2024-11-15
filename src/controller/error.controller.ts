import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

/** this method handler to catch all errors in all the app */
const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandler;
