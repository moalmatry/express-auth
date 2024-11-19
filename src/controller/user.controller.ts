import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { getUsers } from '../services/user.service';

/** @description returns all users from db
 *  @example   res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
 */
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await getUsers();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});
