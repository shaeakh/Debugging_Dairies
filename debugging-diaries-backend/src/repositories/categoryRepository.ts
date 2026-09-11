import prisma from '@config/db.js';
import * as CategoryDTO from '@dtos/categoryDTO.js';

export default class CategoryRepository {
  constructor() {}

  async CreateCategory(data: CategoryDTO.Create): Promise<CategoryDTO.Category> {
    return await prisma.category.create({
      data: data,
    });
  }

  async GetAllCategories(): Promise<CategoryDTO.Category[]> {
    return await prisma.category.findMany();
  }

  async GetTopTrendingCategories(): Promise<CategoryDTO.Category[]> {
    return await prisma.category.findMany({
      take: 20,

      include: {
        _count: {
          select: { stories: true },
        },
      },

      orderBy: {
        stories: {
          _count: 'desc',
        },
      },
    });
  }
}
