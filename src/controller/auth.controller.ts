import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { CreateUserInput } from '../schema/auth.schema';
import { ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import { signAccessToken, signRefreshToken } from '../services/auth.service';
import { createUser, findUserByEmail, findUserById } from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import log from '../utils/logger';
import sendEmail from '../utils/mailer';
import AppError from '../utils/AppError';

export const createSessionHandler = catchAsync(
  async (req: Request<object, object, CreateUserInput>, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return next(new AppError('Invalid email or password', 400));
    }

    if (!user.verified) {
      return next(new AppError('Email not verified', 400));
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return next(new AppError('Invalid email or password', 400));
    }

    // sign a access token
    const accessToken = signAccessToken(user);

    // sign refresh token
    const refreshToken = await signRefreshToken({
      userId: String(user._id),
    });

    // send tokens

    res.status(200).json({ message: 'Success', accessToken, refreshToken });
    return;
  },
);

export const createUserHandler = catchAsync(
  async (req: Request<object, object, CreateUserInput>, res: Response): Promise<void> => {
    const { body } = req;

    const user = await createUser(body);
    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: 'Please verify your email',
      text: `Please click on the link to verify your email code is :${user.verificationCode} user-Id: ${user._id}`,
    });

    res.status(201).json({ message: 'User created successfully' });
    return;
    // } catch (e: any) {
    //   if (e.code === 11000) {
    //     res.status(400).json({
    //       message: "Email already exists",
    //     });
    //     return;
    //   }

    //   res.status(500).json({ message: e });
    //   next(e);
    //   return;
    // }
  },
);

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
      user.verified = true;
      await user.save();

      res.status(200).json({ message: 'User verified successfully' });
      return;
    } else {
      return next(new AppError('Invalid verification code or something went wrong', 400));
    }
  },
);

export const forgotPasswordHandler = catchAsync(
  async (req: Request<object, object, ForgotPasswordInput>, res: Response, next: NextFunction) => {
    const { email } = req.body;
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

    const passwordResetCode = nanoid();

    user.passwordRestCode = passwordResetCode;
    await user.save();

    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `User id is: ${user._id} ,Password reset code: ${passwordResetCode}`,
    });
    log.debug(`Password reset code sent to ${email}`);
    res.status(200).json({
      status: 'success',
      message: 'Email has been sent to your email. Please check your inbox.',
    });
    return;
  },
);

export const resetPasswordHandler = catchAsync(
  async (
    req: Request<ResetPasswordInput['params'], object, ResetPasswordInput['body']>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await findUserById(id);

    if (!user || !user.passwordRestCode || user.passwordRestCode !== passwordResetCode) {
      return next(new AppError('Could not reset user password', 400));
    }

    user.passwordRestCode = null;
    user.password = password;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
    return;
  },
);
