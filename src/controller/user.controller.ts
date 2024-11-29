/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import {
  deleteMe,
  deleteUser,
  findUserByEmail,
  getUsers,
  restoreUser,
  updateMe,
  updateUser,
} from '../services/user.service';
import { CustomRequests, ExtendedUser } from '../types';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { Profile, User } from '@prisma/client';
import { DeleteUserInput, RestoreUserInput, UpdateMeInput, UpdateUserInput } from '../schema/user.schema';

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
  async (req: CustomRequests<object, UpdateMeInput>, res: Response, next: NextFunction) => {
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

export const deleteUserHandler = catchAsync(
  async (req: Request<object, object, DeleteUserInput>, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const checkUser = await findUserByEmail(email);

    if (!checkUser) {
      return next(new AppError('User Not found or already deleted', 404));
    }

    await deleteUser(email);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);

/** @description reactivate deleted users  */
export const restoreUserHandler = catchAsync(
  async (req: Request<object, object, RestoreUserInput>, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const isRestored = await restoreUser(email);

    if (!isRestored) {
      return next(new AppError('Can not restore user right now. Please try again later', 500));
    }

    res.status(200).json({
      status: 'success',
      message: 'user restored successfully',
    });
  },
);

/** @description returns user info  */
export const getMeHandler = catchAsync(async (req: CustomRequests, res: Response, next: NextFunction) => {
  const user: ExtendedUser = req.user;
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        phoneNumber: user.profile.phoneNumber,
        gender: user.profile.gender,
        createdAt: user.createdAt,
        verified: user.verified,
      },
    },
  });
});

/** @description makes admin update user data */
export const updateUserHandler = catchAsync(
  async (req: Request<object, object, UpdateUserInput>, res: Response, next: NextFunction) => {
    const { email, firstName, fullAddress, gender, lastName, phoneNumber, role, verified, active } = req.body;

    if (!phoneNumber && !fullAddress && !email && !firstName && !lastName && !gender && role && verified) {
      return next(new AppError('There is no data to update', 400));
    }

    const updatedUser = await updateUser(email, {
      email,
      firstName,
      fullAddress,
      gender,
      lastName,
      phoneNumber,
      role,
      verified,
      active,
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
