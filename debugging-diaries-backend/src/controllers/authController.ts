import { HttpConstants, MessageConstants, EnvConstant } from '@constants/allConstant.js';
import AuthService from '@services/authService.js';
import ResponseHandler from '@utils/responseHandler.js';
import type { Request, Response, NextFunction, CookieOptions } from 'express';

const HttpStatus = HttpConstants.statusCode;
const Message = MessageConstants.responseMessage.authController;

const isProduction = EnvConstant.NODE_ENV === 'production';
const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  SignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = await this.authService.SignUp(req.validatedBody);

      res.cookie('authToken', authToken, getCookieOptions());

      ResponseHandler.send(res, HttpStatus.CREATED.code, {
        message: Message.userCreationSuccessfull,
      });
    } catch (error) {
      next(error);
    }
  };

  ConfirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const confirmToken = String(req.params.token);
      const authToken = await this.authService.ConfirmEmail(confirmToken);

      res.cookie('authToken', authToken, getCookieOptions());

      const frontendUrl = (EnvConstant.FRONTEND_URL1 || 'https://debugging-diaries.vercel.app').replace(/\/$/, '');
      if (req.accepts('html')) {
        return res.redirect(`${frontendUrl}/auth?verified=true`);
      }

      ResponseHandler.send(res, HttpStatus.OK.code, {
        message: Message.emailConfirmationSuccessfull,
      });
    } catch (error) {
      const frontendUrl = (EnvConstant.FRONTEND_URL1 || 'https://debugging-diaries.vercel.app').replace(/\/$/, '');
      if (req.accepts('html')) {
        return res.redirect(`${frontendUrl}/auth?error=confirmation_failed`);
      }
      next(error);
    }
  };

  SignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, user } = await this.authService.SignIn(req.validatedBody);

      res.cookie('authToken', token, getCookieOptions());
      ResponseHandler.send(res, HttpStatus.OK.code, {
        message: Message.signInSuccessful,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  ChangePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.ChangePassword(req.user!, req.validatedBody);
      ResponseHandler.send(res, HttpStatus.OK.code, { message: Message.ChangePassword });
    } catch (error) {
      next(error);
    }
  };

  VerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.VerifyOtp(req.user!, req.validatedBody);
      ResponseHandler.send(res, HttpStatus.OK.code, { message: Message.VerifyOtp });
    } catch (error) {
      next(error);
    }
  };

  SignOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
      });
      ResponseHandler.send(res, HttpStatus.OK.code, { message: Message.Logout });
    } catch (error) {
      next(error);
    }
  };
}
