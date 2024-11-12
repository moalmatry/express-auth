import { Request, Response } from "express";
import { CreateUserInput } from "../schema/auth.schema";
import { findByEmail } from "../services/user.service";
export const createSessionHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await findByEmail(email);

  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  if (!user.verified)
    return res.status(400).json({ message: "Email not verified" });

  const isValid = await user.validatePassword(password);
};
