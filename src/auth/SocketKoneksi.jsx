// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_REACT_APP_LOCAL_SOCKET, {
  withCredentials: true,
  autoConnect: false, // optional, kita bisa connect manual
});

export default socket;
