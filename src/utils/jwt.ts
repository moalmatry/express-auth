import Jwt from "jsonwebtoken";
import config from "config";

export const signJwt = (
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: Jwt.SignOptions | undefined
) => {
  const signingKey = Buffer.from(
    process.env[keyName] || config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  return Jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null => {
  const publicKey = Buffer.from(
    process.env[keyName] || config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  try {
    const decoded = Jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
};
