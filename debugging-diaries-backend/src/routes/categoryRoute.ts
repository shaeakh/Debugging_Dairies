import express from 'express';
import CategoryController from '@controllers/categoryController.js';
import * as Validator from '@middlewares/requestValidator.js';
import * as CategoryDTO from '@dtos/categoryDTO.js';
import { cacheMiddleware } from '@middlewares/redisCache.js';

const router = express.Router();
const categoryController = new CategoryController();

router.get('/', cacheMiddleware('categories'), categoryController.GetAllCategories);
router.get('/trending', cacheMiddleware('categories'), categoryController.GetTopTrendingCategories);
router.post('/', Validator.body(CategoryDTO.CreateSchema), categoryController.CreateCategory);
export default router;
