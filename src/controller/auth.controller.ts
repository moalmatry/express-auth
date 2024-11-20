import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { CreateLoginInput } from '../schema/auth.schema';
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import {
  createUser,
  findUserByEmail,
  findUserById,
  updatePassword,
  updatePasswordResetCode,
  verifyEmail,
} from '../services/user.service';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { correctPassword, signJWT } from '../utils/jwt';
import log from '../utils/logger';
import sendEmail from '../utils/mailer';
import argon2 from 'argon2';

/** @description login controller that returns token if it success
 *  @example res.status(200).json({ status: 'success', token });
 */
export const loginHandler = catchAsync(
  async (req: Request<object, object, CreateLoginInput>, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (!user.verified) {
      return next(new AppError('Email not verified', 400));
    }
    const isCorrect = await correctPassword(password, user.password);

    if (!isCorrect) {
      return next(new AppError('Invalid email or password', 401));
    }
    // send tokens
    const token = signJWT(user?.id as string);
    res.status(200).json({ status: 'success', token });
    return;
  },
);
/** @description signup controller that returns token if it success  and also returns user data
 * @example  
 * res.status(201).json({
      status: 'success',
      token,
      data: {
        firstName: "Mohamed",
        lastName: "Almatry",
        email: "test@test.com",
        verificationCode: "xxxxxxxxxxxxxxxxxxx",
        createdAt: "2024-14-10",
      },
    });
 * 
*/
export const signupHandler = catchAsync(
  async (req: Request<object, object, CreateUserInput>, res: Response, next: NextFunction): Promise<void> => {
    const { body } = req;
    // create user
    const user = await createUser(body);
    // send verification email
    await sendEmail({
      from: 'test@example.com',
      to: user?.email,
      subject: 'Please verify your email',
      text: `Please click on the link to verify your email code is :${user?.verificationCode} user-Id: ${user?.id}`,
    });

    // create token
    const token = signJWT(user?.id as string);

    res.status(201).json({
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
    return;
  },
);
/** @description  sends email to users to verify your email 
 * @example res.status(200).json({
        status: 'success',
        message: 'User verified successfully',
      });
 * 
*/
export const verifyUserHandler = catchAsync(
  async (req: Request<VerifyUserInput>, res: Response, next: NextFunction) => {
    const { id, verificationCode } = req.params;

    // try {
    // Find the user by id
    const user = await findUserById(id);

    if (!user) {
      return next(new AppError('Could not verify user', 400));
    }

    // Check to see if they are already verified
    if (user.verified) {
      return next(new AppError('Email already verified', 400));
    }

    // Check to see if the verification code matches
    if (user.verificationCode === verificationCode) {
      await verifyEmail(id);
      res.status(200).json({
        status: 'success',
        message: 'User verified successfully',
      });
      return;
    } else {
      return next(new AppError('Invalid verification code or something went wrong', 400));
    }
  },
);
/** @description sends email to users to request rest password
 * @example  
 * res.status(200).json({
        status: 'success',
        message: 'Email has been sent to your email. Please check your inbox.',
      });
 */
export const forgotPasswordHandler = catchAsync(
  // TODO: make token expiration time 10 minutes
  async (req: Request<object, object, ForgotPasswordInput>, res: Response, next: NextFunction) => {
    const { email } = req.body;
    // 1) Get user
    const user = await findUserByEmail(email);
    if (!user) {
      // log.debug(`User with email ${email} does't exist.`);
      res.status(200).json({
        status: 'success',
        message: 'Email has been sent to your email. Please check your inbox.',
      });
      return;
    }

    if (!user.verified) {
      return next(new AppError('User is not verified. Please verify your email first.', 400));
    }
    // 2) generate random token

    const passwordResetCode = nanoid();
    const hashedPasswordResetCode = await argon2.hash(passwordResetCode);

    await updatePasswordResetCode(user.id, hashedPasswordResetCode);

    // 3) send email to user

    try {
      await sendEmail({
        from: 'test@example.com',
        to: user.email,
        subject: 'Password Reset Request',
        text: `User id is: ${user.id} ,Password reset code: ${passwordResetCode}`,
      });
      log.debug(`Password reset code sent to ${email}`);
      res.status(200).json({
        status: 'success',
        message: 'Email has been sent to your email. Please check your inbox.',
      });
    } catch (err) {
      log.error(err);
      await updatePasswordResetCode(user.id, null);

      return next(new AppError('There was an error sending email. Try again later', 500));
    }
    return;
  },
);
/** @description reset user password
 * @example
 *    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
 */
export const resetPasswordHandler = catchAsync(
  async (
    req: Request<ResetPasswordInput['params'], object, ResetPasswordInput['body']>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    // 1) Get user based on token
    const user = await findUserById(id);
    const isOldPassword = await correctPassword(password, user?.password as string);
    const correctResetCode = await correctPassword(passwordResetCode, user?.passwordRestCode as string);
    if (!user || !user.passwordRestCode || !correctResetCode) {
      return next(new AppError('Could not reset user password', 400));
    }

    if (Number(user.passwordRestExpires) < Date.now()) {
      return next(new AppError('reset code has expired', 400));
    }

    if (isOldPassword) {
      return next(new AppError('New Password can not be as old password', 400));
    }
    // user.passwordRestCode = null;
    updatePasswordResetCode(id, null);
    // user.password = password;
    updatePassword(user.id, password);
    // await user.save();

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
    return;
  },
);

// TODO: try to reset password after 10 minutes
