import React, { useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  Modal,
  Spinner,
  Container,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";

const KirimNotifikasi = () => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    messageType: "",
    destination: "",
    pinned: false,
    username: username,
    sendAs: "notifikasi", // default: hanya notifikasi
  });

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (
      formData.title.trim() === "" ||
      formData.content.trim() === "" ||
      formData.messageType.trim() === "" ||
      formData.destination.trim() === ""
    ) {
      setShowAlert(true);
      setLoading(false);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANNOTIFIKASI,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFormData({
        title: "",
        content: "",
        messageType: "",
        destination: "",
        pinned: false,
        username: username,
        sendAs: "notifikasi", // reset ke notifikasi
      });

      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      setLoading(false);
    }
  };
  //console.log(formData);
  return (
    <Container fluid>
      {showAlert && (
        <Alert
          className="fade-in"
          variant="danger"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          Mohon isi semua field sebelum mengirim pesan.
        </Alert>
      )}
      {showSuccessAlert && (
        <Alert
          className="fade-in"
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
        >
          Notifikasi Berhasil Dikirim.
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        {/* Hapus dropdown Kirim sebagai */}
        {/* <Row className="mb-3">
          <Form.Group as={Col} controlId="sendAs">
            <Form.Label>Kirim sebagai:</Form.Label>
            <Form.Select
              value={formData.sendAs}
              onChange={(e) => handleChange("sendAs", e.target.value)}
            >
              <option value="">--- Pilih ---</option>
              <option value="pesan">Pesan</option>
              <option value="notifikasi">Notifikasi</option>
            </Form.Select>
          </Form.Group>
        </Row> */}
        <Row className="mb-3">
          <Form.Group as={Col} controlId="title">
            <Form.Label>Judul:</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              maxLength={255}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="messageType">
            <Form.Label>Prioritas:</Form.Label>
            <Form.Select
              value={formData.messageType}
              onChange={(e) => handleChange("messageType", e.target.value)}
            >
              <option value="">--- Pilih ---</option>
              <option value="biasa">Biasa</option>
              <option value="penting">Penting</option>
              <option value="sangatpenting">Sangat Penting</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="destination">
            <Form.Label>Tujuan:</Form.Label>
            <Form.Select
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
            >
              <option value="">--- Pilih ---</option>
              <option value="00">Semua Level</option>
              <option value="X">Super Admin</option>
              <option value="0">Admin Pusat</option>
              <option value="1">Kantor Pusat</option>
              <option value="2">Kanwil DJPBN</option>
              <option value="3">KPPN</option>
              <option value="4">Lainnya</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="content">
            <Form.Label>Isi :</Form.Label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => handleChange("content", value)}
              style={{ height: "300px", marginBottom: "50px" }}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="pinned">
            <Form.Check
              type="checkbox"
              label="Pinned"
              checked={formData.pinned}
              onChange={(e) => handleChange("pinned", e.target.checked)}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3 mt-4" style={{ marginTop: "100px" }}>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              className="button-download "
              type="submit"
            >
              {loading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {loading ? "Loading..." : "Kirim"}
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </Container>
  );
};

export default KirimNotifikasi;
