const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const apiFetcher = async (endPoint: string, options?: RequestInit) => {
  const res = await fetch(`${BASE_URL}${endPoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return await fetch(`${BASE_URL}${endPoint}`, {
        ...options,
        credentials: "include",
      });
    } else {
      throw new Error("Unauthorized");
    }
  }

  return res;
};

export const refreshToken = async () => {
  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.ok;
};
