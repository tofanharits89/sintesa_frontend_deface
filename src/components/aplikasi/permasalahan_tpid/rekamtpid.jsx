import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Loading2 } from "../../layout/LoadingTable";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import {
  Card,
  Table,
  Modal,
  Button,
  Alert,
  Spinner,
  Form,
  Col,
  Row,
} from "react-bootstrap";
import Rekam from "./modalTpid";
import ReactPaginate from "react-paginate";
import Kdkanwil from "../../referensi/KdkanwilTpid";
import GenerateCSV from "../CSV/generateCSV";
import moment from "moment";

export default function Tpid() {
  const { axiosJWT, token, role, kdkanwil, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [idCluster, setId] = useState(null); // Menambahkan variabel id
  const [jenisCluster, setJenisCluster] = useState(null); // Menambahkan variabel id
  // const [pilihan, setPilihan] = useState(null); // Menambahkan variabel id
  const [keterangan, setKeterangan] = useState(""); // Menambahkan variabel id
  const [rekomendasi, setRekomendasi] = useState(""); // Menambahkan variabel id

  const [kanwil, setKanwil] = useState("00");
  const [namaProker, setNamaProker] = useState("00");
  const [namaThang, setNamaThang] = useState("2025");
  const [namaTriwulan, setNamaTriwulan] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [sql, setSql] = useState("");
  const [sqlunduh, setSqlunduh] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);

  useEffect(() => {
    getData();
  }, [page, kanwil, namaProker, namaThang, namaTriwulan, searchQuery]);

  const handleKanwil = (kanwil) => {
    setKanwil(kanwil);
  };

  const getData = async () => {
    setLoading(true);
    const kanwilFilter = kanwil === "00" ? "" : `a.kdkanwil = '${kanwil}'`;
    const prokerFilter =
      namaProker === "00" ? "" : `a.proker = '${namaProker}'`;
    const triwulanFilter =
      namaTriwulan === "1"
        ? "a.triwulan='1'"
        : namaTriwulan === "2"
          ? "a.triwulan='2'"
          : namaTriwulan === "3"
            ? "a.triwulan='3'"
            : "a.triwulan='4'";
    const thangFilter =
      namaThang === "2025" ? "a.thang='2025'" : `a.thang = '2024'`;

    const whereClause = [
      kanwilFilter,
      prokerFilter,
      thangFilter,
      triwulanFilter,
    ]
      .filter(Boolean)
      .concat(
        searchQuery
          ? [
            `(a.kdkanwil LIKE '%${searchQuery}%' or
            b.nmkanwil LIKE '%${searchQuery}%' or
            a.proker LIKE '%${searchQuery}%')`,
          ]
          : []
      )
      .concat(
        role === "2" ? [`a.kdkanwil = '${kdkanwil}'`] : [] // Add this condition
      )
      .join(" AND ");

    let queryunduh;
    if (namaThang === "2025") {
      queryunduh = `SELECT a.id,a.thang,a.triwulan,a.kdkanwil,b.nmkanwil,a.proker,a.ket1_kl as ket_penganggaran_kl, a.ket2_kl as ket_pbj_kl, a.ket3_kl as ket_eksekusi_kl, a.ket4_kl as ket_regulasi_kl, a.ket5_kl as ket_sdm_kl, a.ket6_kl as ket_lainnya_kl, a.ket7_tkd as ket_penganggaran_tkd, a.ket8_tkd as ket_pbj_tkd, a.ket9_tkd as ket_eksekusi_tkd, a.ket10_tkd as ket_regulasi_tkd, a.ket11_tkd as ket_sdm_tkd, a.ket12_tkd as ket_lainnya_tkd, 
      a.rekom1_kl as rekom_penganggaran_kl, a.rekom2_kl as rekom_pbj_kl, a.rekom3_kl as rekom_eksekusi_kl, a.rekom4_kl as rekom_regulasi_kl, a.rekom5_kl as rekom_sdm_kl, a.rekom6_kl as rekom_lainnya_kl, a.rekom7_tkd as rekom_penganggaran_tkd, a.rekom8_tkd as rekom_pbj_tkd, a.rekom9_tkd as rekom_eksekusi_tkd, a.rekom10_tkd as rekom_regulasi_tkd, a.rekom11_tkd as rekom_sdm_tkd, a.rekom12_tkd as rekom_lainnya_tkd FROM laporan_2023.permasalahan_inflasi a
      LEFT JOIN dbref.t_kanwil_2025 b ON a.kdkanwil=b.kdkanwil
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ORDER BY kdkanwil ASC`;
    } else if (namaThang === "2024") {
      queryunduh = `SELECT a.id,a.thang,a.triwulan,a.kdkanwil,b.nmkanwil,a.proker,a.ket1_kl as ket_penganggaran_kl, a.ket2_kl as ket_pbj_kl, a.ket3_kl as ket_eksekusi_kl, a.ket4_kl as ket_regulasi_kl, a.ket5_kl as ket_sdm_kl, a.ket6_kl as ket_lainnya_kl, a.ket7_tkd as ket_penganggaran_tkd, a.ket8_tkd as ket_pbj_tkd, a.ket9_tkd as ket_eksekusi_tkd, a.ket10_tkd as ket_regulasi_tkd, a.ket11_tkd as ket_sdm_tkd, a.ket12_tkd as ket_lainnya_tkd, 
      a.rekom1_kl as rekom_penganggaran_kl, a.rekom2_kl as rekom_pbj_kl, a.rekom3_kl as rekom_eksekusi_kl, a.rekom4_kl as rekom_regulasi_kl, a.rekom5_kl as rekom_sdm_kl, a.rekom6_kl as rekom_lainnya_kl, a.rekom7_tkd as rekom_penganggaran_tkd, a.rekom8_tkd as rekom_pbj_tkd, a.rekom9_tkd as rekom_eksekusi_tkd, a.rekom10_tkd as rekom_regulasi_tkd, a.rekom11_tkd as rekom_sdm_tkd, a.rekom12_tkd as rekom_lainnya_tkd FROM laporan_2023.permasalahan_inflasi a
      LEFT JOIN dbref.t_kanwil_2024 b ON a.kdkanwil=b.kdkanwil
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ORDER BY kdkanwil ASC`;
    } else {
      // Jika tahun anggaran tidak valid
      throw new Error("Tahun anggaran tidak valid");
    }

    const encodedQueryunduh = encodeURIComponent(queryunduh);

    const cleanedQueryunduh = decodeURIComponent(encodedQueryunduh)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setSqlunduh(cleanedQueryunduh);

    let query;
    if (namaThang === "2025") {
      query = `SELECT a.id,a.thang,a.triwulan,a.kdkanwil,b.nmkanwil,a.proker,a.ket1_kl, a.ket2_kl, a.ket3_kl, a.ket4_kl, a.ket5_kl, a.ket6_kl, a.ket7_tkd, a.ket8_tkd, a.ket9_tkd, a.ket10_tkd, a.ket11_tkd, a.ket12_tkd, 
      a.rekom1_kl, a.rekom2_kl, a.rekom3_kl, a.rekom4_kl, a.rekom5_kl, a.rekom6_kl, a.rekom7_tkd, a.rekom8_tkd, a.rekom9_tkd, a.rekom10_tkd, a.rekom11_tkd, a.rekom12_tkd FROM laporan_2023.permasalahan_inflasi a
      LEFT JOIN dbref.t_kanwil_2025 b ON a.kdkanwil=b.kdkanwil
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ORDER BY kdkanwil ASC`;
    } else if (namaThang === "2024") {
      query = `SELECT a.id,a.thang,a.triwulan,a.kdkanwil,b.nmkanwil,a.proker,a.ket1_kl, a.ket2_kl, a.ket3_kl, a.ket4_kl, a.ket5_kl, a.ket6_kl, a.ket7_tkd, a.ket8_tkd, a.ket9_tkd, a.ket10_tkd, a.ket11_tkd, a.ket12_tkd, 
      a.rekom1_kl, a.rekom2_kl, a.rekom3_kl, a.rekom4_kl, a.rekom5_kl, a.rekom6_kl, a.rekom7_tkd, a.rekom8_tkd, a.rekom9_tkd, a.rekom10_tkd, a.rekom11_tkd, a.rekom12_tkd FROM laporan_2023.permasalahan_inflasi a
      LEFT JOIN dbref.t_kanwil_2024 b ON a.kdkanwil=b.kdkanwil
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ORDER BY kdkanwil ASC`;
    } else {
      // Jika tahun anggaran tidak valid
      throw new Error("Tahun anggaran tidak valid");
    }
    // console.log(query);
    const encodedQuery = encodeURIComponent(query);

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setSql(cleanedQuery);

    const encryptedQuery = Encrypt(cleanedQuery);
    // console.log(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_PERMASALAHANTPID
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_PERMASALAHANTPID
          }${encryptedQuery}&limit=${limit}&page=${page}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      setPages(response.data.totalPages);
      setRows(response.data.totalRows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
        "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };
  // console.log(data);
  const handleRekam = async (id, jenis, keterangan, rekomendasi) => {
    setShowModal(true);
    setId(id);
    setJenisCluster(jenis);
    setKeterangan(keterangan);
    setRekomendasi(rekomendasi);
    // setPilihan(pilihan);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveSuccess = async (updatedKeterangan, updatedRekomendasi) => {
    await getData();
    setKeterangan(updatedKeterangan);
    setRekomendasi(updatedRekomendasi);
    // pilihan2 && setPilihan(pilihan2);
    setShowModal(false);
  };

  const halaman = ({ selected }) => {
    setPage(selected);
  };
  const handleSearch = (query) => {
    setSearchQuery(query); // Step 2: Update search query state
    if (query) {
      // Reset kanwil and namaProker when search query is entered
      setKanwil("00");
      setNamaProker("00");
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
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Tantangan/ Kendala TPID</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Data</a>
            </li>
            <li className="breadcrumb-item active">Rekam</li>
          </ol>
        </nav>
      </div>
      <section className="section ">
        <h6 className=" text-center">
          Tantangan/ Kendala dan Rekomendasi TPID pada Belanja K/L dan TKD (
          {namaThang === "2024" && namaTriwulan === "1"
            ? "Triwulan I 2024"
            : namaThang === "2024" && namaTriwulan === "2"
              ? "Triwulan II 2024"
              : namaThang === "2024" && namaTriwulan === "3"
                ? "Triwulan III 2024"
                : namaThang === "2024" && namaTriwulan === "4"
                  ? "Triwulan IV 2024"
                  : namaThang === "2025" && namaTriwulan === "1"
                    ? "Triwulan I 2025"
                    : namaThang === "2025" && namaTriwulan === "2"
                      ? "Triwulan II 2025"
                      : namaThang === "2025" && namaTriwulan === "3"
                        ? "Triwulan III 2025"
                        : namaThang === "2025" && namaTriwulan === "4"
                          ? "Triwulan IV 2025"
                          : ""}
          )
        </h6>

        <Form>
          <Form.Group as={Row} className="mt-0 justify-content-between">
            <Col sm="2">
              <Form.Label>Tahun</Form.Label>
              <Form.Select
                id="thang"
                value={namaThang}
                onChange={(e) => setNamaThang(e.target.value)}
              >
                {/* <option value="2023">2023</option> */}
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </Form.Select>
            </Col>{" "}
            <Col sm="2">
              <Form.Label>Triwulan</Form.Label>
              <Form.Select
                id="triwulan"
                value={namaTriwulan}
                onChange={(e) => setNamaTriwulan(e.target.value)}
              >
                <option value="1">Triwulan I</option>
                <option value="2">Triwulan II</option>
                <option value="3">Triwulan III</option>
                <option value="4">Triwulan IV</option>
              </Form.Select>
            </Col>{" "}
            <Col sm="2">
              <Form.Label>Kode Kanwil</Form.Label>
              <Kdkanwil kdkanwil={kanwil} onChange={handleKanwil} />
            </Col>{" "}
            <Col sm="2">
              <Form.Label>Nama Proker</Form.Label>
              <Form.Select
                id="namaProker"
                value={namaProker}
                onChange={(e) => setNamaProker(e.target.value)}
              >
                <option value="00">Semua Proker</option>
                <option value="K1-Keterjangkauan Harga">
                  K1-Keterjangkauan Harga
                </option>
                <option value="K2-Ketersediaan Pasokan">
                  K2-Ketersediaan Pasokan
                </option>
                <option value="K3-Kelancaran Distribusi">
                  K3-Kelancaran Distribusi
                </option>
                <option value="K4-Komunikasi Efektif">
                  K4-Komunikasi Efektif
                </option>
              </Form.Select>
            </Col>{" "}
            <Col sm="2">
              <Form.Label>Pencarian</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col sm="2">
              <div className="d-flex justify-content-end align-item-center">
                <Button
                  variant="primary"
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
            </Col>
          </Form.Group>
          {export2 && (
            <GenerateCSV
              query3={sqlunduh}
              status={handleStatus}
              namafile={`v3_CSV_PERMASALAHAN_TPID_${moment().format(
                "DDMMYY-HHmmss"
              )}`}
            />
          )}
        </Form>

        {loading ? (
          <>
            <Loading2 />
            <br />
            <Loading2 />
            <br />
            <Loading2 />
          </>
        ) : (
          <>
            <Card>
              <Card.Body className="data-max fade-in">
                <Table hover striped>
                  <thead className="is-sticky-datauser bg-secondary">
                    <tr className="text-center">
                      <th rowSpan={2} className="align-middle text-center">
                        No
                      </th>
                      <th rowSpan={2} className="align-middle text-center">
                        Proker TPID
                      </th>
                      <th colSpan={6}>
                        Tantangan/Kendala dan Rekomendasi Belanja K/L
                      </th>
                      <th colSpan={6}>
                        Tantangan/Kendala dan Rekomendasi Belanja TKD
                      </th>
                    </tr>
                    <tr>
                      <th className="align-middle text-center">Penganggaran</th>
                      <th className="align-middle text-center">
                        PBJ (K1 & K4 Tidak Diisi)
                      </th>
                      <th className="align-middle text-center">
                        Eksekusi Kegiatan
                      </th>
                      <th className="align-middle text-center">Regulasi</th>
                      <th className="align-middle text-center">SDM</th>
                      <th className="align-middle text-center">
                        Tantangan Lainnya
                      </th>
                      <th className="align-middle text-center">Penganggaran</th>
                      <th className="align-middle text-center">
                        PBJ (K1 & K4 Tidak Diisi)
                      </th>
                      <th className="align-middle text-center">
                        Eksekusi Kegiatan
                      </th>
                      <th className="align-middle text-center">Regulasi</th>
                      <th className="align-middle text-center">SDM</th>
                      <th className="align-middle text-center">
                        Tantangan Lainnya
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {data.map((row, index) => (
                      <tr key={row.id}>
                        <td className="align-middle text-center">
                          {index + 1 + page * limit}
                        </td>
                        <td className="align-middle text-start">
                          {row.nmkanwil}
                          <strong>{"    " + row.proker}</strong>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket1_kl === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom1_kl === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "1",
                                row.ket1_kl,
                                row.rekom1_kl
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square 
                            ${row.proker === "K1-Keterjangkauan Harga" ||
                                row.proker === "K4-Komunikasi Efektif"
                                ? "text-primary"
                                : (row.ket2_kl === ""
                                  ? "text-danger"
                                  : "text-success") +
                                " " +
                                (row.rekom2_kl === ""
                                  ? "text-danger"
                                  : "text-success")
                              } 
                            fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() => {
                              if (
                                row.proker !== "K1-Keterjangkauan Harga" &&
                                row.proker !== "K4-Komunikasi Efektif"
                              ) {
                                handleRekam(
                                  row.id,
                                  "2",
                                  row.ket2_kl,
                                  row.rekom2_kl
                                );
                              }
                            }}
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket3_kl === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom3_kl === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "3",
                                row.ket3_kl,
                                row.rekom3_kl
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket4_kl === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom4_kl === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "4",
                                row.ket4_kl,
                                row.rekom4_kl
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket5_kl === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom5_kl === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "5",
                                row.ket5_kl,
                                row.rekom5_kl
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket6_kl === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom6_kl === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "6",
                                row.ket6_kl,
                                row.rekom6_kl
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket7_tkd === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom7_tkd === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "7",
                                row.ket7_tkd,
                                row.rekom7_tkd
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square 
                            ${row.proker === "K1-Keterjangkauan Harga" ||
                                row.proker === "K4-Komunikasi Efektif"
                                ? "text-primary"
                                : (row.ket8_tkd === ""
                                  ? "text-danger"
                                  : "text-success") +
                                " " +
                                (row.rekom8_tkd === ""
                                  ? "text-danger"
                                  : "text-success")
                              } 
                            fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() => {
                              if (
                                row.proker !== "K1-Keterjangkauan Harga" &&
                                row.proker !== "K4-Komunikasi Efektif"
                              ) {
                                handleRekam(
                                  row.id,
                                  "8",
                                  row.ket8_tkd,
                                  row.rekom8_tkd
                                );
                              }
                            }}
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket9_tkd === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom9_tkd === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "9",
                                row.ket9_tkd,
                                row.rekom9_tkd
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket10_tkd === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom10_tkd === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "10",
                                row.ket10_tkd,
                                row.rekom10_tkd
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket11_tkd === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom11_tkd === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "11",
                                row.ket11_tkd,
                                row.rekom11_tkd
                              )
                            }
                          ></i>
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className={`bi bi-check2-square ${row.ket12_tkd === ""
                              ? "text-danger"
                              : "text-success"
                              } ${row.rekom12_tkd === ""
                                ? "text-danger"
                                : "text-success"
                              } fw-bold mx-3`}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() =>
                              handleRekam(
                                row.id,
                                "12",
                                row.ket12_tkd,
                                row.rekom12_tkd
                              )
                            }
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            {data.length > 0 && (
              <>
                <span className="pagination justify-content-between mt-2 text-dark">
                  Total : {numeral(rows).format("0,0")}, &nbsp; Hal : &nbsp;
                  {rows ? page + 1 : 0} dari {pages}
                  <nav>
                    <ReactPaginate
                      previousLabel={"← Previous"}
                      nextLabel={"Next →"}
                      breakLabel="..."
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={1}
                      pageCount={pages}
                      renderOnZeroPageCount={null}
                      containerClassName="justify-content-center pagination"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      activeClassName="active"
                      disabledClassName="disabled"
                      onPageChange={halaman}
                      initialPage={page}
                    />
                  </nav>
                </span>
              </>
            )}
            <Rekam
              show={showModal}
              onHide={handleCloseModal}
              id={idCluster}
              jenis={jenisCluster}
              // pilihan={pilihan}
              keteranganpilih={keterangan}
              rekomendasipilih={rekomendasi}
              onSaveSuccess={handleSaveSuccess}
            />
          </>
        )}
      </section>
    </main>
  );
}
