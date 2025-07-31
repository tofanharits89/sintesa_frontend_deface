import React, { useEffect, useState, useContext } from "react";
import {
  Modal,
  Table,
  Button,
  Container,
  Row,
  Col,
  Form,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";

export default function RekamanNotaDinas({ show, onHide }) {
  const { axiosJWT, token } = useContext(MyContext);
  const [rekaman, setRekaman] = useState([]);
  const [tahunFilter, setTahunFilter] = useState("");
  const [triwulanFilter, setTriwulanFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Daftar tahun untuk dropdown (2025 - 2027)
  const tahunOptions = Array.from({ length: 3 }, (_, i) => 2025 + i);
  // Daftar triwulan (1 - 4)
  const triwulanOptions = [1, 2, 3, 4];

  useEffect(() => {
    if (show) {
      fetchRekaman();
    }
  }, [show]);

  // Ambil data rekaman dari backend
  const fetchRekaman = async () => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_GET_REKAMAN_NOTADINAS}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Periksa apakah respons dari backend memiliki URL file
      const updatedData = response.data.map((data) => ({
        ...data,
        fileUrl: data.nd_kanwil
          ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/monev_pnbp/${data.nd_kanwil}`
          : null,
      }));

      setRekaman(updatedData);
    } catch (error) {
      handleHttpError(
        error.response?.status,
        error.response?.data?.error || "Gagal mengambil data rekaman"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter data berdasarkan tahun & triwulan
  const filteredRekaman = rekaman.filter(
    (data) =>
      (tahunFilter ? data.tahun === tahunFilter : true) &&
      (triwulanFilter ? data.triwulan === triwulanFilter : true)
  );

  // **Menghapus Duplikasi Data**
  const uniqueRekaman = filteredRekaman.reduce((acc, current) => {
    const exists = acc.find(
      (item) =>
        item.tahun === current.tahun &&
        item.triwulan === current.triwulan &&
        item.kdkanwil === current.kdkanwil &&
        item.nd_kanwil === current.nd_kanwil
    );
    if (!exists) acc.push(current);
    return acc;
  }, []);

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Monitoring Kiriman ND Kanwil</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "500px", overflowY: "auto" }}>
        <Container>
          {/* Filter Tahun & Triwulan */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Pilih Tahun</Form.Label>
                <Form.Select
                  value={tahunFilter}
                  onChange={(e) => setTahunFilter(e.target.value)}
                >
                  <option value="">Semua Tahun</option>
                  {tahunOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Pilih Triwulan</Form.Label>
                <Form.Select
                  value={triwulanFilter}
                  onChange={(e) => setTriwulanFilter(e.target.value)}
                >
                  <option value="">Semua Triwulan</option>
                  {triwulanOptions.map((tri) => (
                    <option key={tri} value={tri}>
                      Triwulan {tri}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Tabel Rekaman Nota Dinas */}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : uniqueRekaman.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark text-center">
                <tr>
                  <th>No</th>
                  <th>Tahun</th>
                  <th>Triwulan</th>
                  <th>Kanwil</th>
                  <th>Nama File</th>
                  <th>File</th>
                  <th>Tgl Kirim</th>
                </tr>
              </thead>
              <tbody>
                {uniqueRekaman.map((data, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{data.tahun}</td>
                    <td className="text-center">{data.triwulan}</td>
                    <td className="text-center">
                      {data.nmkanwil} ({data.kdkanwil})
                    </td>
                    <td>{data.nd_kanwil}</td>
                    <td className="text-center">
                      {data.fileUrl ? (
                        <a
                          href={data.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-danger">Belum ada file</span>
                      )}
                    </td>
                    <td>
                      {data.tgl_kirim
                        ? new Date(data.tgl_kirim)
                          .toISOString()
                          .replace("T", " ")
                          .slice(0, 19)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted">
              Tidak ada kiriman Nota Dinas untuk filter ini.
            </p>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
