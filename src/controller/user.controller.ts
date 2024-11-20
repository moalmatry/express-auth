import { NextFunction, Request, Response } from 'express';
import { updateMeInput } from '../schema/user.schema';
import { deleteMe, getUsers, updateMe } from '../services/user.service';
import { CustomRequests } from '../types';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

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

/**@description update user data without password and returns updated user */
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
        user: {
          ...updatedUser,
        },
      },
    });
  },
);

/** @description delete user by id  (make active false in db)*/
export const deleteMeHandler = catchAsync(async (req: CustomRequests, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const isDeleted = await deleteMe(id as string);
  if (!isDeleted) {
    return next(new AppError('Can not delete user right now. Please try again later', 500));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
