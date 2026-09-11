import { MessageConstants } from '@constants/allConstant.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';
import * as ProfileDTO from '@dtos/profileDTO.js';
import * as SearchDTO from '@dtos/searchDTO.js';
import * as UserDTO from '@dtos/userDTO.js';
import * as Error from '@errors/concreteErrors.js';
import UserRepository from '@repositories/userRepository.js';

const Message = MessageConstants.errorMessage.userService;

export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private async CheckExistingUser(username: string, email: string) {
    if (username == '' && email == '') return;
    const existingUser = await this.userRepository.FindByUsernameOrEmail(username, email);

    if (!existingUser) return;
    if (existingUser.username === username || existingUser.email === email) {
      throw new Error.ConflictError(Message.userAlreadyExists);
    }
  }

  async CreateUser(user: UserDTO.Create): Promise<UserDTO.User> {
    return await this.userRepository.CreateUser(user);
  }

  async GetAllUsers(queryData: UserDTO.UserQuery): Promise<UserDTO.User[]> {
    return await this.userRepository.GetAllUsers(queryData);
  }

  async GetUserByID(id: CommonItemDTO.Id['id']): Promise<UserDTO.User | null> {
    const user = await this.userRepository.GetUserByID(id);

    if (!user) {
      throw new Error.NotFoundError(Message.userNotfound);
    }

    return user;
  }

  async UpdateUser(id: CommonItemDTO.Id['id'], user: UserDTO.Update): Promise<UserDTO.User> {
    if (user.email || user.username)
      await this.CheckExistingUser(user.username || '', user.email || '');

    return await this.userRepository.UpdateUser(id, user);
  }

  async RemoveUser(id: CommonItemDTO.Id['id']) {
    await this.GetUserByID(id);

    return await this.userRepository.RemoveUser(id);
  }

  async DeleteUser(id: CommonItemDTO.Id['id']) {
    await this.GetUserByID(id);

    return await this.userRepository.DeleteUser(id);
  }

  // used in search service
  async SearchUser(queryData: SearchDTO.Query): Promise<UserDTO.User[]> {
    return await this.userRepository.SearchUser(queryData);
  }

  async GetProfileByUsername(username: string): Promise<ProfileDTO.Profile> {
    const userProfile = await this.userRepository.GetProfileByUsername(username);

    if (!userProfile) {
      throw new Error.NotFoundError('User profile not found');
    }

    return userProfile;
  }

  async UpdateProfileByUsername(username: string, data: UserDTO.Update): Promise<UserDTO.User> {
    const userProfile = await this.GetProfileByUsername(username);

    if (!userProfile) {
      throw new Error.NotFoundError('User profile not found');
    }

    return await this.userRepository.UpdateProfileByUsername(username, data);
  }
}
