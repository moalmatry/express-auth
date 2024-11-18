import { User } from '@prisma/client';
import { db } from '../db';
import argon2 from 'argon2';

export const createUser = async (input: Partial<User>) => {
  const hashedPassword = await argon2.hash(input.password!);

  const dbUser = await db.user.findFirst({
    where: {
      id: input.email,
    },
  });

  if (!dbUser) {
    const user = await db.user.create({
      data: {
        id: input.id,
        email: input.email!,
        firstName: input.firstName!,
        lastName: input.lastName!,
        password: hashedPassword,
        verified: false,
        passwordRestCode: null,
      },
    });

    return user;
  }
};

export const findUserById = async (id: string) => {
  const user = await db.user.findFirst({
    where: {
      id,
    },
  });

  return user;
};

export const verifyEmail = async (id: string) => {
  await db.user.update({
    where: {
      id,
    },
    data: {
      verified: true,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  // return UserModal.findOne({ email });

  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  return user;
};

export const updatePasswordResetCode = async (id: string, passwordRestCode: string | null) => {
  await db.user.update({
    where: {
      id,
    },
    data: {
      passwordRestCode,
    },
  });
};

export const updatePassword = async (id: string, password: string) => {
  const hashedPassword = await argon2.hash(password!);

  await db.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const getUsers = async () => {
  const allUsers = await db.user.findMany({
    select: {
      firstName: true,
      lastName: true,
      email: true,
      verified: true,
      createdAt: true,
      password: false,
      verificationCode: false,
    },
  });

  return allUsers;
};
