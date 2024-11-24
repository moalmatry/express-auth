/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import { updatePasswordInput } from '../schema/user.schema';
import { Gender, Role } from '@prisma/client';

export interface CustomRequest extends Request {
  requestTime?: string;
  user?: User;
}

export interface CustomRequestUpdatePassword extends Request<object, object, updatePasswordInput> {
  requestTime?: string;
  user?: User;
}

export interface CustomRequests<B = any, C = any, D = any> extends Request<object, B, C, D> {
  requestTime?: string;
  user?: User;
}

// updateMe
export interface UpdateMeDataProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: Gender;
  phoneNumber?: string;
  fullAddress?: string;
}

export interface UpdateUserProps extends UpdateMeDataProps {
  verified?: boolean;
  role?: Role;
  active?: boolean;
}

export interface ProductDataProps {
  categoryName: string;
  description?: string;
  name: string;
  price: number;
  images?: string[];
  tags?: string[];
}
export interface UpdateDataProps {
  id: string;
  categoryName?: string;
  description?: string;
  name?: string;
  price: number;
  images?: string[];
  tags?: string[];
}
