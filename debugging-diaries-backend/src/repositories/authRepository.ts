import prisma from '@config/db.js';
import * as AuthDTO from '@dtos/authDTO.js';

export default class AuthRepository {
  constructor() {}

  async SignUp(id: number, password: string) {
    return await prisma.auth.create({
      data: {
        userId: id,
        password: password,
      },
    });
  }

  async SignIn(email: string) {
    return await prisma.user.findFirst({
      where: {
        email: email,
        is_deleted: false,
        is_active: true,
      },
      include: {
        auth: true,
      },
    });
  }

  async CheckUserExists(username: string, email: string) {
    return await prisma.user.findMany({
      where: {
        OR: [{ username: username }, { email: email }],
      },
      select: {
        username: true,
        email: true,
      },
    });
  }

  async UpdatePassword(userId: number, newPassword: string) {
    return await prisma.auth.update({
      where: {
        userId,
      },
      data: {
        password: newPassword,
        password_last_modification_time: new Date(),
      },
    });
  }

  async GetAuthByUser(userId: number) {
    return await prisma.auth.findFirst({
      where: { userId },
    });
  }

  async CreateOtp(data: AuthDTO.CreateOtp): Promise<AuthDTO.Otp> {
    return prisma.otp.create({
      data: data,
    });
  }

  async GetOtp(userId: number, type: AuthDTO.Otp_type, code: string) {
    return await prisma.otp.findFirst({
      where: {
        userId: userId,
        type: type,
        code: code,
      },
    });
  }

  async DeleteOtp(id: number) {
    await prisma.otp.delete({
      where: { id },
    });
  }
}
