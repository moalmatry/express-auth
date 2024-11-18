import Jwt from 'jsonwebtoken';
import log from './logger';
import argon2 from 'argon2';

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

/** @description sign jwt and return token valid to process.env.JWT_EXPIRES value */
export const signJWT = (id: string, options?: Jwt.SignOptions | undefined) => {
  const token = Jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES!,
    ...(options && options),
  });

  return token;
};

/** @description verify if password is correct using argon2 */
export const correctPassword = async (candidatePassword: string, password: string) => {
  try {
    return await argon2.verify(password, candidatePassword);
  } catch (error) {
    log.error(error, 'Could not validate password');

    return false;
  }
};
