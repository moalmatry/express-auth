import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { getUsers, updateMe } from '../services/user.service';
import { CustomRequests } from '../types';
import { updateMeInput } from '../schema/user.schema';
import AppError from '../utils/AppError';

/** @description returns all users from db
 *  @example   res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
 */
export const getAllUsersHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await getUsers();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

export const updateMeHandler = catchAsync(
  async (req: CustomRequests<object, updateMeInput>, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const { phoneNumber, fullAddress, email, firstName, lastName, gender } = req.body;

    if (!phoneNumber && !fullAddress && !email && !firstName && !lastName && !gender) {
      return next(new AppError('There is no data to update', 400));
    }

    const updatedUser = await updateMe(id, {
      phoneNumber,
      fullAddress,
      email,
      firstName,
      lastName,
      gender,
    });
    res.status(200).json({
      status: 'success',
      data: {
        ...updatedUser,
      },
    });
  },
);
