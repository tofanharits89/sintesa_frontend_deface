import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Card } from "react-bootstrap";
import { io } from "socket.io-client";

const Detail = ({
  showModal,
  handleCloseModal,
  selectedDetail,
  token,
  id,
  bgcolor,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (showModal && selectedDetail) {
      getData();
    }
  }, [showModal, selectedDetail]);

  useEffect(() => {
    const socket = io(
      `${import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_DANADESA}`
    );

    socket.on("syncStatus", (data) => {
      setMessage(data.message || "");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_NADINE_DETAIL}/${selectedDetail}/${token}`
      );
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setData(result.data[0].dataDisposisi); // Ambil dataDisposisi
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching detail data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      size="xl"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-envelope-fill mx-2 text-success"></i>
          {}Detail Nota ID : {id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          minHeight: "500px", // Menjaga tinggi konsisten saat loading
          overflow: "auto", // Membuat konten scrollable
          maxHeight: "500px", // Membatasi tinggi maksimal
          background: { bgcolor },
        }}
      >
        {loading ? (
          <>
            {message && (
              <p
                className="p-3 rounded text-center"
                style={{
                  backgroundColor: "#f8f9fa", // Soft gray background
                  border: "1px solid #dee2e6", // Light border
                  color: "#495057", // Dark text color
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
                  marginBottom: "1rem", // Spacing below
                }}
              >
                {message}
              </p>
            )}

            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "300px" }} // Sesuaikan tinggi sesuai kebutuhan
            >
              <div className="d-flex gap-2">
                <Spinner animation="grow" variant="primary" />
                <Spinner animation="grow" variant="success" />
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />

                <Spinner animation="grow" variant="dark" />
              </div>
            </div>
          </>
        ) : data && data.length > 0 ? (
          <div className="fade-in">
            {" "}
            {/* Tambahkan kelas untuk animasi */}
            {data.map((dispo, index) => (
              <Card
                key={index}
                className="mb-3"
                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
              >
                <Card.Header
                  className="bg-primary text-white my-2"
                  style={{ padding: "10px" }}
                >
                  <h5>
                    {dispo.dispoEs4 &&
                    dispo.dispoEs4.length > 0 &&
                    dispo.dispoEs4[0].UnitPenerima
                      ? dispo.dispoEs4[0].UnitPenerima.NamaEselon3
                      : "Data Eselon 3 Tidak Tersedia"}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: "5px",
                      borderRadius: "5px",
                      textAlign: "center",
                      margin: "10px",
                    }}
                  >
                    <h6>Eselon 4</h6>
                  </div>
                  <ul>
                    {dispo.dispoEs4.map((es4, es4Index) => (
                      <li key={es4Index}>
                        <strong>Unit : </strong>{" "}
                        {es4.UnitPenerima?.NamaOrganisasi || "Tidak tersedia"}
                        <br />
                        <strong>Nama : </strong>{" "}
                        {es4.UnitPenerima?.NamaPejabat || "Tidak tersedia"}
                        <br />
                        <strong>NIP : </strong>{" "}
                        {es4.UnitPenerima?.NipPejabat || "Tidak tersedia"}
                        <br />
                        -----------------------------------------------------
                      </li>
                    ))}
                  </ul>

                  <div
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: "5px",
                      borderRadius: "5px",
                      textAlign: "center",
                      margin: "10px",
                    }}
                  >
                    <h6>Pelaksana</h6>
                  </div>

                  <ul>
                    {dispo.dispoStaf.map((staf, stafIndex) => (
                      <li key={stafIndex}>
                        <strong>Nama : </strong> {staf.UserPenerima.Nama}
                        <br />
                        <strong>NIP : </strong> {staf.UserPenerima.Nip18}
                        <br />
                        <strong>Jabatan : </strong>{" "}
                        {staf.UserPenerima.NamaJabatan}
                        <br />
                        -----------------------------------------------------
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <p
            className="text-center text-danger fw-bold"
            style={{ verticalAlign: "middle" }}
          >
            data nota detail Nadine gagal didapatkan...
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Detail;
