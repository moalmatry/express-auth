import { Request, Response, NextFunction } from "express";
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema"; // Assuming this schema is defined somewhere
import { createUser, findUserById } from "../services/user.service";
import sendEmail from "../utils/mailer";

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
  } catch (error) {
    res.status(400).json({ message: error });

    // next(error); // Pass the error to the next middleware (error handler)
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
