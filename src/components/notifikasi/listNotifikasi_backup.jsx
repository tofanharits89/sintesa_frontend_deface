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
      console.log("Audio not supported");
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
        console.log("Notification socket connected:", newSocket.id);

        // Join user-specific room untuk notifikasi personal
        newSocket.emit("join-user-room", username);
      });

      newSocket.on("disconnect", () => {
        console.log("Notification socket disconnected");
      });

      // Listen untuk notifikasi baru
      newSocket.on("new-notification", (data) => {
        console.log("New notification received:", data);

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
        console.log("New reply notification received:", data);
        console.log("Current username:", username);
        console.log("Reply original_sender:", data.original_sender);
        console.log("Reply tujuan:", data.tujuan);

        // Jika reply untuk notifikasi yang dikirim user ini
        // Check both original_sender and tujuan to ensure we catch the reply
        if (data.original_sender === username || data.tujuan === username) {
          console.log("✅ Reply notification is for this user");
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
        } else {
          console.log("❌ Reply notification is NOT for this user");
        }
      });

      // Listen untuk update status notifikasi
      newSocket.on("notification-status-update", (data) => {
        console.log("Notification status update:", data);

        if (data.username === username) {
          setUpdate(true);
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
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
      console.log("Refreshing listNotifikasi data due to update flag");
      getData().then(() => {
        setLoading(false);
        setUpdate(false);
      });
    }
  }, [update]);

  // Initial load
  useEffect(() => {
    console.log("Initial load for listNotifikasi");
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

        // Update context or global state for notification badge
        if (typeof window !== "undefined" && window.updateNotificationCount) {
          window.updateNotificationCount(totalUnread);
        }
      }
    } catch (error) {
      console.error("Error getting total unread count:", error);
    }
  };

  // Load total unread count on component mount
  useEffect(() => {
    if (username) {
      getTotalUnreadCount();
    }
  }, [username]);
  return (
    <>
      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary me-2"></div>
          <small className="text-muted">Loading...</small>
        </div>
      ) : listNotif.length > 0 ? (
        <div className="notification-list">
          {listNotif.map((notification, index) => (
            <div
              key={index}
              className={`notification-card ${
                notification.status === "false" ? "unread" : "read"
              }`}
              style={{
                backgroundColor:
                  notification.status === "false" ? "#f8f9ff" : "#fff",
                border:
                  notification.status === "false"
                    ? "1px solid #007bff"
                    : "1px solid #e9ecef",
                borderRadius: "6px",
                padding: "10px 14px",
                marginBottom: "6px",
                boxShadow:
                  notification.status === "false"
                    ? "0 2px 4px rgba(0,123,255,0.1)"
                    : "0 1px 2px rgba(0,0,0,0.04)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  notification.status === "false"
                    ? "0 2px 4px rgba(0,123,255,0.1)"
                    : "0 1px 2px rgba(0,0,0,0.04)";
              }}
            >
              <Link
                to="/v3/notifikasi"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Status indicator */}
                  {notification.status === "false" && (
                    <div
                      className="rounded-circle me-2"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#007bff",
                        flexShrink: 0,
                        animation: "pulse 2s infinite",
                      }}
                    ></div>
                  )}
                  {/* Notification type icon */}
                  <div className="me-2">
                    {notification.tipe_notif === "pesan" ? (
                      <i
                        className="bi bi-envelope-fill text-primary"
                        style={{ fontSize: "12px" }}
                      ></i>
                    ) : notification.tipe === "biasa" ? (
                      <i
                        className="bi bi-info-circle-fill text-success"
                        style={{ fontSize: "12px" }}
                      ></i>
                    ) : notification.tipe === "penting" ? (
                      <i
                        className="bi bi-exclamation-triangle-fill text-warning"
                        style={{ fontSize: "12px" }}
                      ></i>
                    ) : (
                      <i
                        className="bi bi-exclamation-diamond-fill text-danger"
                        style={{ fontSize: "12px" }}
                      ></i>
                    )}
                  </div>
                  {/* Title */}
                  <span
                    className={`${
                      notification.status === "false" ? "fw-bold" : "fw-normal"
                    } text-dark`}
                    style={{
                      fontSize: "13px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {notification.judul.length > 40
                      ? `${notification.judul.slice(0, 40)}...`
                      : notification.judul}
                  </span>
                  {/* New badge for unread */}
                  {notification.status === "false" && (
                    <span
                      className="badge bg-primary"
                      style={{
                        fontSize: "9px",
                        padding: "2px 6px",
                        borderRadius: "10px",
                      }}
                    >
                      NEW
                    </span>
                  )}
                  {/* Pin indicator */}
                  {notification.pinned === "true" && (
                    <OverlayTrigger
                      placement="left"
                      overlay={
                        <Tooltip id="tooltip-pin" style={{ fontSize: 11 }}>
                          Pesan dipinned
                        </Tooltip>
                      }
                    >
                      <i
                        className="bi bi-pin-fill text-secondary ms-1"
                        style={{ fontSize: "10px" }}
                      ></i>
                    </OverlayTrigger>
                  )}
                  {/* Sender info */}
                  {notification.dari && (
                    <small
                      className="text-muted"
                      style={{ fontSize: "11px", marginLeft: 8 }}
                    >
                      <i
                        className="bi bi-person me-1"
                        style={{ fontSize: "10px" }}
                      ></i>
                      {notification.dari.length > 12
                        ? `${notification.dari.slice(0, 12)}...`
                        : notification.dari}
                    </small>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3">
          <div className="mb-1">
            <i
              className="bi bi-bell-slash text-muted"
              style={{ fontSize: "20px" }}
            ></i>
          </div>
          <small className="text-muted" style={{ fontSize: "11px" }}>
            Tidak ada notifikasi
          </small>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .notification-card:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
};

export default ListNotifikasi;
