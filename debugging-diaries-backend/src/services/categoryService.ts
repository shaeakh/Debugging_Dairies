import CategoryRepository from '@repositories/categoryRepository.js';
import * as CategoryDTO from '@dtos/categoryDTO.js';

export default class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async CreateCategory(data: CategoryDTO.Create): Promise<CategoryDTO.Category> {
    return await this.categoryRepository.CreateCategory(data);
  }

  async GetAllCategories(): Promise<CategoryDTO.Category[]> {
    return await this.categoryRepository.GetAllCategories();
  }

  async GetTopTrendingCategories(): Promise<CategoryDTO.Category[]> {
    return await this.categoryRepository.GetTopTrendingCategories();
  }
}
