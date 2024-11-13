import { Request, Response } from "express";
import { CreateUserInput } from "../schema/auth.schema";
import { findUserByEmail } from "../services/user.service";
import { signAccessToken, signRefreshToken } from "../services/auth.service";
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
