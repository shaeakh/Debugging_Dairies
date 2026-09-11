import SearchController from '@controllers/searchController.js';
import express from 'express';
import authenticateToken from '@middlewares/authenticateToken.js';
import * as SearchDTO from '@dtos/searchDTO.js';
import * as Validator from '@middlewares/requestValidator.js';
import { cacheMiddleware } from '@middlewares/redisCache.js';

const router = express.Router();

const searchController = new SearchController();

router.get(
  '/',
  authenticateToken,
  Validator.query(SearchDTO.QuerySchema),
  cacheMiddleware('search'),
  searchController.search,
);

export default router;
