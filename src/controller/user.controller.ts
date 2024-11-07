import { Request, Response, NextFunction } from "express";
import { CreateUserInput } from "../schema/user.schema"; // Assuming this schema is defined somewhere
import { createUser } from "../services/user.service";
// import sendEmail from "../utils/mailer";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;
    console.log(body);
    const user = await createUser(body);
    // await sendEmail();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handler)
  }
};
