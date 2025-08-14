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
import styles from "./modalRekamKesimpulan.module.css";
import GenerateCSV from "../CSV/generateCSV";
import moment from "moment";

export default function RekamKesimpulan({ show, onHide }) {
  const { axiosJWT, token, role, kdkanwil, username } = useContext(MyContext);
  const [thang, setThang] = useState("");
  const [triwulan, setTriwulan] = useState("");
  const [kanwil, setKanwil] = useState("00");
  const [kesimpulan, setKesimpulan] = useState("");
  const [rekomendasi, setRekomendasi] = useState("");
  const [gambaran_umum, setGambaran_umum] = useState("");
  const [loading, setLoading] = useState(false);
  const [rekamanKesimpulan, setRekamanKesimpulan] = useState([]);
  // const [rekamanRekomendasi, setRekamanRekomendasi] = useState([]);
  const [loadingRekaman, setLoadingRekaman] = useState(false);
  const [sql, setSql] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);
  const [activeTab, setActiveTab] = useState("form-gambaran");

  const thangOptions = Array.from({ length: 3 }, (_, i) => 2025 + i);
  const triwulanOptions = [2, 4];

  useEffect(() => {
    if (show) {
      setKanwil(role === "2" ? kdkanwil : "00");
      setThang("");
      setTriwulan("");
      setKesimpulan(kesimpulan);
      setRekamanKesimpulan([]);
      setRekomendasi(rekomendasi);
      setGambaran_umum(gambaran_umum);
      // setRekamanRekomendasi([]);
      setSql("");
    }
  }, [show, role, kdkanwil]);

  useEffect(() => {
    if (show && thang && triwulan) {
      getDataKesimpulan();
    }
  }, [show, thang, triwulan, kanwil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thang || !triwulan || !kanwil || !kesimpulan) {
      toast.error("Semua field kesimpulan harus diisi!");
      return;
    }

    const payload = { thang, triwulan, kdkanwil: kanwil, kesimpulan };

    try {
      setLoading(true);
      await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANKESIMPULAN_MONEVPNBP,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      NotifikasiSukses("Kesimpulan berhasil disimpan");
      setKesimpulan("");
      getDataKesimpulan();
    } catch (error) {
      handleHttpError(
        error.response?.status,
        error.response?.data?.error || "Gagal menyimpan kesimpulan"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRekom = async (e) => {
    e.preventDefault();
    if (!thang || !triwulan || !kanwil || !rekomendasi) {
      toast.error("Semua field rekomendasi harus diisi!");
      return;
    }

    const payload2 = { thang, triwulan, kdkanwil: kanwil, rekomendasi };

    try {
      setLoading(true);
      await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANREKOMENDASI_MONEVPNBP,
        payload2,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      NotifikasiSukses("Rekomendasi berhasil disimpan");
      setRekomendasi("");
      getDataKesimpulan();
    } catch (error) {
      handleHttpError(
        error.response?.status,
        error.response?.data?.error || "Gagal menyimpan rekomendasi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGambaran = async (e) => {
    e.preventDefault();
    if (!thang || !triwulan || !kanwil || !gambaran_umum) {
      toast.error("Semua field gambaran umum harus diisi!");
      return;
    }

    const payload3 = { thang, triwulan, kdkanwil: kanwil, gambaran_umum };

    try {
      setLoading(true);
      await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANGAMBARAN_MONEVPNBP,
        payload3,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      NotifikasiSukses("Gambaran umum berhasil disimpan");
      setGambaran_umum("");
      getDataKesimpulan();
    } catch (error) {
      handleHttpError(
        error.response?.status,
        error.response?.data?.error || "Gagal menyimpan gambaran umum"
      );
    } finally {
      setLoading(false);
    }
  };

  const getDataKesimpulan = async () => {
    setLoadingRekaman(true);
    const whereClause = [
      thang ? `thang = '${thang}'` : "",
      triwulan ? `triwulan = '${triwulan}'` : "",
      kanwil !== "00" ? `kdkanwil = '${kanwil}'` : "",
    ]
      .filter(Boolean)
      .join(" AND ");

    const query = `SELECT id, thang, triwulan, kdkanwil, nmkanwil, gambaran_umum, kesimpulan, rekomendasi, tgl_rekam_gambaran, tgl_rekam_simpulan, tgl_rekam_rekom 
            FROM laporan_2023.kesimpulan_monev_pnbp
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
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_KESIMPULAN_MONEVPNBP
        }${encryptedQuery}&limit=${limit}&page=${page}&user=${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRekamanKesimpulan(response.data.result || []);
      // setRekamanRekomendasi(response.data.result || []);
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
          Rekam Gambaran Umum, Kesimpulan, dan Rekomendasi Pelaksanaan Monev
          PNBP
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBodyCustom}>
        <Form
          onSubmit={(e) => {
            if (activeTab === "form-gambaran") {
              handleSubmitGambaran(e);
            } else if (activeTab === "form-kesimpulan") {
              handleSubmit(e);
            } else if (activeTab === "form-rekomendasi") {
              handleSubmitRekom(e);
            }
          }}
        >
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
                  {/* <Form.Label>triwulan</Form.Label> */}
                  <Form.Select
                    value={triwulan}
                    onChange={(e) => setTriwulan(e.target.value)}
                  >
                    <option value="">Pilih Triwulan</option>
                    {triwulanOptions.map((tw) => (
                      <option key={tw} value={tw}>{`Triwulan ${tw}`}</option>
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

          <Tabs
            defaultActiveKey="form-gambaran"
            className="mb-3 custom-tab"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Tab
              eventKey="form-gambaran"
              title={<span className="text-dark">Gambaran Umum</span>}
            >
              <Card className="p-3 shadow-sm border-0">
                <Form.Group className="mb-3">
                  {/* <Form.Label>Uraian Upaya Harmonisasi</Form.Label> */}
                  <Form.Control
                    as="textarea"
                    rows={10}
                    // style={{ resize: "vertical" }}
                    className={styles.gambaranTextarea}
                    value={gambaran_umum}
                    onChange={(e) => setGambaran_umum(e.target.value)}
                    placeholder="Tuliskan gambaran umum pelaksanaan penerimaan dan belanja PNBP..."
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
              eventKey="form-kesimpulan"
              title={<span className="text-dark">Kesimpulan</span>}
            >
              <Card className="p-3 shadow-sm border-0">
                <Form.Group className="mb-3">
                  {/* <Form.Label>Uraian Upaya Harmonisasi</Form.Label> */}
                  <Form.Control
                    as="textarea"
                    rows={10}
                    // style={{ resize: "vertical" }}
                    className={styles.kesimpulanTextarea}
                    value={kesimpulan}
                    onChange={(e) => setKesimpulan(e.target.value)}
                    placeholder="Tuliskan kesimpulan monev PNBP yang sudah dilakukan..."
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
              eventKey="form-rekomendasi"
              title={<span className="text-dark">Rekomendasi</span>}
            >
              <Card className="p-3 shadow-sm border-0">
                <Form.Group className="mb-3">
                  {/* <Form.Label>Uraian Upaya Harmonisasi</Form.Label> */}
                  <Form.Control
                    as="textarea"
                    rows={10}
                    // style={{ resize: "vertical" }}
                    className={styles.rekomendasiTextarea}
                    value={rekomendasi}
                    onChange={(e) => setRekomendasi(e.target.value)}
                    placeholder="Tuliskan rekomendasi bagi KPPN/Kanwil DJPb/Kantor Pusat DJPb/DJA atas hasil monev PNBP yang telah dilakukan..."
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
                          <th>Tahun/Triwulan</th>
                          <th>Kanwil</th>
                          <th>Gambaran Umum</th>
                          <th>Kesimpulan</th>
                          <th>Rekomendasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rekamanKesimpulan.length > 0 ? (
                          rekamanKesimpulan.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">
                                {index + 1 + page * limit}
                              </td>
                              <td className="text-center">
                                {item.thang}/{item.triwulan}
                              </td>
                              <td className="text-center">
                                ({item.kdkanwil}) - {item.nmkanwil}
                              </td>
                              <td className={`${styles.textJustify}`}>
                                {item.gambaran_umum}
                              </td>
                              <td className={`${styles.textJustify}`}>
                                {item.kesimpulan}
                              </td>
                              <td className={`${styles.textJustify}`}>
                                {item.rekomendasi}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
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
              namafile={`v3_CSV_KESIMPULAN_REKOMENDASI_MONEV_PNBP_${moment().format(
                "DDMMYY-HHmmss"
              )}`}
            />
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
