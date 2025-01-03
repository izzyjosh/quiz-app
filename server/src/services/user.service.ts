import AppDataSource from "../datasource/datasource";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { IUser } from "../interfaces/user.interface";
import APIError from "../utils/apiErrors";
import "dotenv/config";

const secretKey: string = process.env.JWTSECRET || "defaultwebtoken";
const expirationTime = process.env.EXPIRATIONTIME;

class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(
    email: string,
    password: string
  ): Promise<Omit<IUser, "password">> {
    // check if user already exist
    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new APIError("User with this email  already exist", 404);
    }
    // create user
    const user = new User();
    user.email = email;
    user.password = password;

    const savedUser = await this.userRepository.save(user);

    const payload = { email: savedUser.email, id: savedUser.id };

    const token = jwt.sign(payload, secretKey, { expiresIn: expirationTime });

    const response = {
      accessToken: token,
      email: savedUser.email,
      id: savedUser.id
    };

    return response;
  }
}

const userService = new UserService();

export default userService;
