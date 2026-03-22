export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  avatar: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupResponse {
  status: string;
  message: string;
  data: any;
  httpStatus: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: any;
  httpStatus: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const signUp = async (data: SignupPayload): Promise<SignupResponse> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message || "Failed to create account");
  }

  return res.json();
};

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message || "Invalid credentials");
  }

  return res.json();
};
