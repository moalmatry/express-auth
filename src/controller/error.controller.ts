/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import log from '../utils/logger';

/** @description handle mongoose validation error  */
const handleValidationErrorDB = (err: AppError | any) => {
  const errors = Object.values(err.errors).map((error: any) => error.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

/** @description handle mongoose duplicate key error */
const handleDuplicateErrorDB = (err: AppError | any) => {
  const value = err.errorResponse.errmsg.match(/"([^"]*)"/g)[0];
  const message = `duplicate field value: ${value}. Please use another value! `;
  return new AppError(message, 400);
};

/** @description handle mongoose invalid key error  */
const handleCastErrorDB = (err: AppError | any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 500);
};

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
  // Operational, trusted error: send message to client

  if (err.isOperational) {
    // log.error('isOperational');
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming error details not important from client
  } else if (!err.isOperational) {
    // log.error('!isOperational');
    log.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong, please try again later.',
    });
  }
};

/** this method handler to catch all errors in all the app
 *  @description create environment variable called PROJECT_ENV , if PROJECT_ENV === development you will get specific error messages in responses ,if PROJECT_ENV === production you will get short error messages for clients ,Default it sends production error
 */
// NOTE: don't remove next function even though you don't use it because it will makes socket.io error
const globalErrorHandler = (err: AppError | any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // log.error(err);

  if (process.env.PROJECT_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.PROJECT_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
      sendErrorProduction(error, res);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
      sendErrorProduction(error, res);
    }
    sendErrorProduction(err, res);
  } else {
    sendErrorProduction(err, res);
  }
};

export default globalErrorHandler;
