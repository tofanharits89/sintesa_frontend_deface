import { createContext, useEffect, useState, useContext } from "react";
import socket from "./SocketKoneksi";
import MyContext from "./Context";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { name, statusLogin } = useContext(MyContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (name && statusLogin) {
      socket.emit("user-online", name);
    }

    const handleUpdateUsers = (users) => {
      setOnlineUsers(users);
    };

    const handleConnect = () => {
      if (name && statusLogin) {
        socket.emit("user-online", name);
      }
    };

    const handleDisconnect = () => {
      // Handle disconnect if needed
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("update-user-list", handleUpdateUsers);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("update-user-list", handleUpdateUsers);
    };
  }, [name, statusLogin]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
