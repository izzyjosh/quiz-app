export interface IUser {
    email: string;
    password: string;
}

export interface IUserResponse {
 email: string;
 id: number;
 accessToken: string;
}