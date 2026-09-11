import AiRepository from '@repositories/aiRepository.js';
import * as StoryDTO from '@dtos/storyDTO.js';

export default class AiService {
  private aiRepository: AiRepository;

  constructor() {
    this.aiRepository = new AiRepository();
  }

  async getStorySummary(story: StoryDTO.Create) {
    return await this.aiRepository.generateStorySummary(story);
  }
}
