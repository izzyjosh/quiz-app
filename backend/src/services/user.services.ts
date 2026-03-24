import { AppDataSource } from "../config/datasource";
import { User } from "../models/user.model";

class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ username });
    return !!user;
  }
}

export const userService = new UserService();
