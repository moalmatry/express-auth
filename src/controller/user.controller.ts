import { Request, Response, NextFunction } from "express";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema"; // Assuming this schema is defined somewhere
import {
  createUser,
  findByEmail,
  findUserById,
} from "../services/user.service";
import sendEmail from "../utils/mailer";
import log from "../utils/logger";
import { nanoid } from "nanoid";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;

    const user = await createUser(body);
    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your email",
      text: `Please click on the link to verify your email: ${user.verificationCode} Id: ${user._id}`,
    });

    res.status(201).json({ message: "User created successfully" });
    return;
  } catch (error) {
    res.status(400).json({ message: error });
    // next(error); // Pass the error to the next middleware (error handler)
    return;
  }
};

export const verifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id, verificationCode } = req.params;

  try {
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
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }
  } catch (error: any) {
    res.status(400).json({ message: "Invalid verification code or user" });
  }
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  try {
    const { email } = req.body;
    const user = await findByEmail(email);
    if (!user) {
      log.debug(`User with email ${email} does't exist.`);
      res.status(200).json({
        message: "Email has been sent to your email. Please check your inbox.",
      });
      return;
    }

    if (!user.verified) {
      res
        .status(400)
        .json("User is not verified. Please verify your email first.");
      return;
    }

    const passwordResetCode = nanoid();

    user.passwordRestCode = passwordResetCode;
    await user.save();
    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `Please click on the link to reset your password: http://localhost:3000/reset-password/${user._id}/${passwordResetCode}`,
    });
    log.debug(`Password reset code sent to ${email}`);
    res
      .status(200)
      .json("Email has been sent to your email. Please check your inbox");
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

    res.status(200).json({ message: "Password reset successfully" });
    return;
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }
};
