import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Getting token and check of it's there

  // 2) Verify token
  // 3) If user still exists

  // 4) If user changed password after the JWT was issued

  next();
});
