import { AppDataSource } from "../config/datasource";
import { User } from "../models/user.model";

class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ username });
    return !!user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
}

export const userService = new UserService();
