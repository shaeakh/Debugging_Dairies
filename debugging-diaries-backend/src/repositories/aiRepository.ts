import { GoogleGenAI } from '@google/genai';
import EnvConstant from '../constants/envConstants.js';
import Prompt from '@constants/aiPrompts.js';
import * as StoryDTO from '@dtos/storyDTO.js';

export default class AiRepository {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: EnvConstant.GEMINI_API_KEY });
  }

  async generateStorySummary(story: StoryDTO.Create): Promise<string | null> {
    try {
      const response = await this.client.models.generateContent({
        model: EnvConstant.AI_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Title: ${story.title}
                    Body: ${story.body}
                    Categories: ${story.categories.map((c) => c.name).join(', ')}`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: Prompt.StorySummary,
        },
      });

      return response.text?.trim() || 'could not generate response';
    } catch (error) {
      console.error('AI summarization failed:', error);

      return null;
    }
  }
}
