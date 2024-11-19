import { Request } from 'express';

export interface CustomRequest extends Request {
  requestTime?: string;
  user?: User;
}
