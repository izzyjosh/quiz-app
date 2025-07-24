import { Repository } from "typeorm";
import { Category } from "../entity/Category";
import APIError from "../utils/apiErrors";
import AppDataSource from "../datasource/datasource";
import { ICategory } from "../interfaces/category.interface";

export class CategoryService {
  constructor(private readonly categoryRepository: Repository<Category>) {}

  async createCategory(data: ICategory) {
    const newCategory = this.categoryRepository.create(data);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async fetchOne(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new APIError("category does not exist", 404);
    }
    return category;
  }

  async fetchAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new APIError("category does not exist", 404);
    }
    await this.categoryRepository.remove(category);
    return { message: "category deleted successfully" };
  }
}

const categoryRepository = new CategoryService(
  AppDataSource.getRepository(Category)
);
export default categoryRepository;
