import { apiFetcher } from "./api";

interface RegisterData {
  email: string;
  username: string;
  avatar: string;
  password: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  avatar: string;
}

interface CurrentUserResponse {
  data?: CurrentUser;
}

export const register = async (registerData: RegisterData) => {
  const res = await apiFetcher("/auth/register", {
    method: "POST",
    body: JSON.stringify(registerData),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }
  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await apiFetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};

export const logout = async () => {
  const res = await apiFetcher("/auth/logout", {
    method: "POST",
  });
};

export const getCurrentUser = async () => {
  const res = await apiFetcher("/users/me");
  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  const payload = (await res.json()) as CurrentUserResponse;
  return payload.data ?? null;
};
