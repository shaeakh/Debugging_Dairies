import AuthController from '@controllers/authController.js';
import express from 'express';
import * as AuthDTO from '@dtos/authDTO.js';
import * as Validator from '@middlewares/requestValidator.js';
import authenticateToken from '@middlewares/authenticateToken.js';

const router = express.Router();
const authController = new AuthController();

router.get('/confirm-email/:token', authController.ConfirmEmail);
router.post('/signup', Validator.body(AuthDTO.signUpSchema), authController.SignUp);
router.post('/signin', Validator.body(AuthDTO.signInSchema), authController.SignIn);
router.post(
  '/change-password',
  Validator.body(AuthDTO.changePasswordSchma),
  authenticateToken,
  authController.ChangePassword,
);
router.post(
  '/verify-Otp',
  Validator.body(AuthDTO.verifyOtpSchema),
  authenticateToken,
  authController.VerifyOtp,
);
router.post('/signout', authenticateToken, authController.SignOut);
export default router;
