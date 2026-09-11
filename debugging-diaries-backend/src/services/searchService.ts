import StoryService from '@services/storyService.js';
import { ZodType } from 'zod';
import * as SearchDTO from '@dtos/searchDTO.js';
import * as StoryDTO from '@dtos/storyDTO.js';
import * as UserDTO from '@dtos/userDTO.js';
import * as Error from '@errors/concreteErrors.js';

import UserService from '@services/userService.js';

export default class SearchService {
  private userService: UserService;

  private storyService: StoryService;

  constructor() {
    this.userService = new UserService();
    this.storyService = new StoryService();
  }

  private ParseStoryData<T>(storyData: StoryDTO.Story, schema: ZodType<T>): T {
    const parsedData = schema.safeParse(storyData);

    if (!parsedData.success) {
      throw new Error.InternalServerError();
    }

    return parsedData.data;
  }

  private ParseStoryList<T>(storyList: StoryDTO.Story[], schema: ZodType<T>): T[] {
    return storyList.map((story) => this.ParseStoryData(story, schema));
  }

  private ParseUserData<T>(userData: UserDTO.User, schema: ZodType<T>): T {
    const parsedData = schema.safeParse(userData);

    if (!parsedData.success) {
      throw new Error.InternalServerError();
    }

    return parsedData.data;
  }

  private ParseUserList<T>(userList: UserDTO.User[], schema: ZodType<T>): T[] {
    return userList.map((user) => this.ParseUserData(user, schema));
  }

  async Search(queryData: SearchDTO.Query): Promise<SearchDTO.SearchResponse> {
    const [users, stories] = await Promise.all([
      this.userService.SearchUser(queryData),
      this.storyService.SearchStory(queryData),
    ]);
    const parsedStories = this.ParseStoryList(stories, SearchDTO.StoryResponseSchema);
    const parsedUsers = this.ParseUserList(users, SearchDTO.UserResponseSchema);

    return { users: parsedUsers, stories: parsedStories };
  }
}
