import React, { useEffect, useContext, useState } from "react";
import MyContext from "../../auth/Context";
import Encrypt from "../../auth/Random";
import {
  Card,
  Container,
  ListGroup,
  Modal,
  OverlayTrigger,
  Tooltip,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import "../notifikasi/notifikasi.css";
import { LoadingChart } from "../layout/LoadingTable";
import moment from "moment";
import { handleHttpError } from "../aplikasi/notifikasi/toastError";
import ReplyModal from "../aplikasi/notifikasi/replymodel";
import { io } from "socket.io-client";

const NotifikasiPage = () => {
  const { axiosJWT, token, username, role, totNotif, settotNotif } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [socket, setSocket] = useState(null);
  const [toastList, setToastList] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fungsi untuk menampilkan toast
  const showToast = (variant, title, message) => {
    const id = Date.now();
    const newToast = {
      id,
      variant,
      title,
      message,
      show: true,
    };
    setToastList((prev) => [...prev, newToast]);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setToastList((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

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
      newSocket.on("new-notification", (notificationData) => {
        // Cek apakah notifikasi untuk user ini
        if (notificationData.tujuan === username) {
          // Play sound notification
          playNotificationSound();

          // Show toast notification
          showToast(
            "success",
            "Notifikasi Baru",
            `${notificationData.judul} dari ${notificationData.dari}`
          );

          // Refresh data dengan reset - penting untuk re-render
          setData([]);
          setPage(1);
          setHasMoreData(true);
          getData(1, true);
        }
      });

      // Listen untuk reply notifikasi
      newSocket.on("new-reply", (replyData) => {
        // Jika reply untuk notifikasi yang dikirim user ini
        // Check both original_sender and tujuan to ensure we catch the reply
        if (
          replyData.original_sender === username ||
          replyData.tujuan === username
        ) {
          playNotificationSound();
          showToast(
            "info",
            "Balasan Baru",
            `Ada balasan untuk pesan Anda dari ${replyData.dari}`
          );

          // Refresh data dengan reset
          setData([]);
          setPage(1);
          setHasMoreData(true);
          getData(1, true);
        } else {
          // Reply not for this user
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error in landing:", error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.emit("leave-user-room", username);
        newSocket.disconnect();
      };
    }
  }, [username, token]);

  useEffect(() => {
    getData();
  }, [totNotif]);

  // useEffect untuk merender ulang total notifikasi setelah selesai membuka pesan
  useEffect(() => {
    if (!showReplyModal && selectedNotification) {
      // Trigger untuk refresh total notifikasi setelah modal reply ditutup
      settotNotif(0);
    }
  }, [showReplyModal, selectedNotification, settotNotif]);

  const getData = async (pageParam = page, reset = false) => {
    try {
      if (loading) return;
      setLoading(true);
      const encryptedQuery = Encrypt(
        `SELECT a.id,a.judul,a.parent_id,a.dari,a.tujuan,a.status,a.pinned,a.tipe_notif,a.tipe,a.createdAt,a.isi FROM v3.notifikasi a WHERE tujuan='${username}' order by pinned DESC, createdAt DESC LIMIT 30 OFFSET ${
          (pageParam - 1) * 30
        }`
      );
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
            }${encryptedQuery}`
          : "",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (reset) {
        setData(response.data.result);
      } else {
        setData((prevData) => [...prevData, ...response.data.result]);
      }
      setPage(pageParam + 1);
      if (response.data.result.length === 0) setHasMoreData(false);
    } catch (error) {
      handleHttpError(
        error?.response?.status,
        (error?.response?.data && error.response.data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  // Untuk modal NOTIFIKASI saja (bukan pesan)
  const handleNotifClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (notification.status === "false") {
      updateStatus(notification.id);
    }
  };
  const handleCloseModal = () => setShowModal(false);

  const handleBalasPesan = (parent_id) => {
    setShowReplyModal(true);
  };

  const updateStatus = async (id) => {
    try {
      await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_UBAHSTATUS
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_UBAHSTATUS}/${id}`
          : "",
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      settotNotif(0);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };
  return (
    <main id="main" className="main">
      <section className="profile">
        <Container fluid className="px-0">
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ maxWidth: 1300, margin: "0 auto" }}
          >
            <h1
              className="mb-0"
              style={{ fontSize: "20px", fontWeight: "500" }}
            >
              Notifikasi
            </h1>
            <small className="text-muted">{data.length} item</small>
          </div>
          <Card
            className="border-0"
            style={{ maxWidth: 1300, margin: "0 auto" }}
          >
            <Card.Body className="p-0">
              {data.length > 0 ? (
                <InfiniteScroll
                  dataLength={data.length}
                  next={() => getData(page)}
                  hasMore={hasMoreData}
                  loader={loading && <LoadingChart />}
                  style={{ padding: "0" }}
                >
                  <div className="notification-container">
                    {data.map((notification, index) => (
                      <div
                        key={index}
                        className={`notification-item-modern ${
                          notification.status === "false" ? "unread" : ""
                        }`}
                        onClick={
                          notification.tipe_notif !== "pesan"
                            ? () => handleNotifClick(notification)
                            : undefined
                        }
                        style={{
                          padding: "16px 24px",
                          borderBottom:
                            index === data.length - 1
                              ? "none"
                              : "1px solid #f1f3f4",
                          backgroundColor:
                            notification.status === "false"
                              ? "#f8f9ff"
                              : "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            notification.status === "false"
                              ? "#f0f4ff"
                              : "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            notification.status === "false"
                              ? "#f8f9ff"
                              : "#ffffff";
                        }}
                      >
                        {/* Status Indicator */}
                        {notification.status === "false" && (
                          <div
                            className="position-absolute"
                            style={{
                              left: "6px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "3px",
                              height: "32px",
                              backgroundColor: "#007bff",
                              borderRadius: "2px",
                            }}
                          ></div>
                        )}
                        <div className="d-flex align-items-start justify-content-between">
                          <div
                            className="flex-grow-1"
                            style={{
                              paddingLeft:
                                notification.status === "false" ? "8px" : "0",
                            }}
                          >
                            <div className="d-flex align-items-center mb-1">
                              {/* Type Icon */}
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  backgroundColor:
                                    notification.tipe_notif === "pesan"
                                      ? "#28a745"
                                      : notification.tipe === "penting"
                                      ? "#ffc107"
                                      : notification.tipe === "sangat_penting"
                                      ? "#dc3545"
                                      : "#17a2b8",
                                  flexShrink: 0,
                                }}
                              >
                                {notification.tipe_notif === "pesan" ? (
                                  <i
                                    className="bi bi-envelope-fill text-white"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                ) : notification.tipe === "penting" ? (
                                  <i
                                    className="bi bi-exclamation-triangle-fill text-white"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                ) : notification.tipe === "sangat_penting" ? (
                                  <i
                                    className="bi bi-exclamation-diamond-fill text-white"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                ) : (
                                  <i
                                    className="bi bi-info-circle-fill text-white"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                )}
                              </div>
                              {/* Title */}
                              <h6
                                className={`mb-0 ${
                                  notification.status === "false"
                                    ? "fw-bold"
                                    : "fw-normal"
                                }`}
                                style={{
                                  fontSize: "18px",
                                  lineHeight: "1.2",
                                  color: "#2c3e50",
                                  marginRight: 16,
                                }}
                              >
                                {notification.judul}
                              </h6>
                            </div>
                            {/* Pesan isi - Disembunyikan untuk tampil header saja */}
                            {/* 
                            <div style={{ fontSize: 15, color: '#334155', marginTop: 6, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                              <span dangerouslySetInnerHTML={{ __html: notification.isi }} />
                            </div>
                            */}
                            <div
                              className="d-flex align-items-center"
                              style={{ marginTop: "6px" }}
                            >
                              <small
                                className="text-muted me-2"
                                style={{ fontSize: "11px" }}
                              >
                                <i
                                  className="bi bi-clock me-1"
                                  style={{ fontSize: "9px" }}
                                ></i>
                                {moment(notification.createdAt).format(
                                  "DD MMM, HH:mm"
                                )}
                              </small>
                              {notification.dari && (
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "11px" }}
                                >
                                  <i
                                    className="bi bi-person me-1"
                                    style={{ fontSize: "9px" }}
                                  ></i>
                                  {notification.dari}
                                </small>
                              )}
                            </div>
                          </div>
                          <div className="d-flex align-items-center ms-2">
                            {/* Pin Indicator */}
                            {notification.pinned === "true" && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="tooltip-pin">
                                    Pesan dipinned
                                  </Tooltip>
                                }
                              >
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: "#6c757d20",
                                  }}
                                >
                                  <i
                                    className="bi bi-pin-fill text-secondary"
                                    style={{ fontSize: "9px" }}
                                  ></i>
                                </div>
                              </OverlayTrigger>
                            )}
                            {/* Message Reply Button */}
                            {notification.tipe_notif === "pesan" &&
                            role === "X" ? (
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="rounded-circle p-0"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  border: "1px solid #007bff30",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowModal(false);
                                  handleBalasPesan(notification.parent_id);
                                  setSelectedNotification(notification);
                                  if (notification.status === "false") {
                                    updateStatus(notification.id);
                                  }
                                }}
                                title="Buka & Balas Pesan"
                              >
                                <i
                                  className="bi bi-reply-fill"
                                  style={{ fontSize: "12px" }}
                                ></i>
                              </Button>
                            ) : notification.tipe_notif === "pesan" &&
                              role !== "X" ? (
                              <Button
                                size="sm"
                                variant="outline-success"
                                className="rounded-circle p-0"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  border: "1px solid #28a74530",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNotification(notification);
                                  setShowModal(true);
                                  if (notification.status === "false") {
                                    updateStatus(notification.id);
                                  }
                                }}
                                title="Buka Pesan"
                              >
                                <i
                                  className="bi bi-envelope-open"
                                  style={{ fontSize: "12px" }}
                                ></i>
                              </Button>
                            ) : (
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  backgroundColor: "#28a74520",
                                }}
                              >
                                <i
                                  className="bi bi-chevron-right text-success"
                                  style={{ fontSize: "10px" }}
                                ></i>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i
                      className="bi bi-bell-slash text-muted"
                      style={{ fontSize: "48px" }}
                    ></i>
                  </div>
                  <h5 className="text-muted mb-2">Tidak Ada Notifikasi</h5>
                  <p className="text-muted small">
                    Anda akan menerima notifikasi di sini
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* ...existing code... */}

      {/* Modal untuk NOTIFIKASI */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        animation={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "17px" }}>
            <i
              className="bi bi-envelope text-success text-small mx-4"
              style={{ fontSize: "20px" }}
            ></i>{" "}
            {selectedNotification && selectedNotification.judul?.slice(0, 50)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "300px" }}>
          {selectedNotification && (
            <div className="container-notif">
              <div className="icon-background">
                <i className="bi bi-exclude icon-notif"></i>
              </div>
              <div className="content-notif">
                <p
                  dangerouslySetInnerHTML={{ __html: selectedNotification.isi }}
                />
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal untuk balasan PESAN */}
      <ReplyModal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        notification={selectedNotification}
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        {toastList.map((toast) => (
          <Toast
            key={toast.id}
            show={toast.show}
            onClose={() =>
              setToastList((prev) => prev.filter((t) => t.id !== toast.id))
            }
            bg={toast.variant}
            autohide
            delay={5000}
          >
            <Toast.Header>
              <strong className="me-auto">{toast.title}</strong>
              <small>baru saja</small>
            </Toast.Header>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </main>
  );
};

export default NotifikasiPage;
