import { io } from "socket.io-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const socket = io(SOCKET_BASE_URL, {
  autoConnect: false, // Disable auto-connection
});
