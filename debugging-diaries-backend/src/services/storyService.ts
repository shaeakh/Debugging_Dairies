import { MessageConstants } from '@constants/allConstant.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';
import * as SearchDTO from '@dtos/searchDTO.js';
import * as StoryDTO from '@dtos/storyDTO.js';
import * as Error from '@errors/concreteErrors.js';
import StoryRepository from '@repositories/storyRepository.js';
import AiService from '@services/aiService.js';

const Message = MessageConstants.errorMessage.storyService;

export default class StoryService {
  private storyRepository: StoryRepository;

  private aiService: AiService;

  constructor() {
    this.storyRepository = new StoryRepository();
    this.aiService = new AiService();
  }

  async CreateStory(story: StoryDTO.Create): Promise<StoryDTO.Story> {
    story.summary = await this.aiService.getStorySummary(story);

    return await this.storyRepository.CreateStory(story);
  }

  async GetAllStories(queryData: StoryDTO.Query) {
    const { stories, total } = await this.storyRepository.GetAllStories(queryData);

    return {
      stories,
      metaData: {
        total,
      },
    };
  }

  async GetStoryByID(id: CommonItemDTO.Id['id']): Promise<StoryDTO.Story | null> {
    const story = await this.storyRepository.GetStoryByID(id);

    if (!story) {
      throw new Error.NotFoundError(Message.storyNotFound);
    }

    return story;
  }

  async UpdateStory(
    id: CommonItemDTO.Id['id'],
    storyData: StoryDTO.Update,
  ): Promise<StoryDTO.Story> {
    const story = await this.GetStoryByID(id);
    const mergedStory: StoryDTO.Create = { ...story, ...storyData } as StoryDTO.Create;
    const summary = await this.aiService.getStorySummary(mergedStory);
    const updatedStory = await this.storyRepository.UpdateStory(id, {
      ...storyData,
      summary,
    });

    return updatedStory;
  }

  async RemoveStory(id: CommonItemDTO.Id['id']) {
    await this.GetStoryByID(id);

    return await this.storyRepository.RemoveStory(id);
  }

  async SearchStory(queryData: SearchDTO.Query): Promise<StoryDTO.Story[]> {
    return await this.storyRepository.SearchStory(queryData);
  }
}
