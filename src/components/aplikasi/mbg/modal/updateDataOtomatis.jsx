import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
  FloatingLabel,
  Container,
  Badge,
} from "react-bootstrap";
import { io } from "socket.io-client";
import MyContext from "../../../../auth/Context";
import { UpdateMbg } from "../overview/tgUpdate";
import { motion, AnimatePresence } from "framer-motion";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
import LogStatus from "./LogStatus";

const socket = io(import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_MBG);

const UpdateOtomatis = ({ show, onClose, onSuccess }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [logs, setLogs] = useState([]);

  const [endTime, setEndTime] = useState(null);

  const logEndRef = useRef(null);

  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false); // baru
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleUpdate = (data) => {
      const timeInWIB = new Date(data.timestamp).toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
      });
      setStatus(`${data.message} (${timeInWIB} WIB)`);

      setIsUpdating(data.isUpdating);
    };

    const handleLog = (msg) => {
      setLogs((prevLogs) => [...prevLogs, msg]);
    };

    socket.on("ONUPDATE", handleUpdate);
    socket.on("bgn", handleLog);
    socket.on("disconnect", () => {
      setIsDisconnected(true);
      setIsUpdating(false);
      setLogs([]);
    });
    socket.on("connect", () => setIsDisconnected(false));
    socket.on("connect_error", () => {
      setIsDisconnected(true);
      setIsUpdating(false);
      setLogs([]);
    });

    return () => {
      socket.off("ONUPDATE", handleUpdate);
      socket.off("bgn", handleLog);
      socket.off("disconnect");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  const handleUpdate = async () => {
    if (!passkey.trim()) {
      setError("Passkey tidak boleh kosong.");
      return;
    }

    try {
      const response = await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_MBG}`,
        { passkey, username },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.message) {
        setSuccessMsg(response.data.message);
        onSuccess?.(); // optional callback jika diberikan
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengupdate data.");
    } finally {
      setEndTime(Date.now());
      setLoading(false);
    }
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);
  const handleCopy = () => {
    setIsCopied(true);
  };
  return (
    <Container>
      {" "}
      <LogStatus
        status={status}
        logs={logs}
        isCopied={isCopied}
        onCopy={handleCopy}
      />
      {/* ALERT KONEKSI */}
      <AnimatePresence>
        {isDisconnected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="danger">
              Koneksi ke server MBG Port 86 terputus. <br />
              Hubungi Seksi PDPSIPA cq. Restu Alam Siagian.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      {/* INPUT PASSKEY */}
      <AnimatePresence>
        {status === "" && !isDisconnected && (
          <motion.div
            key="form-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Form.Group controlId="passkeyInput">
              <div className="d-flex align-items-stretch gap-2 my-4 ">
                <Form.Control
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Masukkan passkey ..."
                  isInvalid={!!error}
                  className="flex-grow-1"
                  style={{ height: "40px" }}
                />
                <Button
                  variant="danger"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="px-4"
                  style={{ height: "40px", whiteSpace: "nowrap" }}
                >
                  {loading ? "Sedang Update..." : "Update"}
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </Form.Group>
          </motion.div>
        )}
      </AnimatePresence>
      {/* LOG PROSES */}
      <AnimatePresence>
        {logs.length > 0 && (
          <motion.div
            key="log-update"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <code>
              <div
                className="bg-light border rounded p-3 mt-4 mb-3 "
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                <strong className="d-block mb-2 text-muted">
                  Log Proses Update:
                </strong>
                <ul className="mb-0 ps-3 ">
                  {logs.map((msg, index) => (
                    <li
                      key={index}
                      className={index === logs.length - 1 ? "blink" : ""}
                    >
                      {msg}
                    </li>
                  ))}
                </ul>
                <div ref={logEndRef}></div>
              </div>
            </code>
          </motion.div>
        )}
      </AnimatePresence>
      {/* SPINNER LOADING */}
      {loading && (
        <div className="d-flex align-items-center gap-2 text-muted ps-1">
          <Spinner animation="border" size="sm" />
          <span>Memproses data ...</span>
        </div>
      )}
      {/* TOMBOL UPDATE */}
      {/* STATUS */}
      {/* {status} */}
      {status !== "" ||
        (isDisconnected && (
          <div className="my-4 text-center ">
            <span>{status}</span>
          </div>
        ))}
    </Container>
  );
};

export default UpdateOtomatis;
