import { User } from '@prisma/client';
import { db } from '../db';
import argon2 from 'argon2';
import { UpdateMeDataProps, UpdateUserProps } from '../types';

/** @description create user in database & hash password */
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
        id: input.id!,
        email: input.email!,
        firstName: input.firstName!,
        lastName: input.lastName!,
        password: hashedPassword!,
        verified: false,
      },
    });

    return user;
  }
};
/** @description find user by id */
export const findUserById = async (id: string) => {
  const user = await db.user.findFirst({
    where: {
      id,
    },
  });

  return user;
};
/** @description find user by id and set verified:true  */
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
/** @description find user by email and return user data  */
export const findUserByEmail = async (email: string) => {
  // return UserModal.findOne({ email });

  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  return user;
};

/** @description find user by id and update password rest code valid for only 10 minutes  */
export const updatePasswordResetCode = async (id: string, passwordRestCode: string | null) => {
  await db.user.update({
    where: {
      id,
    },
    data: {
      passwordRestCode,
      passwordRestExpires: String(Date.now() + 10 * 60 * 1000),
    },
  });
};
/** @description find user by id and update password and update updatedAt */
export const updatePassword = async (id: string, password: string) => {
  const hashedPassword = await argon2.hash(password!);

  await db.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
      updatedAt: new Date(),
    },
  });
};
/** @description return all users  */
export const getUsers = async () => {
  const allUsers = await db.user.findMany({
    where: {
      active: true,
    },
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

/** @description find user by id and update its data does not update password*/
export const updateMe = async (id: string, updatedData: UpdateMeDataProps) => {
  const user = await db.user.update({
    where: {
      id,
    },
    data: {
      ...updatedData,
    },
  });

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender,
    phoneNumber: user.phoneNumber,
    fullAddress: user.fullAddress,
  };
};

/** @description disable user in database */
export const deleteMe = async (id: string) => {
  const deletedUser = await db.user.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });

  return !deletedUser.active;
};
/** @description restore deleted user */
export const restoreUser = async (email: string) => {
  const user = await db.user.update({
    where: {
      email,
    },
    data: {
      active: true,
    },
  });

  return user.active;
};

/** @description update user data but this one has more rules (does not update password) */
export const updateUser = async (email: string, updatedData: UpdateUserProps) => {
  const updatedUser = await db.user.update({
    where: {
      email,
    },
    data: {
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      gender: updatedData.gender,
      role: updatedData.role,
      verified: updatedData.verified,
      phoneNumber: updatedData.phoneNumber,
      fullAddress: updatedData.fullAddress,
      active: updatedData.active,
    },
  });

  return {
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    gender: updatedUser.gender,
    role: updatedUser.role,
    verified: updatedUser.verified,
    phoneNumber: updatedUser.phoneNumber,
    fullAddress: updatedUser.fullAddress,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
    active: updatedUser.active,
  };
};
