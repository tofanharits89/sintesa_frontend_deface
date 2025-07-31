import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import moment from "moment";
import MyContext from "../../../auth/Context";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ReplyModal = ({ show, onHide, notification }) => {
  const { role, axiosJWT, logout, token, username } = useContext(MyContext);
  const navigate = useNavigate();
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const notifikasiId = notification?.id || notification?.ID;
  const numericNotifikasiId = notifikasiId ? parseInt(notifikasiId, 10) : null;

  // Fungsi untuk play suara notifikasi
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3"); // atau buat dengan Web Audio API
      audio.volume = 0.3;
      audio.play().catch((e) => {
        // Fallback dengan Web Audio API jika file tidak ada
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

  useEffect(() => {
    if (replies.length > 0) {
      playNotificationSound();
    }
  }, [replies.length]);

  // Socket connection setup
  useEffect(() => {
    if (show && numericNotifikasiId) {
      // Ambil URL socket dari environment variable
      const socketUrl =
        import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

      const newSocket = io(socketUrl, {
        auth: {
          token: token,
          username: username,
        },
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        setIsConnected(true);

        // Join room untuk notifikasi ini
        newSocket.emit("join-notification-room", numericNotifikasiId);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      // Listen untuk pesan balasan baru
      newSocket.on("new-reply", (data) => {
        // Cek apakah reply untuk notifikasi ini (gunakan parent_id dari backend)
        if (
          data.parent_id === numericNotifikasiId ||
          data.notification_id === numericNotifikasiId
        ) {
          setReplies((prevReplies) => {
            const exists = prevReplies.some((reply) => reply.id === data.id);
            if (!exists) {
              // Play sound hanya jika bukan pesan dari user sendiri
              if (data.dari !== username) {
                playNotificationSound();
              }
              return [...prevReplies, data];
            }
            return prevReplies;
          });
        }
      });

      // Listen untuk update status pesan
      newSocket.on("reply-status", (data) => {
        if (
          data.notification_id === numericNotifikasiId ||
          data.parent_id === numericNotifikasiId
        ) {
          setReplies((prevReplies) =>
            prevReplies.map((reply) =>
              reply.id === data.reply_id
                ? { ...reply, status: data.status }
                : reply
            )
          );
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setError(
          "Koneksi real-time bermasalah. Pesan mungkin tidak ter-update otomatis."
        );
      });

      setSocket(newSocket);

      // Cleanup saat komponen di-unmount atau modal ditutup
      return () => {
        newSocket.emit("leave-notification-room", numericNotifikasiId);
        newSocket.disconnect();
      };
    }
  }, [show, numericNotifikasiId, token, username]);

  // Load existing replies saat modal dibuka
  useEffect(() => {
    if (show && numericNotifikasiId) {
      loadReplies();
    }
  }, [show, numericNotifikasiId]);

  const loadReplies = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_LOCAL_REPLY_PESAN;
      const response = await axiosJWT.get(`${apiUrl}/${numericNotifikasiId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setReplies(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading replies:", error);
    }
  };

  const handleSend = async () => {
    if (!replyText.trim()) {
      setError("Please enter a reply message");
      return;
    }

    if (role !== "X") {
      setError("Access denied: Only SuperAdmin can send reply messages.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_LOCAL_REPLY_PESAN;

      const response = await axiosJWT.post(
        `${apiUrl}/${numericNotifikasiId}`,
        {
          text: replyText.trim(),
          tujuan: notification?.dari || "",
          parent_id: notification?.parent_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setReplyText("");
        const newReply = response.data.data;
        if (newReply) {
          // Emit ke socket untuk real-time update
          if (socket && isConnected) {
            socket.emit("send-reply", {
              notification_id: numericNotifikasiId,
              reply_data: newReply,
              room: `notification-${numericNotifikasiId}`,
            });
          }

          setReplies((prevReplies) => {
            const exists = prevReplies.some(
              (reply) => reply.id === newReply.id
            );
            if (!exists) {
              return [...prevReplies, newReply];
            }
            return prevReplies;
          });
        }
      } else {
        setError(response.data.error || "Failed to send reply");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setError("Access denied: Only SuperAdmin can send reply messages");
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        logout();
        navigate("/v3/auth/login");
      } else {
        setError("Network error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="chat-modal">
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#075e54", color: "white" }}
        className="text-light"
      >
        <Modal.Title
          style={{ fontSize: "16px", fontWeight: "500" }}
          className="text-light"
        >
          💬 {notification?.dari || "Chat"}
          <small style={{ opacity: 0.8, marginLeft: "8px" }}>
            {notification?.tujuan ? `→ ${notification.tujuan}` : ""}
          </small>
          {/* Socket connection indicator */}
          <span
            style={{
              marginLeft: "10px",
              fontSize: "12px",
              color: isConnected ? "#4CAF50" : "#f44336",
            }}
          >
            {isConnected ? "🟢 Online" : "🔴 Offline"}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          backgroundColor: "#e5ddd5",
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" opacity="0.05"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20v20h20z"/%3E%3C/g%3E%3C/svg%3E")',
          minHeight: "400px",
          maxHeight: "500px",
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {error && (
          <Alert
            variant="danger"
            style={{ borderRadius: "8px", border: "none", fontSize: "14px" }}
          >
            {error}
          </Alert>
        )}

        {role !== "X" ? (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#fff3cd",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #ffeaa7",
            }}
          >
            🔒 Hanya SuperAdmin yang dapat membalas pesan
          </div>
        ) : (
          <>
            {/* Pesan Asli - Seperti WhatsApp */}
            <div
              style={{
                backgroundColor: "#dcf8c6",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
                maxWidth: "85%",
                marginLeft: "auto",
                position: "relative",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#25d366",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                {notification?.dari || "Pengirim"}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "1.4",
                  color: "#303030",
                }}
                dangerouslySetInnerHTML={{ __html: notification?.isi || "" }}
              />
              <div
                style={{
                  fontSize: "11px",
                  color: "#667781",
                  textAlign: "right",
                  marginTop: "6px",
                }}
              >
                {moment(notification?.createdAt).format("HH:mm")} ✓✓
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ marginBottom: "20px" }}>
              {replies.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#667781",
                    fontSize: "14px",
                    fontStyle: "italic",
                    padding: "20px",
                  }}
                >
                  💬 Mulai percakapan...
                </div>
              ) : (
                replies.map((balas, idx) => {
                  const isMyMessage = balas.dari === username;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: isMyMessage ? "flex-end" : "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: isMyMessage ? "#dcf8c6" : "#ffffff",
                          padding: "8px 12px",
                          borderRadius: "12px",
                          maxWidth: "75%",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          position: "relative",
                        }}
                      >
                        {!isMyMessage && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#25d366",
                              fontWeight: "500",
                              marginBottom: "2px",
                            }}
                          >
                            {balas.dari}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.4",
                            color: "#303030",
                            marginBottom: "4px",
                          }}
                        >
                          {balas.isi}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#667781",
                            textAlign: "right",
                          }}
                        >
                          {balas.createdAt
                            ? moment(balas.createdAt).format("HH:mm")
                            : moment().format("HH:mm")}
                          {isMyMessage && " ✓✓"}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </Modal.Body>

      {/* Input Chat - WhatsApp Style */}
      {role === "X" && (
        <Modal.Footer
          style={{
            backgroundColor: "#f0f0f0",
            borderTop: "1px solid #e0e0e0",
            padding: "12px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "10px",
            }}
          >
            <Form.Control
              as="textarea"
              rows={1}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ketik pesan..."
              disabled={loading}
              style={{
                borderRadius: "20px",
                border: "1px solid #ddd",
                padding: "8px 16px",
                fontSize: "14px",
                resize: "none",
                minHeight: "36px",
                maxHeight: "80px",
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (replyText.trim() && !loading) {
                    handleSend();
                  }
                }
              }}
            />
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!replyText.trim() || loading}
              style={{
                backgroundColor: "#25d366",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0",
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #fff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                <span style={{ fontSize: "16px" }}>➤</span>
              )}
            </Button>
          </div>
        </Modal.Footer>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .chat-modal .modal-content {
          border-radius: 12px;
          border: none;
          overflow: hidden;
        }
      `}</style>
    </Modal>
  );
};

export default ReplyModal;
