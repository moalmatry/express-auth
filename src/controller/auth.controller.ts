import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "../schema/auth.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/user.service";
import { signAccessToken, signRefreshToken } from "../services/auth.service";
import sendEmail from "../utils/mailer";
import {
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import log from "../utils/logger";
import { nanoid } from "nanoid";
export const createSessionHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }

  if (!user.verified) {
    res.status(400).json({ message: "Email not verified" });
    return;
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }

  // sign a access token
  const accessToken = signAccessToken(user);

  // sign refresh token
  const refreshToken = await signRefreshToken({
    userId: String(user._id),
  });

  // send tokens

  res.status(200).json({ message: "Success", accessToken, refreshToken });
  return;
};

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req;

    const user = await createUser(body);
    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your email",
      text: `Please click on the link to verify your email code is :${user.verificationCode} user-Id: ${user._id}`,
    });

    res.status(201).json({ message: "User created successfully" });
    return;
  } catch (e: any) {
    if (e.code === 11000) {
      res.status(400).json({
        message: "Email already exists",
      });
      return;
    }

    res.status(500).json({ message: e });
    next(e);
    return;
  }
};

export const verifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id, verificationCode } = req.params;

  // try {
  // Find the user by id
  const user = await findUserById(id);

  if (!user) {
    res.status(404).json({ message: "Could not verify user" });
    return;
  }

  // Check to see if they are already verified
  if (user.verified) {
    res.status(404).json({ message: "User is already verified" });
    return;
  }

  // Check to see if the verification code matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
    return;
  } else {
    res
      .status(400)
      .json({ message: "Invalid verification code or something went wrong" });
    return;
  }
  // } catch (error: any) {
  //   res.status(400).json({ message: "Invalid verification code or user" });
  // }
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      log.debug(`User with email ${email} does't exist.`);
      res.status(200).json({
        message: "Email has been sent to your email. Please check your inbox.",
      });
      return;
    }

    if (!user.verified) {
      res.status(400).json({
        message: "User is not verified. Please verify your email first.",
      });
      return;
    }

    const passwordResetCode = nanoid();

    user.passwordRestCode = passwordResetCode;
    await user.save();

    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `User id is: ${user._id} ,Password reset code: ${passwordResetCode}`,
    });
    log.debug(`Password reset code sent to ${email}`);
    res.status(200).json({
      message: "Email has been sent to your email. Please check your inbox.",
    });
    return;
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }
};

export const resetPasswordHandler = async (
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) => {
  try {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await findUserById(id);

    if (
      !user ||
      !user.passwordRestCode ||
      user.passwordRestCode !== passwordResetCode
    ) {
      res.status(400).json({ message: "Could not reset user password" });
      return;
    }

    user.passwordRestCode = null;
    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
    return;
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }
};
