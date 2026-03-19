import { AppDataSource } from "../config/datasource";
import { Option } from "../models/option.model";
import { CreateOptionDTO } from "../schemas/option.schemas";

class OptionService {
  private optionRepository = AppDataSource.getRepository(Option);

  async createOption(
    data: CreateOptionDTO,
    questionId: string,
  ): Promise<Option> {
    const option = this.optionRepository.create({ ...data, questionId });
    return await this.optionRepository.save(option);
  }

  async getOptions(questionId: string): Promise<Option[]> {
    return await this.optionRepository.findBy({ questionId });
  }

  async getOption(optionId: string): Promise<Option> {
    const option = await this.optionRepository.findOneBy({ id: optionId });
    if (!option) {
      throw new Error("Option not found");
    }
    return option;
  }
}

export const optionService = new OptionService();
