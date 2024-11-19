import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../types';
import AppError from '../utils/AppError';

export const restrictTo = (role: Role) => (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user.role !== role) {
    return next(new AppError("You don't have permission to perform this action", 403));
  }

  next();
};
