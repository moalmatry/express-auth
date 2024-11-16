/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import AppError from '../utils/AppError';

/** @description send detailed errors PROJECT_ENV === development  */
const sendErrorDev = (err: AppError | any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    statusbar: err.stack,
  });
};

/** @description send detailed errors PROJECT_ENV === production  */
const sendErrorProduction = (err: AppError | any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

/** this method handler to catch all errors in all the app
 *  @description create environment variable called PROJECT_ENV , if PROJECT_ENV === development you    will get specific error messages in responses ,if PROJECT_ENV === production you will get short error messages for clients
 */
const globalErrorHandler = (err: AppError | any, req: Request, res: Response) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.PROJECT_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.PROJECT_ENV === 'production') {
    sendErrorProduction(err, res);
  } else {
    sendErrorDev(err, res);
  }
};

export default globalErrorHandler;
