import AppDataSource from "../datasource/datasource";
const jwt = require("jsonwebtoken");
import { User } from "../entity/User";
import { IUser, IUserResponse } from "../interfaces/user.interface";
import APIError from "../utils/apiErrors";
import "dotenv/config";
const bcrypt = require("bcryptjs");

const secretKey: string = process.env.JWTSECRET || "defaultwebtoken";
const expirationTime = process.env.EXPIRATIONTIME;

class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(email: string, password: string): Promise<IUserResponse> {
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


  async loginUser(email: string, password: string): Promise<IUserResponse> {
    // get the user using email
    const currentUser = await this.userRepository.findOneBy({ email });

    if (!currentUser) {
      throw new APIError("Invalid credentials", 400);
    }

    // compare password
    const isCorrectPassword = bcrypt.compare(password, currentUser.password);

    if (!isCorrectPassword) {
      throw new APIError("Invalid credentials", 400);
    }

    // generate token
    const payload = { email: currentUser.email, id: currentUser.id };

    const token = jwt.sign(payload, secretKey, { expiresIn: expirationTime });

    //response
    const response = {
      accessToken: token,
      email: currentUser.email,
      id: currentUser.id
    };

    return response;
  
  
  async verifyToken(token: string): Promise<
}

const userService = new UserService();

export default userService;
