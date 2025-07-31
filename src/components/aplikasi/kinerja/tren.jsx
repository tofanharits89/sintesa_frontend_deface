import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Form,
  Offcanvas,
  Button,
  Col,
  Row,
  Modal,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
import moment from "moment";

const Tren = ({ show, handleClose, data, isi }) => {
  const { axiosJWT, token, kdkanwil, role } = useContext(MyContext);

  const [loadingtren, setLoadingtren] = useState(false);
  const [update, setUpdate] = useState("");
  const [formData, setFormData] = useState({
    input1: isi && isi[0] ? isi[0].isu : "",
    input2: isi && isi[1] ? isi[1].isu : "",
    input3: isi && isi[2] ? isi[2].isu : "",
    input4: isi && isi[3] ? isi[3].isu : "",
    input5: isi && isi[4] ? isi[4].isu : "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      data,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isi) {
      setFormData({
        input1: isi[0] ? isi[0].isu : "",
        input2: isi[1] ? isi[1].isu : "",
        input3: isi[2] ? isi[2].isu : "",
        input4: isi[3] ? isi[3].isu : "",
        input5: isi[4] ? isi[4].isu : "",
        data: data,
      });
    }
  }, [isi]);

  useEffect(() => {
    if (isi.length > 0) {
      const item = isi[0];
      const formattedDate = moment(item.createdAt).format(
        "DD/MM/YYYY hh:mm:ss"
      );
      setUpdate(
        `diupdate terakhir oleh user  ${item.username} tanggal ${formattedDate}`
      );
    }
  }, [isi]);

  const handleSubmit = async (e) => {
    setLoadingtren(true);
    e.preventDefault();

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANTREN,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Swal.fire({
      //   html: `<div className='text-success mt-4'>Data Berhasil Disimpan</div>`,
      //   icon: "success",
      //   position: "top",
      //   buttonsStyling: false,
      //   customClass: {
      //     popup: "swal2-animation",
      //     container: "swal2-animation",
      //     confirmButton: "swal2-confirm ",
      //     icon: "swal2-icon",
      //   },
      //   confirmButtonText: "Tutup",
      // });
      setLoadingtren(false);
      handleClose();
    } catch (error) {
      console.log(error);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoadingtren(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Rekam Data</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ minHeight: "auto" }} className="bg-light">
        <Container fluid>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <Form.Group controlId="input1" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tren Dukman/ Teknis</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="input1"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input1}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Form.Group controlId="input2" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tren Jenis Belanja</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="input2"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input2}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Form.Group controlId="input3" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tren Belanja Bulanan</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="input3"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input3}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Form.Group controlId="input4" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tren Sumber Dana </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="input4"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input4}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Form.Group controlId="input5" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tren UP/TUP </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="input5"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input5}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <Button variant="danger" size="sm" type="submit">
              Simpan
            </Button>
          </Form>
          <p className="text-muted my-4 fst-italic">{update}</p>
        </Container>
      </Offcanvas.Body>

      <Modal show={loadingtren} animation={false} size="md">
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>loading...</p>
          <p>menyimpan data...</p>
        </Modal.Body>
      </Modal>
    </Offcanvas>
  );
};

export default Tren;
