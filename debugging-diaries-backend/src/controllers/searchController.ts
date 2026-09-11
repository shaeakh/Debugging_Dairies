import SearchService from '@services/searchService.js';
import { HttpConstants } from '@constants/allConstant.js';
import type { Request, Response } from 'express';

const HttpStatus = HttpConstants.statusCode;

export default class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  search = async (req: Request, res: Response) => {
    const searchResult = await this.searchService.Search(req.validatedQuery);

    res.status(HttpStatus.OK.code).json(searchResult);
  };
}
