import { DocumentType } from "@typegoose/typegoose";
import { User } from "../model/user.model";
import { signJwt } from "../utils/jwt";
import { createSessionHandler } from "../controller/auth.controller";
import SessionModel from "../model/session.model";

export const createSession = async ({ userId }: { userId: string }) => {
  return SessionModel.create({ user: userId });
};

export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const session = await createSession({
    userId,
  });

  const refreshToken = signJwt(
    {
      session: session._id,
    },
    "refreshTokenPrivateKey"
  );

  return refreshToken;
};

export const signAccessToken = (user: DocumentType<User>) => {
  const payload = user.toJSON();

  const accessToken = signJwt(payload, "accessTokenPrivateKey");

  return accessToken;
};
