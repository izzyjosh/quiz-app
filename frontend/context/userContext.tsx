"use client";

import { getUser } from "@/lib/api/user";
import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";

type User = {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
};

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Fetch user data using the token and set it in context
      getUser(token)
        .then(setUser)
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};
