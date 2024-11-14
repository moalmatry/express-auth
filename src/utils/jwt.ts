import Jwt from "jsonwebtoken";
import config from "config";

export const signJwt = (
  object: Object,
  options?: Jwt.SignOptions | undefined
) => {
  return Jwt.sign(object, process.env.JWT_SECRET!, {
    ...(options && options),
  });
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as T;
    return decoded;
  } catch (error) {
    return null;
  }
};
