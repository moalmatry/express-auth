/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { signJWT } from './jwt';
import { User } from '@prisma/client';

/** @description create token and send response
 * @example   res.status(statusCode).json({
    status: 'success',
    token,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    verificationCode: user?.verificationCode,
    createdAt: user?.createdAt,
  });
 */
export const createSendToken = (user: User | any, statusCode: number, res: Response) => {
  const token = signJWT(user.id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      verificationCode: user?.verificationCode,
      createdAt: user?.createdAt,
    },
  });
};
