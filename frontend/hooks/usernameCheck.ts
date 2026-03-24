import { useEffect, useState } from "react";

export type statusType = "available" | "taken" | "checking" | "error" | "idle";

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
        const res = await fetch(
          `http://localhost:8000/api/users/check-username/${username}`,
          {
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();

        setStatus(data.available ? "available" : "taken");
      } catch (error: any) {
        if (error?.name === "AbortError") setStatus("error");
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [username]);

  return status;
};
