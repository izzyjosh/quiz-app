// lib/api.ts
type ApiUser = {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
};

type GetUserResponse = {
  data?: ApiUser | { user?: ApiUser } | null;
};

const isApiUser = (value: unknown): value is ApiUser => {
  return Boolean(value) && typeof value === "object";
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function getUser(token?: string): Promise<ApiUser | null> {
  if (!token) return null; // not logged in

  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // always fresh user
    });

    if (!res.ok) {
      console.error("Failed to fetch user:", res.statusText);
      return null;
    }

    const response = (await res.json()) as GetUserResponse;
    const userData = response?.data;

    if (!userData) {
      return null;
    }

    if ("user" in userData && isApiUser(userData.user)) {
      return userData.user;
    }

    return isApiUser(userData) ? userData : null;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}
