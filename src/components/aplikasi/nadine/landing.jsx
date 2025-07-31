import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Button,
  Alert,
  Spinner,
  Card,
  Table,
  Dropdown,
  Modal,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import "./nadine.css";
import { io } from "socket.io-client";
import Detail from "./detail";
import SaveUserData from "../PDF/simpanTukangAkses";
import moment from "moment";

export const TrackNadine = () => {
  const { role, kdkanwil, axiosJWT, username } = useContext(MyContext);
  const [documentId, setDocumentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");
  const [filterYear, setFilterYear] = useState(""); // Tahun filter
  const [searchQuery, setSearchQuery] = useState(""); // Query pencarian
  const [filteredData, setFilteredData] = useState([]); // Data hasil filter
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState(null);
  const [dataupdate, setDataupdate] = useState([]);
  const [loadingx, setLoadingx] = useState(false);

  // useEffect(() => {
  //   getUpdate();
  // }, []);

  const getUpdate = async () => {
    setLoadingx(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_NADINE_UPDATE_TOKEN}`
      );
      const dataup = await response.json();
      // console.log(dataup);
      setLoadingx(false);
      setDataupdate(dataup);
    } catch (error) {
      setLoadingx(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    setShowResult(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_NADINE}${documentId}`
      );
      const data = await response.json();

      if (response.ok) {
        setSearchQuery("");
        setStatus(data);
        setFilteredData(data.data.result); // Set data awal
        setToken(data.data.token);
        setShowResult(true);
      } else {
        setError(data.message || "Terjadi kesalahan");
        setShowResult(false);
      }
      getUpdate();
    } catch (err) {
      setError("Gagal menghubungi server");
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  };
  const gradients = [
    "linear-gradient(135deg, rgba(199, 249, 204, 0.8), rgba(189, 224, 254, 0.8))",
    "linear-gradient(135deg, rgba(233, 216, 253, 0.8), rgba(255, 250, 205, 0.8))",
    "linear-gradient(135deg, rgba(253, 221, 210, 0.8), rgba(253, 226, 228, 0.8))",
    "linear-gradient(135deg, rgba(189, 245, 255, 0.8), rgba(255, 253, 208, 0.8))",
    "linear-gradient(135deg, rgba(255, 223, 234, 0.8), rgba(255, 204, 203, 0.8))",
    "linear-gradient(135deg, rgba(208, 236, 236, 0.8), rgba(230, 224, 245, 0.8))",
    "linear-gradient(135deg, rgba(255, 245, 238, 0.8), rgba(255, 253, 248, 0.8))",
    "linear-gradient(135deg, rgba(240, 240, 255, 0.8), rgba(220, 235, 250, 0.8))", // Biru muda dan abu-abu
    "linear-gradient(135deg, rgba(255, 235, 215, 0.8), rgba(255, 250, 240, 0.8))", // Peach lembut dan putih
    "linear-gradient(135deg, rgba(240, 248, 255, 0.8), rgba(230, 230, 250, 0.8))", // Biru pastel dan lavender
    "linear-gradient(135deg, rgba(255, 248, 220, 0.8), rgba(250, 250, 210, 0.8))", // Kuning lembut dan krem
    "linear-gradient(135deg, rgba(255, 239, 213, 0.8), rgba(250, 230, 230, 0.8))", // Peach pastel dan merah muda
    "linear-gradient(135deg, rgba(244, 252, 250, 0.8), rgba(240, 255, 240, 0.8))", // Hijau mint dan putih kehijauan
    "linear-gradient(135deg, rgba(255, 250, 244, 0.8), rgba(245, 222, 179, 0.8))", // Krem lembut dan pasir
  ];

  const [bgColor, setBgColor] = useState(gradients[0]); // Gradien pertama sebagai nilai awal

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % gradients.length; // Ganti gradien setiap 3 detik
      setBgColor(gradients[index]);
    }, 3000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen tidak aktif
  }, []);

  const handleFilterData = () => {
    if (!status || !status.data || !status.data.result) {
      return; // Jangan lakukan apa-apa jika data belum tersedia
    }

    let data = status.data.result;

    // Filter berdasarkan tahun
    if (filterYear && filterYear !== "all") {
      data = data.filter((item) => {
        const year = new Date(item.NotaNadine.TglNd2).getFullYear();
        return year.toString() === filterYear;
      });
    }

    // Filter berdasarkan pencarian
    if (searchQuery) {
      data = data.filter((item) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          item.NotaNadine.Perihal.toLowerCase().includes(lowerCaseQuery) ||
          item.NotaNadine.Pengirim.toLowerCase().includes(lowerCaseQuery) ||
          item.NotaNadine.NoNd.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    setFilteredData(data);
  };
  useEffect(() => {
    if (status && status.data) {
      handleFilterData();
    }
  }, [filterYear, searchQuery, status]);

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

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDetail(null);
  };
  // console.log(token);

  return (
    <main id="main">
      <section className="nadine-form-section" style={{ background: bgColor }}>
        <div className="d-flex align-items-center gap-2 justify-content-between">
          {message && (
            <div className="nadine-message-left">
              <small>{message}</small>
            </div>
          )}
          {dataupdate && (
            <div className="nadine-message-right">
              <small>
                Update Token :{" "}
                {moment(dataupdate.data).format("DD-MM-YYYY HH:mm:ss")}
              </small>
            </div>
          )}

          {status && status.data.totalData && (
            <div className="nadine-message-right">
              <small>
                {filteredData.length > 0
                  ? `${filteredData.length} data ditemukan`
                  : `${status.data.result.length} data ditemukan`}
              </small>
            </div>
          )}
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="documentId">
            <Form.Label className="my-1 my-4 text-center w-100">
              <h4 className="text-secondary">Track Disposisi Nadine </h4>
            </Form.Label>
            <div className="d-flex p-4 justify-content-center align-items-center">
              {/* Input Section */}
              <div
                className="input-container"
                style={{ width: "70%", marginRight: "10px" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Masukkan perihal, nomor ND, nota ID dll disini..."
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  required
                  className="nadine-input"
                  size="lg"
                  style={{
                    borderRadius: "10px", // Rounded corners for input
                    paddingLeft: "20px", // Add space for text
                    fontSize: "16px", // Make the font a bit larger
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                    borderColor: "#A8DADC", // Subtle border color
                  }}
                />
              </div>

              {/* Button Section */}
              <div className="button-container" style={{ width: "30%" }}>
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={loading}
                  className="btn-md"
                  style={{
                    width: "100%",
                    height: "48px", // Set a height to match input height
                    borderRadius: "10px", // Rounded corners for button
                    fontSize: "18px", // Larger text for the button
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Search ..."
                  )}
                </Button>
              </div>
            </div>
          </Form.Group>
        </Form>
      </section>

      <section className="nadine-result-section1">
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {showResult && status && !error && (
          <div className="nadine-scrollable-container fade-in">
            <div className="d-flex align-items-center justify-content-between gap-2 my-3">
              {/* Dropdown Filter */}
              <Form.Control
                as="select"
                style={{
                  border: `2px solid #A8DADC`,
                  borderRadius: "4px",
                  padding: "5px",
                  width: "50%", // Menentukan lebar relatif
                }}
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">Semua Tahun</option>
                {[
                  ...new Set(
                    status.data.result.map((item) => {
                      const year = new Date(
                        item.NotaNadine.TglNd2
                      ).getFullYear();
                      return year;
                    })
                  ),
                ].map((year, index) => (
                  <option key={index} value={year}>
                    Tahun {year}
                  </option>
                ))}
              </Form.Control>

              <div className="input-group" style={{ width: "50%" }}>
                <Form.Control
                  style={{
                    border: `2px solid #A8DADC`,
                    borderRadius: "4px",
                    padding: "5px",
                  }}
                  type="text"
                  placeholder="Cari data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="light"
                    className="border-0"
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  >
                    <i className="bi bi-x-circle-fill text-danger"></i>
                  </Button>
                )}
              </div>
            </div>

            <Card
              className={`nadine-card mt-4 ${showResult ? "show" : ""}`}
              style={{ background: bgColor }}
            >
              <Card.Body className="my-2">
                <div className="d-flex justify-content-end mb-3"></div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th style={{ fontSize: "17px" }}>No</th>
                      <th style={{ fontSize: "17px" }}>Pengirim</th>
                      <th style={{ fontSize: "17px" }}>Perihal</th>
                      <th style={{ fontSize: "17px" }}>No ND</th>
                      <th style={{ fontSize: "17px" }}>Tgl ND</th>
                      <th style={{ fontSize: "17px" }}>Tujuan Disposisi</th>
                      <th style={{ fontSize: "17px" }}>Tgl Kirim ND</th>
                      <th style={{ fontSize: "17px" }}>Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredData.length > 0
                      ? filteredData
                      : status.data.result
                    ).map((item, index) => {
                      const nota = item.NotaNadine;
                      const isRahasia = nota.Perihal.includes("Rahasia"); // Cek apakah perihal mengandung 'Rahasia'

                      return (
                        <tr
                          key={index}
                          style={{
                            filter: isRahasia ? "blur(4px)" : "none", // Terapkan efek blur jika Rahasia
                            pointerEvents: isRahasia ? "none" : "auto", // Nonaktifkan interaksi pada baris Rahasia
                          }}
                        >
                          <td>{index + 1}</td>
                          <td style={{ fontSize: "15px" }}>
                            {nota.Pengirim || "Tidak ada pengirim"}
                          </td>
                          <td style={{ fontSize: "15px" }}>{nota.Perihal}</td>{" "}
                          <td style={{ fontSize: "15px" }}>{nota.NoNd}</td>
                          <td style={{ fontSize: "15px" }}>
                            {moment(nota.TglNd).format("DD-MM-YYYY HH:mm:ss")}
                          </td>
                          <td style={{ fontSize: "15px" }}>
                            <ul
                              style={{ paddingLeft: "20px", textAlign: "left" }}
                            >
                              {item.NotaNadine.tujuanDispo.map((tujuan, i) => (
                                <li key={i}>{tujuan}</li>
                              ))}
                            </ul>
                          </td>{" "}
                          <td style={{ fontSize: "15px" }}>
                            {moment(item.updatedAt).format(
                              "DD-MM-YYYY HH:mm:ss"
                            )}
                          </td>
                          <td
                            style={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                          >
                            {item.ID !== "" ? (
                              <i
                                className="bi bi-arrow-right-square-fill text-danger"
                                onClick={() => handleDetailClick(item.ID)}
                              ></i>
                            ) : (
                              "null"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        )}
      </section>
      <SaveUserData userData={username} menu="track-nadine" />

      <Detail
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedDetail={selectedDetail}
        token={token}
        id={status && selectedDetail}
        bgcolor={bgColor}
      />
    </main>
  );
};
