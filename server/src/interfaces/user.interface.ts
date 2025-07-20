export interface IUser {
  email: string;
  password: string;
}

export interface IUserResponse {
  email: string;
  id: string;
  accessToken: string;
  role?: "user" | "admin";
}
