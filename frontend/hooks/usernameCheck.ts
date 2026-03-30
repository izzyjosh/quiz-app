import { useEffect, useState } from "react";

export type statusType = "available" | "taken" | "checking" | "error" | "idle";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const useUsernameCheck = (username: string) => {
  const [status, setStatus] = useState<statusType>("idle");

  useEffect(() => {
    if (!username || username.length < 4) {
      setStatus("idle");
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setStatus("checking");

      try {
        const res = await fetch(`${BASE_URL}/users/check-username/${username}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const payload = await res.json();
        const exists = Boolean(payload?.data?.exists);

        setStatus(exists ? "taken" : "available");
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          setStatus("error");
        }
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [username]);

  return status;
};
