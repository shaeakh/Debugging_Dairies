import prisma from '@config/db.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';
import * as ProfileDTO from '@dtos/profileDTO.js';
import * as SearchDTO from '@dtos/searchDTO.js';
import type * as UserDTO from '@dtos/userDTO.js';

export default class UserRepository {
  constructor() {}

  async FindByUsernameOrEmail(username: string, email: string): Promise<UserDTO.User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      include: {
        auth: false,
      },
    });
  }

  async CreateUser(newUsersData: UserDTO.Create): Promise<UserDTO.User> {
    return await prisma.user.create({
      data: newUsersData,
    });
  }

  async GetAllUsers(queryData: UserDTO.UserQuery): Promise<UserDTO.User[]> {
    const { page, limit, sortBy, sortOrder } = queryData;
    const skip = (page - 1) * limit;

    return await prisma.user.findMany({
      where: {
        is_deleted: false,
      },
      skip: skip,
      take: limit,
      orderBy: {
        [sortBy || 'join_date']: sortOrder || 'desc',
      },
    });
  }

  async GetUserByID(id: CommonItemDTO.Id['id']): Promise<UserDTO.User | null> {
    return await prisma.user.findFirst({
      where: {
        id: id,
        is_deleted: false,
      },
    });
  }

  async UpdateUser(id: CommonItemDTO.Id['id'], data: UserDTO.Update): Promise<UserDTO.User> {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async RemoveUser(id: CommonItemDTO.Id['id']) {
    await prisma.user.update({
      where: { id: id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }

  async DeleteUser(id: CommonItemDTO.Id['id']) {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async SearchUser(queryData: SearchDTO.Query): Promise<UserDTO.User[]> {
    const { page, limit, sortBy, sortOrder, search } = queryData;
    const skip = (page - 1) * limit;

    return await prisma.user.findMany({
      where: {
        is_deleted: false,
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      },
      skip: skip,
      take: limit,
      orderBy: {
        [sortBy || 'join_date']: sortOrder || 'desc',
      },
    });
  }

  async GetProfileByUsername(username: string): Promise<ProfileDTO.Profile | null> {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        auth: false,
        stories: {
          include: {
            user: true,
            categories: true,
            votes: true,
            comments: true,
          },
        },
      },
    });
  }

  async UpdateProfileByUsername(username: string, data: UserDTO.Update): Promise<UserDTO.User> {
    return await prisma.user.update({
      where: { username },
      data: data,
    });
  }
}
