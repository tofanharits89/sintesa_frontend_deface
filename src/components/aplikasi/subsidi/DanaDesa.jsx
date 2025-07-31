import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../../auth/Context";
import {
  Container,
  Button,
  Modal,
  Spinner,
  Form,
  Alert,
} from "react-bootstrap";
import { io } from "socket.io-client";

import moment from "moment";
import { Pesan } from "../notifikasi/Omspan";
import numeral from "numeral";
import GenerateExcel135 from "../CSV/generateExcell135";

const DanaDesa = ({ update }) => {
  const { axiosJWT, loadingExcell, setloadingExcell } = useContext(MyContext);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [message, setMessage] = useState("");
  const [passkey, setPasskey] = useState("");
  const [passkeyError, setPasskeyError] = useState(false);
  const [jenisData, setJenisData] = useState("");
  const [loadingButtonId, setLoadingButtonId] = useState(null);

  const jenisOptions = [
    { id: "dd_summary", label: "Data WR" },
    { id: "dd_summary_detail", label: "Detail Data WR" },
    { id: "dd_summary_tahap", label: "Data WR per tahap" },
    { id: "dd_header_24", label: "SPM/SP2D" },
    { id: "dd_header_detail_24", label: "Detail Penyaluran" },
    { id: "t_salur_24", label: "Tabel t_salur" },
    { id: "dd_pagu_24", label: "Tabel dd_pagu_24" },
  ];

  const resetState = () => {
    setLoading(false);
    setSyncStatus("");
    setMessage("");
    setResponseMessage("");
    setPasskey("");
    setPasskeyError(false);
    setLoadingButtonId(null);
  };

  const handleModalToggle = () => {
    setShowModal((prev) => !prev);
    if (showModal) resetState();
  };

  // useEffect(() => {
  //   const socket = io(
  //     `${import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_DANADESA}`
  //   );

  //   socket.on("syncStatus", (data) => {
  //     setSyncStatus(data.status);
  //     setMessage(data.message || "");
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (syncStatus === "complete") {
  //     setLoading(false);
  //     setResponseMessage("Sinkronisasi selesai!");
  //     setIsError(false);
  //   }
  //   if (syncStatus === "error") {
  //     setLoading(false);
  //     setResponseMessage("Sinkronisasi Gagal!");
  //     setIsError(true);
  //   }
  // }, [syncStatus]);

  const handleApiCall = async () => {
    if (!passkey.trim()) {
      setPasskeyError(true);
      return;
    }

    setLoading(true);
    setResponseMessage("");
    setIsError(false);

    try {
      const response = await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_DANADESA}/api/tarikTkd`,
        { passkey }
      );
      setResponseMessage(response.data.message || "Berhasil memanggil API!");
      setIsError(false);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Terjadi kesalahan saat memanggil API."
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDataFetchComplete = (total) => {
    Pesan(
      total > 0
        ? `${numeral(total).format("0,0")} data berhasil diexport`
        : "Tidak Ada Data"
    );
    setloadingExcell(false);
    setLoadingButtonId(null);
  };

  const handleDownload = (jenis) => {
    if (loadingButtonId === jenis) {
      setLoadingButtonId(null);
      setloadingExcell(true);
    } else {
      setLoadingButtonId(jenis);
      setJenisData(jenis);
    }
  };
  // console.log(loadingExcell);

  return (
    <>
      <Container fluid>
        <div className="card">
          <div className="card-body ">
            <h5 className="card-title">Dana Desa</h5>
            <ul className="list-group1">
              <li className="list-group-item">
                <i className="bi bi-star me-1 text-success"></i> Sumber Data :
                SITP
              </li>
              <li className="list-group-item">
                <i className="bi bi-collection me-1 text-primary"></i> Periode :
                TA. 2024
              </li>
              <li className="list-group-item">
                <i className="bi bi-check-circle me-1 text-danger"></i> Jenis
                Data : WR - Penyaluran DD - Data SPM/SP2D
              </li>
              <li className="list-group-item">
                <i className="bi bi-exclamation-octagon me-1 text-warning"></i>{" "}
                Update : {update}
              </li>
            </ul>
            <div className="row g-2">
              {jenisOptions.map((jenis) => (
                <div key={jenis.id} className="col-6 col-md-4 col-lg-3">
                  <Button
                    onClick={() => handleDownload(jenis.id)}
                    className="btn btn-sm btn-secondary w-100"
                    disabled={loadingExcell}
                  >
                    {loadingExcell ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {" Loading..."}
                      </>
                    ) : (
                      jenis.label
                    )}
                  </Button>
                </div>
              ))}
              <div className="col-6 col-md-4 col-lg-3">
                <Button
                  onClick={handleModalToggle}
                  className="btn btn-sm btn-danger w-100"
                  disabled={loadingExcell || loadingButtonId}
                >
                  Update Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Modal
        show={showModal}
        onHide={handleModalToggle}
        backdrop="static"
        keyboard={false}
        size="lg"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Data Dana Desa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formPasskey">
            <Form.Label className="fw-bold">Passkey</Form.Label>
            <Form.Control
              type="password"
              placeholder="Masukkan passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              isInvalid={passkeyError}
              required
            />
            <Form.Control.Feedback type="invalid">
              Passkey harus diisi
            </Form.Control.Feedback>
          </Form.Group>

          {syncStatus && (
            <p className="mt-3">
              Status: <strong>{syncStatus}</strong>
            </p>
          )}
          {message && <p>Message: {message}</p>}

          <div className="d-flex align-items-center mt-4">
            <Button
              onClick={handleApiCall}
              disabled={loading || loadingExcell}
              className="btn btn-primary btn-sm"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {" Loading..."}
                </>
              ) : (
                "Update Data"
              )}
            </Button>
            {responseMessage && (
              <p
                className={`ms-3 mb-0 ${
                  isError ? "text-danger" : "text-success"
                }`}
                style={{ fontWeight: "bold" }}
              >
                {responseMessage}
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalToggle}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {loadingExcell && (
        <GenerateExcel135
          query3={`SELECT * FROM repport_tkd.${jenisData} limit 400000`}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`vtdkdd_${jenisData}_${moment().format("DDMMYYYY")}.xlsx`}
        />
      )}
    </>
  );
};

export default DanaDesa;
