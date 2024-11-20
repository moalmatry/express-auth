import express from 'express';
import validateResource from '../middleware/validateResource';
import { createUserSchema, updateMeSchema, updatePasswordSchema, verifyUserSchema } from '../schema/user.schema';

import { forgotPasswordSchema, resetPasswordSchema } from './../schema/user.schema';
import { createSessionSchema } from '../schema/auth.schema';
import {
  loginHandler,
  signupHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyUserHandler,
  updatePasswordHandler,
} from '../controller/auth.controller';
import { getAllUsersHandler, updateMeHandler } from '../controller/user.controller';
import { protect } from '../middleware/protectResource';
import { restrictTo } from '../middleware/restrictTo';

const router = express.Router();

// NOTE: Authentication Routes
router.post('/signup', validateResource(createUserSchema), signupHandler);

router.post('/login', validateResource(createSessionSchema), loginHandler);

// NOTE: Verification & Reset Password Routes & Update password & user info
router.post('/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler);

router.post('/forgot-password', validateResource(forgotPasswordSchema), forgotPasswordHandler);

router.post('/reset-password/:id/:passwordResetCode', validateResource(resetPasswordSchema), resetPasswordHandler);

router.patch('/update-password', validateResource(updatePasswordSchema), protect, updatePasswordHandler);

router.patch('/update-me', validateResource(updateMeSchema), protect, updateMeHandler);

// NOTE: Start admin routes
router.get('/', protect, restrictTo('ADMIN', 'EMPLOYEE'), getAllUsersHandler);

export default router;
