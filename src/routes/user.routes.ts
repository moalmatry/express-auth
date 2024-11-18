import express from 'express';
import validateResource from '../middleware/validateResource';
import { createUserSchema, verifyUserSchema } from '../schema/user.schema';

import { forgotPasswordSchema, resetPasswordSchema } from './../schema/user.schema';
import { createSessionSchema } from '../schema/auth.schema';
import {
  login,
  signup,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from '../controller/auth.controller';
import { getAllUsers } from '../controller/user.controller';

const router = express.Router();

// NOTE: Authentication Routes
router.post('/signup', validateResource(createUserSchema), signup);

router.post('/login', validateResource(createSessionSchema), login);

// NOTE: Verification & Reset Password Routes
router.post('/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler);

router.post('/forgot-password', validateResource(forgotPasswordSchema), forgotPasswordHandler);

router.post('/reset-password/:id/:passwordResetCode', validateResource(resetPasswordSchema), resetPasswordHandler);

// NOTE: Start admin routes
router.get('/', getAllUsers);

export default router;
