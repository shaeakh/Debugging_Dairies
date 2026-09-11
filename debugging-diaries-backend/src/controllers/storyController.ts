import { HttpConstants, MessageConstants } from '@constants/allConstant.js';
import StoryService from '@services/storyService.js';
import type { Request, Response } from 'express';
import { clearCachePattern } from '@utils/redisUtils.js';
import ResponseHandler from '@utils/responseHandler.js';

const HttpStatus = HttpConstants.statusCode;
const Message = MessageConstants.responseMessage.storyController;

export default class StoryController {
  private storyService: StoryService;

  constructor() {
    this.storyService = new StoryService();
  }

  CreateStory = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const newStory = await this.storyService.CreateStory({ userId, ...req.validatedBody });

    await clearCachePattern('stories:*');
    ResponseHandler.send(res, HttpStatus.CREATED.code, { data: newStory });
  };

  GetAllStories = async (req: Request, res: Response) => {
    const queryData = req.validatedQuery;
    const allStories = await this.storyService.GetAllStories(queryData);

    ResponseHandler.send(res, HttpStatus.OK.code, { data: allStories });
  };

  GetStoryByID = async (req: Request, res: Response) => {
    const id = req.validatedParams.id;
    const story = await this.storyService.GetStoryByID(id);

    ResponseHandler.send(res, HttpStatus.OK.code, { data: story });
  };

  UpdateStory = async (req: Request, res: Response) => {
    const id = req.validatedParams.id;
    const storyData = req.validatedBody;
    const updatedStory = await this.storyService.UpdateStory(id, storyData);

    await clearCachePattern('stories:*');
    await clearCachePattern(`story:*/${id}*`);
    ResponseHandler.send(res, HttpStatus.OK.code, { data: updatedStory });
  };

  RemoveStory = async (req: Request, res: Response) => {
    const id = req.validatedParams.id;

    await this.storyService.RemoveStory(id);
    await clearCachePattern('stories:*');
    await clearCachePattern(`story:*/${id}*`);
    ResponseHandler.send(res, HttpStatus.OK.code, { message: Message.storyRemoved });
  };
}
