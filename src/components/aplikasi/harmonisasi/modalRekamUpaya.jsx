import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Table,
  Tabs,
  Tab,
  Card,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { toast } from "react-toastify";
import Kdkanwil from "../../referensi/KdkanwilHarmon";
import NotifikasiSukses from "../notifikasi/notifsukses";
import styles from "./modalRekamUpaya.module.css";
import GenerateCSV from "../CSV/generateCSV";
import moment from "moment";

export default function RekamUpaya({ show, onHide }) {
  const { axiosJWT, token, role, kdkanwil, username } = useContext(MyContext);
  const [thang, setThang] = useState("");
  const [semester, setSemester] = useState("");
  const [kanwil, setKanwil] = useState("00");
  const [upaya, setUpaya] = useState("");
  const [loading, setLoading] = useState(false);
  const [rekamanUpaya, setRekamanUpaya] = useState([]);
  const [loadingRekaman, setLoadingRekaman] = useState(false);
  const [sql, setSql] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);

  const thangOptions = Array.from({ length: 3 }, (_, i) => 2025 + i);
  const semesterOptions = [1, 2];

  useEffect(() => {
    if (show) {
      setKanwil(role === "2" ? kdkanwil : "00");
      setThang("");
      setSemester("");
      setUpaya("");
      setRekamanUpaya([]);
      setSql("");
    }
  }, [show, role, kdkanwil]);

  useEffect(() => {
    if (show && thang && semester) {
      getDataUpaya();
    }
  }, [show, thang, semester, kanwil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thang || !semester || !kanwil || !upaya) {
      toast.error("Semua field harus diisi!");
      return;
    }

    const payload = { thang, semester, kdkanwil: kanwil, upaya };

    try {
      setLoading(true);
      await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANUPAYAHARMONISASI,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      NotifikasiSukses("Data berhasil disimpan");
      setUpaya("");
      getDataUpaya();
    } catch (error) {
      handleHttpError(
        error.response?.status,
        error.response?.data?.error || "Gagal menyimpan Upaya Harmonisasi"
      );
    } finally {
      setLoading(false);
    }
  };

  const getDataUpaya = async () => {
    setLoadingRekaman(true);
    const whereClause = [
      thang ? `thang = '${thang}'` : "",
      semester ? `semester = '${semester}'` : "",
      kanwil !== "00" ? `kdkanwil = '${kanwil}'` : "",
    ]
      .filter(Boolean)
      .join(" AND ");

    const query = `SELECT id, thang, semester, kdkanwil, nmkanwil, upaya, tgl_rekam 
            FROM laporan_2023.upaya_harmonisasi 
            ${whereClause ? `WHERE ${whereClause}` : ""}`;

    const encodedQuery = encodeURIComponent(query);
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setSql(cleanedQuery);

    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_UPAYAHARMONISASI}${encryptedQuery}&limit=${limit}&page=${page}&user=${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRekamanUpaya(response.data.result || []);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        data?.error || "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoadingRekaman(false);
    }
  };

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-chat-text-fill text-success me-2"></i>
          Rekam Upaya Harmonisasi satker K/L dan Pemda
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBodyCustom}>
        <Form onSubmit={handleSubmit}>
          <Card className="p-3 mb-3 shadow-sm border-0">
            <Row>
              <Col md={4}>
                <Form.Group>
                  {/* <Form.Label>Tahun</Form.Label> */}
                  <Form.Select
                    value={thang}
                    onChange={(e) => setThang(e.target.value)}
                  >
                    <option value="">Pilih Tahun</option>
                    {thangOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  {/* <Form.Label>Semester</Form.Label> */}
                  <Form.Select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="">Pilih Semester</option>
                    {semesterOptions.map((smt) => (
                      <option key={smt} value={smt}>{`Semester ${smt}`}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  {/* <Form.Label>Kanwil</Form.Label> */}
                  <Kdkanwil
                    value={kanwil}
                    onChange={(value) => setKanwil(value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Tabs defaultActiveKey="form" className="mb-3 custom-tab">
            <Tab
              eventKey="form"
              title={<span className="text-dark">Rekam</span>}
            >
              <Card className="p-3 shadow-sm border-0">
                <Form.Group className="mb-3">
                  {/* <Form.Label>Uraian Upaya Harmonisasi</Form.Label> */}
                  <Form.Control
                    as="textarea"
                    rows={10}
                    // style={{ resize: "vertical" }}
                    className={styles.upayaTextarea}
                    value={upaya}
                    onChange={(e) => setUpaya(e.target.value)}
                    placeholder="Tuliskan upaya harmonisasi yang sudah dilakukan..."
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button variant="success" type="submit" disabled={loading}>
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                  <Button variant="secondary" onClick={onHide} className="ms-2">
                    Tutup
                  </Button>
                </div>
              </Card>
            </Tab>

            <Tab
              eventKey="rekaman"
              title={<span className="text-dark">Hasil</span>}
            >
              <Card className="p-3 shadow-sm border-0">
                <div className={styles.scrollTable}>
                  {loadingRekaman ? (
                    <div className="text-center my-3">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <Table striped bordered hover responsive className="mt-2">
                      <thead className="table-dark text-center">
                        <tr>
                          <th>No</th>
                          <th>Tahun/Semester</th>
                          <th>Kanwil</th>
                          <th>Upaya</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rekamanUpaya.length > 0 ? (
                          rekamanUpaya.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">
                                {index + 1 + page * limit}
                              </td>
                              <td className="text-center">
                                {item.thang}/{item.semester}
                              </td>
                              <td className="text-center">
                                ({item.kdkanwil}) - {item.nmkanwil}
                              </td>
                              <td className={`${styles.textJustify}`}>
                                {item.upaya}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              Belum ada data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>
                <div className="d-flex justify-content-end align-item-center">
                  <Button
                    variant="success"
                    size="sm"
                    className="button"
                    onClick={() => {
                      setLoadingStatus(true);
                      setExport2(true);
                    }}
                    disabled={loadingStatus}
                    style={{ padding: "5px 10px", marginTop: "35px" }}
                  >
                    {loadingStatus && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}{" "}
                    {!loadingStatus && (
                      <i className="bi bi-file-earmark-excel-fill mx-2"></i>
                    )}
                    {loadingStatus ? "Loading..." : "Download"}
                  </Button>
                </div>
              </Card>
            </Tab>
          </Tabs>
          {export2 && (
            <GenerateCSV
              query3={sql}
              status={handleStatus}
              namafile={`v3_CSV_UPAYA_HARMONISASI_${moment().format(
                "DDMMYY-HHmmss"
              )}`}
            />
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
