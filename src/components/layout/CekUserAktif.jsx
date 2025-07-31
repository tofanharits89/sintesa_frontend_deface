import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Modal } from "react-bootstrap";
import MyContext from "../../auth/Context";
import { handleHttpError } from "../aplikasi/notifikasi/toastError";
import Online from "../aplikasi/notifikasi/Online";
import GetLokasiMap from "../aplikasi/lokasi/getLokasiMap";
import ChatModal from "../aplikasi/ai/ChatModal";

export default function CekUserAktif() {
  const {
    tampilAI,
    namelogin,
    role,
    statusLogin,
    active,
    setRole,
    setKdkanwil,
    setKdkppn,
    setKdlokasi,
    setstatusLogin,
    setDeptlimit,
    setName,
  } = useContext(MyContext);
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(import.meta.env.VITE_REACT_APP_LOCAL_LOGOUT);
      setstatusLogin(false);
      setName("");
      setRole("");
      setKdkanwil("");
      setKdkppn("");
      setKdlokasi("");
      setDeptlimit("");
      navigate("/v3/auth/login");
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };
  // if (
  //   namelogin &&
  //   statusLogin &&
  //   // (role === "1" || role === "0" || role === "X" || role === "2")
  //   role === "X"
  // ) {
  //   Online(namelogin);
  //   setLoggedInUser2(null);
  //   setNamelogin(null);
  // }
  return (
    <div>
      <Modal
        show={active === "0" && statusLogin}
        contentClassName="modal-content-nonaktif"
        backdrop="static"
        keyboard={false}
        animation={false}
        onHide={() => {}}
      >
        <Modal.Header>
          <Modal.Title>Informasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            User anda sudah terdaftar tetapi sedang tidak aktif, hubungi
            Administrator untuk mengaktifkan user. <br />
            <br />
            <pre>
              *) System akan otomatis non aktifkan user <br />
              apabila dalam jangka waktu 3 bulan tidak melakukan login.
            </pre>
            <br />
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center fw-bold text-secondary">
                Restu Alam Siagian{" "}
                <i className="bi bi-whatsapp text-primary"></i> (085230746829)
                <span className="badge bg-primary rounded-pill mx-2">
                  Admin 1
                </span>
              </li>
            </ul>
          </p>
          <div className="d-flex my-4 mb-2 justify-content-center">
            <Button size="sm" variant="danger" onClick={logout}>
              Keluar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* {!tampilAI && <ChatModal />} */}
    </div>
  );
}
