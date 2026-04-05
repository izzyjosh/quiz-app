import { createContext, useEffect, type ReactNode } from "react";
import { socketService } from "@/sockets/services";

type SocketContextValue = {
  socketService: typeof socketService;
};

export const SocketContext = createContext<SocketContextValue | null>(null);

type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketService }}>
      {children}
    </SocketContext.Provider>
  );
};
