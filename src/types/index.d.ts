/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import { updatePasswordInput } from '../schema/user.schema';

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
