import React, { useEffect, useContext, useState } from "react";
import MyContext from "../../auth/Context";
import Encrypt from "../../auth/Random";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { handleHttpError } from "../aplikasi/notifikasi/toastError";

const ListNotifikasi = ({ onNotificationCountChange }) => {
  const {
    axiosJWT,
    token,
    username,
    listNotif,
    setlistNotif,
    totNotif,
    settotNotif,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [socket, setSocket] = useState(null);

  // Fungsi untuk play suara notifikasi
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3;
      audio.play().catch((e) => {
        // Fallback dengan Web Audio API
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      });
    } catch (error) {
      // Audio not supported
    }
  };

  // Socket connection setup
  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_REACT_APP_LOCAL_SOCKET;

    if (socketUrl && username) {
      const newSocket = io(socketUrl, {
        auth: {
          token: token,
          username: username,
        },
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        // Join user-specific room untuk notifikasi personal
        newSocket.emit("join-user-room", username);
      });

      newSocket.on("disconnect", () => {
        // Socket disconnected
      });

      // Listen untuk notifikasi baru
      newSocket.on("new-notification", (data) => {
        // Cek apakah notifikasi untuk user ini
        if (data.tujuan === username) {
          // Play sound notification
          playNotificationSound();

          // Update count menggunakan context
          settotNotif((prev) => {
            const newCount = prev + 1;
            // Kirim count ke parent component
            if (onNotificationCountChange) {
              onNotificationCountChange(newCount);
            }
            return newCount;
          });

          // Trigger reload data
          setUpdate(true);

          // Optional: Show toast notification
          if (window.showToast) {
            window.showToast(
              "success",
              "Notifikasi Baru",
              `${data.judul} dari ${data.dari}`
            );
          }
        }
      });

      // Listen untuk reply notifikasi
      newSocket.on("new-reply", (data) => {
        // Jika reply untuk notifikasi yang dikirim user ini
        if (data.original_sender === username || data.tujuan === username) {
          playNotificationSound();
          settotNotif((prev) => {
            const newCount = prev + 1;
            // Kirim count ke parent component
            if (onNotificationCountChange) {
              onNotificationCountChange(newCount);
            }
            return newCount;
          });
          setUpdate(true);
        }
      });

      // Listen untuk update status notifikasi
      newSocket.on("notification-status-update", (data) => {
        if (data.username === username) {
          setUpdate(true);
        }
      });

      newSocket.on("connect_error", (error) => {
        // Socket connection error
      });

      setSocket(newSocket);

      return () => {
        newSocket.emit("leave-user-room", username);
        newSocket.disconnect();
      };
    }
  }, [username, token]);

  // Initial data load dan refresh saat update
  useEffect(() => {
    if (update) {
      getData().then(() => {
        setLoading(false);
        setUpdate(false);
      });
    }
  }, [update]);

  // Initial load
  useEffect(() => {
    getData().then(() => {
      setLoading(false);
    });
  }, []);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.judul,a.dari,a.tujuan,a.isi,a.pinned,a.tipe,a.tipe_notif,a.status,createdAt FROM v3.notifikasi a WHERE tujuan='${username}' order by pinned DESC, createdAt DESC limit 5; 
      `
    );
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.result.length > 0) {
        setlistNotif(response.data.result);

        // Update notification count (unread notifications) menggunakan context
        const unreadCount = response.data.result.filter(
          (notif) => notif.status === "false"
        ).length;
        settotNotif(unreadCount);

        // Kirim count ke parent component
        if (onNotificationCountChange) {
          onNotificationCountChange(unreadCount);
        }
      }

      setUpdate(false);
    } catch (error) {
      setLoading(false);
      setUpdate(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  // Function to get total unread notifications count
  const getTotalUnreadCount = async () => {
    const encodedQuery = encodeURIComponent(
      `SELECT COUNT(*) as total FROM v3.notifikasi WHERE tujuan='${username}' AND status='false';`
    );
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.result.length > 0) {
        const totalUnread = response.data.result[0].total;
        settotNotif(totalUnread);

        // Kirim count ke parent component
        if (onNotificationCountChange) {
          onNotificationCountChange(totalUnread);
        }

        return totalUnread;
      }

      return 0;
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      return 0;
    }
  };

  const formatTimeDisplay = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else if (diffInMinutes < 10080) {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    } else {
      return messageTime.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-dropdown-content">
      <div className="notification-header">
        <h6 className="mb-0">
          <i className="bi bi-bell me-2"></i>
          Notifikasi
        </h6>
        <Link
          to="/notifikasi"
          className="btn btn-sm btn-outline-primary rounded-pill"
          style={{ fontSize: "11px", padding: "2px 8px" }}
        >
          Lihat Semua
        </Link>
      </div>

      <div className="notification-list">
        {listNotif && listNotif.length > 0 ? (
          listNotif.map((notif, index) => (
            <div
              key={notif.id || index}
              className={`notification-item ${
                notif.status === "false" ? "unread" : ""
              }`}
            >
              <div className="notification-content">
                <div className="notification-avatar">
                  {notif.tipe_notif === "pesan" ? (
                    <i className="bi bi-envelope-fill text-success"></i>
                  ) : notif.tipe === "penting" ? (
                    <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                  ) : notif.tipe === "sangat_penting" ? (
                    <i className="bi bi-exclamation-diamond-fill text-danger"></i>
                  ) : (
                    <i className="bi bi-info-circle-fill text-info"></i>
                  )}
                </div>
                <div className="notification-text">
                  <div className="notification-title">
                    {truncateText(notif.judul, 30)}
                    {notif.pinned === "true" && (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Pesan dipinned</Tooltip>}
                      >
                        <i
                          className="bi bi-pin-fill text-muted ms-1"
                          style={{ fontSize: "10px" }}
                        ></i>
                      </OverlayTrigger>
                    )}
                  </div>
                  <div className="notification-subtitle">
                    <span className="text-muted">
                      {notif.dari} • {formatTimeDisplay(notif.createdAt)}
                    </span>
                  </div>
                </div>
                {notif.status === "false" && (
                  <div className="notification-indicator"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="notification-empty">
            <i className="bi bi-bell-slash text-muted"></i>
            <small className="text-muted">Tidak ada notifikasi</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListNotifikasi;
