import {
  Card,
  Row,
  Col,
  Spinner,
  Button,
  CardBody,
  Container,
} from "react-bootstrap";
import { ListGroup, Badge } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import IsuSpesifik from "../modal/isuspesifik";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import InputIsu from "../isu/inputIsu";
import EditIsuSpesifik from "../modal/editisuspesifik";

const TabIsuSpesifik = ({ lokasi }) => {
  const { role, kdkanwil, axiosJWT, username, token, dataEpa } =
    useContext(MyContext);
  const [showModal, setShowModal] = useState(false);
  const [showModaledit, setShowModaledit] = useState(false);
  const [cardText, setCardText] = useState([]);
  const [loading, setLoading] = useState(false);

  // Konversi Nama Bulan ke Angka
  const periodOptions = [
    "Januari",
    "Pebruari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const monthIndex = periodOptions.indexOf(dataEpa.period);
  const monthNumber =
    monthIndex !== -1 ? String(monthIndex + 1).padStart(2, "0") : "00";

  // Buat `key`
  const key = `${dataEpa.year}${monthNumber}${dataEpa.kodeKanwil}${dataEpa.lokasiKanwil}${dataEpa.kddept}`;

  const getDataIsu = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT isu,keyId FROM epa25.isu_spesifik WHERE keyId='${key}'`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // console.log(cleanedQuery);

    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCardText(response.data.result || []); // Default ke array kosong jika data kosong
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataIsu();
  }, [key, showModal, showModaledit]);

  const handleTextClick = (isu) => {
    setShowModaledit(true);
  };

  const handleSaveText = (newText) => {
    setCardText(newText);
  };

  return (
    <Container fluid>
      <h2 style={{ fontSize: "20px" }} className="p-3">
        Isu Spesifik Pelaksanaan Anggaran <br /> TA {dataEpa.year}{" "}
      </h2>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body style={{ height: "550px", overflow: "scroll" }}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  {cardText.length > 0 ? (
                    <>
                      <ListGroup className="isu-list fade-in">
                        {cardText.map((isu, index) => (
                          <ListGroup.Item
                            key={isu.id || index}
                            onClick={() => handleTextClick(isu)}
                            className="isu-item"
                          >
                            <Badge className="isu-badge">{index + 1}</Badge>
                            <span className="isu-text mx-4">{isu.isu}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      {role === "X" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setShowModal(true)} // Membuka modal input
                        >
                          Rekam Isu Spesifik
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
          <EditIsuSpesifik
            show={showModaledit}
            onHide={() => setShowModaledit(false)}
            text={cardText && cardText}
            onSaveEdit={handleSaveText}
          />
          <IsuSpesifik
            show={showModal}
            onHide={() => setShowModal(false)}
            text={cardText[0] && cardText[0].isu}
            onSave={handleSaveText}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default TabIsuSpesifik;
