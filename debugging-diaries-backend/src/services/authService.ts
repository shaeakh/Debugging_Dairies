import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthRepository from '@repositories/authRepository.js';
import EnvConstant from '@constants/envConstants.js';
import UserService from '@services/userService.js';
import EmailUtils from '@utils/emailUtils.js';
import { userConstants } from '@constants/allConstant.js';
import { AuthenticationError, ConflictError, NotFoundError } from '@errors/concreteErrors.js';
import { MessageConstants } from '@constants/allConstant.js';
import type { ZodType } from 'zod';
import * as AuthDTO from '@dtos/authDTO.js';
import * as UserDTO from '@dtos/userDTO.js';
import * as Error from '@errors/concreteErrors.js';
import type { StringValue } from 'ms';
import { createHash } from 'crypto';
import { sendToQueue } from '@config/rabbitmq.js';

const Message = MessageConstants.errorMessage.authService;

export default class AuthService {
  private authRepository: AuthRepository;

  private userService: UserService;

  private emailUtils: EmailUtils;

  constructor() {
    this.authRepository = new AuthRepository();
    this.userService = new UserService();
    this.emailUtils = new EmailUtils();
  }

  private async CheckUserExists(username: string, email: string) {
    const conflictingUsers = await this.authRepository.CheckUserExists(username, email);

    if (conflictingUsers.length === 0) return;

    let usernameTaken = false;
    let emailTaken = false;

    for (const user of conflictingUsers) {
      if (user.username === username) usernameTaken = true;
      if (user.email === email) emailTaken = true;
    }

    if (usernameTaken && emailTaken) {
      throw new ConflictError(Message.bothUsernameAndEmailTaken);
    } else if (usernameTaken) {
      throw new ConflictError(Message.usernameTaken);
    } else if (emailTaken) {
      throw new ConflictError(Message.emailTaken);
    }
  }

  private async HashPassword(plainPassword: string) {
    const hashedPassword = await bcrypt.hash(plainPassword, userConstants.saltRounds);

    return hashedPassword;
  }

  private GenerateJWT(data: AuthDTO.AuthPayload, expiresIn: StringValue | number = '30d'): string {
    const secretKey = EnvConstant.JWT_SECRET || 'JWT_SECRET';

    return jwt.sign(data, secretKey, { expiresIn });
  }

  private ParseUserData<T>(data: UserDTO.User | UserDTO.Create, schema: ZodType<T>): T {
    const parsedData = schema.safeParse(data);

    if (!parsedData.success) {
      throw new Error.InternalServerError();
    }

    return parsedData.data;
  }

  private async sendEmail(to: string, subject: string, text: string, html: string) {
    try {
      const mailOptions = {
        from: `Debugging-Diaries <${EnvConstant.EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
      };

      // সরাসরি সেন্ড না করে RabbitMQ এর Queue তে পাঠিয়ে দিচ্ছি
      await sendToQueue('email_queue', mailOptions);

      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Email Queue Error:', err);
      throw new Error.InternalServerError('Failed to queue confirmation email');
    }
  }

  private async GenerateOtp(
    user: { id: number; username: string; email: string },
    newPassword: string | null = null,
    type: AuthDTO.Otp_type,
  ) {
    const randomNum = Math.floor(Math.random() * 100000);
    const timeStamp = Date.now();
    const raw = `${user.id}-${user.username}-${user.email}-${timeStamp}-${randomNum}`;
    const hash = createHash('sha256').update(raw).digest('hex');
    const code = (parseInt(hash.slice(0, 8), 16) % 1000000).toString().padStart(6, '0');

    let temporary_password = null;

    if (newPassword) {
      temporary_password = await this.HashPassword(newPassword);
    }

    const newOtp = {
      code,
      temporary_password,
      userId: user.id,
      type,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
    };

    return newOtp;
  }

  async SignUp(signUpData: AuthDTO.SignUp): Promise<string> {
    await this.CheckUserExists(signUpData.username, signUpData.email);

    const { password, ...userData } = signUpData;
    const user = await this.userService.CreateUser(UserDTO.CreateSchema.parse(userData));

    const parsedUser = this.ParseUserData(user, AuthDTO.authPayloadSchema);

    if (!parsedUser) {
      throw new Error.InternalServerError(Message.failedToCreateUser);
    }
    const hashedPassword = await this.HashPassword(password);

    try {
      const auth = await this.authRepository.SignUp(parsedUser.id, hashedPassword);

      if (!auth) {
        throw new Error.InternalServerError(Message.failedToCreateAuthRecord);
      }
      const sessionToken = this.GenerateJWT(parsedUser);
      const confirmToken = this.GenerateJWT(parsedUser, '30m');
      const email = this.emailUtils.signUp(parsedUser, confirmToken);

      await this.sendEmail(
        parsedUser.email,
        'Confirm Your Email - Debugging Diaries',
        email.text,
        email.html,
      );

      return sessionToken;
    } catch (error) {
      await this.userService.DeleteUser(user.id);
      throw error;
    }
  }

  async ConfirmEmail(confirmToken: string) {
    const confirmationPayload = jwt.verify(
      confirmToken,
      EnvConstant.JWT_SECRET,
    ) as AuthDTO.AuthPayload;

    if (!confirmationPayload) {
      throw new Error.AuthenticationError(Message.invalidCredential);
    }
    const data: UserDTO.Update = {
      is_active: true,
    };
    const updatedUser = await this.userService.UpdateUser(confirmationPayload.id, data);

    if (!updatedUser) {
      throw new Error.InternalServerError(Message.failedToConfirmUser);
    }

    const authToken = this.GenerateJWT(AuthDTO.authPayloadSchema.parse(confirmationPayload));

    const email = this.emailUtils.confirmEmail(confirmationPayload);

    await this.sendEmail(
      confirmationPayload.email,
      'Account Confirmed - Debugging Diaries',
      email.text,
      email.html,
    );

    return authToken;
  }

  async SignIn(signInData: AuthDTO.SignIn) {
    const user = await this.authRepository.SignIn(signInData.email);

    if (!user || !user.auth) {
      throw new NotFoundError(Message.userNotFound);
    }
    const { auth, ...userData } = user;
    const parsedUser = this.ParseUserData(userData, AuthDTO.authPayloadSchema);
    const isCorrectPassword = await bcrypt.compare(signInData.password, auth.password);

    if (!isCorrectPassword) {
      throw new AuthenticationError(Message.invalidCredential);
    }
    const token = this.GenerateJWT(parsedUser);

    return { token, user: parsedUser };
  }

  async ChangePassword(user: AuthDTO.AuthPayload, data: AuthDTO.ChangePassword) {
    const auth = await this.authRepository.GetAuthByUser(user.id);

    if (!auth) {
      throw new Error.NotFoundError('Failed to get auth data');
    }
    const isPasswordCurrect = await bcrypt.compare(data.currentPassword, auth.password);

    if (!isPasswordCurrect) {
      throw new Error.AuthenticationError('Invalid Credential');
    }

    const initialOtp = await this.GenerateOtp(user, data.newPassword, 'PASSWORD_RESET');

    const newOtp = await this.authRepository.CreateOtp(initialOtp);

    if (!newOtp) {
      throw new Error.InternalServerError('Failed to create OTP');
    }

    let emailSubject = 'Confirm your identity by OTP';

    switch (newOtp.type) {
      case 'PASSWORD_RESET':
        emailSubject = 'Password Reset Code';
        break;
      case 'EMAIL_VERIFICATION':
        emailSubject = 'Email Verification Code';
        break;
      default:
        break;
    }
    const { text, html } = this.emailUtils.sendOtp(user, newOtp, emailSubject);

    await this.sendEmail(user.email, emailSubject, text, html);
  }

  async VerifyOtp(user: AuthDTO.AuthPayload, data: AuthDTO.VerifyOtp) {
    const otp = await this.authRepository.GetOtp(user.id, data.type, data.code);

    if (!otp) {
      throw new Error.NotFoundError('Failed to verify OTP');
    }

    if (otp.expires_at < new Date()) {
      throw new Error.ExpiredError('OTP');
    }

    switch (otp.type) {
      case 'PASSWORD_RESET': {
        await this.authRepository.UpdatePassword(otp.userId, otp.temporary_password!);
        break;
      }

      default:
        break;
    }

    await this.authRepository.DeleteOtp(otp.id);

    return;
  }
}
