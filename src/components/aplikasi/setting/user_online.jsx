import { Card } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../../auth/Socket";
import MyContext from "../../../auth/Context";
import socket from "../../../auth/SocketKoneksi";

function UserOnline() {
  const { name, statusLogin } = useContext(MyContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Connect socket jika belum terkoneksi
    if (!socket.connected) {
      socket.connect();
    }

    // Emit user-online jika name dan statusLogin ada
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

    socket.on("connect", handleConnect);
    socket.on("update-user-list", handleUpdateUsers);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("update-user-list", handleUpdateUsers);
    };
  }, [name, statusLogin]);

  return (
    <Card>
      <Card.Body
        style={{ overflow: "auto", height: "650px" }}
        className="m-3 p-3"
      >
        <h6>🟢 User Online ({onlineUsers?.length || 0})</h6>
        {onlineUsers && onlineUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>IP Address</th>
                  <th>Waktu Login</th>
                </tr>
              </thead>
              <tbody>
                {onlineUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{typeof user === "string" ? user : user.name}</td>
                    <td>{typeof user === "object" ? user.ip : "-"}</td>
                    <td>
                      {typeof user === "object" && user.connectedAt
                        ? new Date(user.connectedAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Tidak ada user online.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default UserOnline;
