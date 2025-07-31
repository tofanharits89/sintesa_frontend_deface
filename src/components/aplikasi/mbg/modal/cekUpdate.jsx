import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_MBG);

export const CekUpdate = () => {
  const [logs, setLogs] = useState([]);
  const [hasEmit, setHasEmit] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleEmit = (message) => {
      setLogs((prevLogs) => [...prevLogs, message]);
      setHasEmit(true);

      // Reset timeout setiap ada emit
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Set timeout untuk cek apakah emit berhenti
      timeoutRef.current = setTimeout(() => {
        setHasEmit(false); // Jika 10 detik tidak ada emit
      }, 10000); // 10 detik
    };

    socket.on("bgn", handleEmit);

    return () => {
      socket.off("bgn", handleEmit);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div>
      <h2>Log Emit dari Server</h2>
      {logs.length === 0 && !hasEmit && <p>Tidak ada emit</p>}
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};
