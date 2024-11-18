import Jwt from 'jsonwebtoken';
import log from './logger';

// export const signJwt = (object: object, options?: Jwt.SignOptions | undefined) => {
//   return Jwt.sign(object, process.env.JWT_SECRET!, {
//     ...(options && options),
//   });
// };

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as T;
    return decoded;
  } catch (error) {
    log.error(error);
    return null;
  }
};

/** @description sign jwt and return token valid to 90d process.env.JWT_EXPIRES */
export const signJWT = (id: string, options?: Jwt.SignOptions | undefined) => {
  const token = Jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES!,
    ...(options && options),
  });

  return token;
};
