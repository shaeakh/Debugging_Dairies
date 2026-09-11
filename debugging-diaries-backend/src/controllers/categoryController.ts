import CategoryService from '@services/categoryService.js';
import { HttpConstants } from '@constants/allConstant.js';
import type { Request, Response } from 'express';
import { clearCachePattern } from '@utils/redisUtils.js';

const HttpStatus = HttpConstants.statusCode;

export default class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  CreateCategory = async (req: Request, res: Response) => {
    const newCategory = await this.categoryService.CreateCategory(req.validatedBody);

    await clearCachePattern('categories:*');

    res.status(HttpStatus.CREATED.code).json(newCategory);
  };

  GetAllCategories = async (req: Request, res: Response) => {
    const allCategories = await this.categoryService.GetAllCategories();

    res.status(HttpStatus.OK.code).json(allCategories);
  };

  GetTopTrendingCategories = async (req: Request, res: Response) => {
    const trendingCategories = await this.categoryService.GetTopTrendingCategories();

    res.status(HttpStatus.OK.code).json(trendingCategories);
  };
}
