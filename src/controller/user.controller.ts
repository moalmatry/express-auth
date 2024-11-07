import { Request, Response, NextFunction } from "express";
import { CreateUserInput } from "../schema/user.schema"; // Assuming this schema is defined somewhere
import { createUser } from "../services/user.service";
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
    res.status(400).json({ error: error });

    next(error); // Pass the error to the next middleware (error handler)
  }
};
