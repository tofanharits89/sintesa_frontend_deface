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

const Isu = ({ show, handleClose, data, isi }) => {
  const { axiosJWT, token, kdkanwil, role } = useContext(MyContext);
  const [loadingisu, setLoadingisu] = useState(false);
  const [update, setUpdate] = useState("");
  const [formData, setFormData] = useState({
    input1: isi && isi[0] ? isi[0].isu : "",
    input2: isi && isi[1] ? isi[1].isu : "",
    input3: isi && isi[2] ? isi[2].isu : "",
    input4: isi && isi[3] ? isi[3].isu : "",
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
        data: data,
      });
    }
  }, [isi]);

  const handleSubmit = async (e) => {
    setLoadingisu(true);
    e.preventDefault();

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANISU_CLUSTER,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoadingisu(false);
      // Swal.fire({
      //   html: `<div className='text-success mt-4'>Data Berhasil Disimpan</div>`,
      //   icon: "success", // Tambahkan ikon error
      //   position: "top",
      //   buttonsStyling: false,
      //   customClass: {
      //     popup: "swal2-animation",
      //     container: "swal2-animation",
      //     confirmButton: "swal2-confirm ", // Gunakan kelas CSS kustom untuk tombol
      //     icon: "swal2-icon", // Gunakan kelas CSS kustom untuk ikon
      //   },
      //   confirmButtonText: "Tutup",
      // });
      handleClose();
    } catch (error) {
      console.log(error);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoadingisu(false);
    }
  };
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

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Rekam Data</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ minHeight: "auto" }} className="bg-light">
        <Container fluid>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="input1" style={{ marginBottom: "20px" }}>
              <Form.Label>Isu 1</Form.Label>
              <Form.Control
                as="textarea"
                name="input1"
                placeholder="Masukkan teks di sini..."
                value={formData.input1}
                onChange={handleInputChange}
                style={{ height: "150px" }}
              />
            </Form.Group>
            <Form.Group controlId="input2" style={{ marginBottom: "20px" }}>
              <Form.Label>Isu 2</Form.Label>
              <Form.Control
                as="textarea"
                name="input2"
                placeholder="Masukkan teks di sini..."
                value={formData.input2}
                onChange={handleInputChange}
                style={{ height: "150px" }}
              />
            </Form.Group>
            <Form.Group controlId="input3" style={{ marginBottom: "20px" }}>
              <Form.Label>Isu 3</Form.Label>
              <Form.Control
                as="textarea"
                name="input3"
                placeholder="Masukkan teks di sini..."
                value={formData.input3}
                onChange={handleInputChange}
                style={{ height: "150px" }}
              />
            </Form.Group>
            <Form.Group controlId="input4" style={{ marginBottom: "20px" }}>
              <Form.Label>Isu 4</Form.Label>
              <Form.Control
                as="textarea"
                name="input4"
                placeholder="Masukkan teks di sini..."
                value={formData.input4}
                onChange={handleInputChange}
                style={{ height: "150px" }}
              />
            </Form.Group>

            <Button variant="danger" size="sm" type="submit">
              Simpan
            </Button>
          </Form>
          <p className="text-muted my-4 fst-italic">{update}</p>
        </Container>
      </Offcanvas.Body>
      <Modal show={loadingisu} animation={false} size="md">
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>loading...</p>
          <p>menyimpan data...</p>
        </Modal.Body>
      </Modal>
    </Offcanvas>
  );
};

export default Isu;
