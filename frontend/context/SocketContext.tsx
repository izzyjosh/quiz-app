import { createContext, useEffect, useState, type ReactNode } from "react";
import { socketService } from "@/sockets/services";

type SocketContextValue = {
  socketService: typeof socketService;
  socketId: string;
};

export const SocketContext = createContext<SocketContextValue | null>(null);

type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socketId, setSocketId] = useState<string>("");
  useEffect(() => {
    const id = socketService.connect() as string;
    setSocketId(id);

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketService, socketId }}>
      {children}
    </SocketContext.Provider>
  );
};
