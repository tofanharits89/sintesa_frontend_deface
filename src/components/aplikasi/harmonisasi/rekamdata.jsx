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
import Rekam from "./modalRekam";
import ReactPaginate from "react-paginate";
import Kdkanwil from "../../referensi/KdkanwilHarmon";
import GenerateCSV from "../CSV/generateCSV";
import moment from "moment";
import "./rekamdata.css";
import RekamUpaya from "./modalRekamUpaya";

export default function Harmonisasi() {
  const { axiosJWT, token, role, kdkanwil, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpaya, setShowModalUpaya] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [idCluster, setId] = useState(null); // Menambahkan variabel id
  const [jenisCluster, setJenisCluster] = useState(null); // Menambahkan variabel id
  const [revisi_anggaran, setRevisi_anggaran] = useState("");
  const [blokir_anggaran, setBlokir_anggaran] = useState("");
  const [automatic_adjustment, setAutomatic_adjustment] = useState("");
  const [halaman_3_dipa, setHalaman_3_dipa] = useState("");
  const [sdana_sbsn, setSdana_sbsn] = useState("");
  const [lainnya_anggaran, setLainnya_anggaran] = useState("");

  const [proses_lelang, setProses_lelang] = useState("");
  const [lelang_dini, setLelang_dini] = useState("");
  const [gagal_lelang, setGagal_lelang] = useState("");
  const [keterbatasan_penyedia, setKeterbatasan_penyedia] = useState("");
  const [tkdn, setTkdn] = useState("");
  const [ecatalog, setEcatalog] = useState("");
  const [lainnya_pbj, setLainnya_pbj] = useState("");

  const [kekurangan_prasyarat, setKekurangan_prasyarat] = useState("");
  const [prasyarat_lahan, setPrasyarat_lahan] = useState("");
  const [faktor_cuaca, setFaktor_cuaca] = useState("");
  const [kesiapan_pedum, setKesiapan_pedum] = useState("");
  const [penerimaan_bantuan, setPenerimaan_bantuan] = useState("");
  const [pembagian_bantuan, setPembagian_bantuan] = useState("");
  const [kenaikan_harga, setKenaikan_harga] = useState("");
  const [lainnya_eksekusi, setLainnya_eksekusi] = useState("");

  const [regulasi_kemenkeu, setRegulasi_kemenkeu] = useState("");
  const [regulasi_kl, setRegulasi_kl] = useState("");
  const [regulasi_pemda, setRegulasi_pemda] = useState("");
  const [lainnya_regulasi, setLainnya_regulasi] = useState("");

  const [pergantian_pejabat, setPergantian_pejabat] = useState("");
  const [kekurangan_sdm, setKekurangan_sdm] = useState("");
  const [pemahaman_aplikasi, setPemahaman_aplikasi] = useState("");
  const [lainnya_sdm, setLainnya_sdm] = useState("");

  const [kanwil, setKanwil] = useState("00");
  const [namaBidang, setNamaBidang] = useState("00");
  const [namaThang, setNamaThang] = useState("2025");
  const [namaSemester, setNamaSemester] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [sql, setSql] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);

  useEffect(() => {
    getData();
    // setSearchQuery("");
  }, [page, kanwil, namaBidang, namaThang, namaSemester, searchQuery]);

  const handleKanwil = (kanwil) => {
    setKanwil(kanwil);
  };

  const getData = async () => {
    setLoading(true);
    const kanwilFilter = kanwil === "00" ? "" : `a.kdkanwil = '${kanwil}'`;
    const bidangFilter =
      namaBidang === "00" ? "" : `a.bidang_dak = '${namaBidang}'`;
    const semesterFilter =
      namaSemester === "1" ? "a.semester='1'" : `a.semester = '2'`;
    const thangFilter =
      namaThang === "2025" ? "a.thang='2025'" : `a.thang = '2024'`;

    const whereClause = [
      kanwilFilter,
      bidangFilter,
      thangFilter,
      semesterFilter,
    ]
      .filter(Boolean)
      .concat(
        searchQuery
          ? [
            `(a.kdsatker LIKE '%${searchQuery}%'
          or a.nmsatker LIKE '%${searchQuery}%'
          or a.kdkabkota LIKE '%${searchQuery}%'
          or c.nmkabkota LIKE '%${searchQuery}%'
          or a.ursoutput LIKE '%${searchQuery}%'
          or a.jenis_tkd LIKE '%${searchQuery}%')`,
          ]
          : []
      )
      .concat(
        role === "2" ? [`a.kdkanwil = '${kdkanwil}'`] : [] // Add this condition
      )
      .join(" AND ");

    let query;
    if (namaThang === "2025" && namaSemester === "1") {
      query = `SELECT a.id,a.thang,a.semester,a.kddept, a.kdsatker, a.nmsatker, a.bidang_dak, a.jenis_tkd, a.kdkabkota,
      a.kdlokasi, c.nmkabkota, a.kdprogram, a.kdgiat, a.kdoutput, a.kdsoutput, a.ursoutput, a.sat,
      a.vol, a.pagu, a.real1, a.real2, a.real3, a.real4, a.real5, a.real6, a.realfisik1, a.realfisik2, a.realfisik3, a.realfisik4, a.realfisik5, a.realfisik6,
      CONCAT(a.kdprogram,'.',a.kdgiat,'.',a.kdoutput,'.',a.kdsoutput) AS coa, a.revisi_anggaran, a.blokir_anggaran, a.automatic_adjustment, 
      a.halaman_3_dipa, a.sdana_sbsn, a.lainnya_anggaran, a.proses_lelang, a.lelang_dini, a.gagal_lelang, a.keterbatasan_penyedia, a.tkdn, a.ecatalog, a.lainnya_pbj, a.kekurangan_prasyarat,
      a.prasyarat_lahan, a.faktor_cuaca, a.kesiapan_pedum, a.penerimaan_bantuan, a.pembagian_bantuan, a.kenaikan_harga, a.lainnya_eksekusi, a.regulasi_kemenkeu, a.regulasi_kl,
      a.regulasi_pemda, a.lainnya_regulasi, a.pergantian_pejabat, a.kekurangan_sdm, a.pemahaman_aplikasi, a.lainnya_sdm
      FROM monev2025.pagu_output_2025_new_harmonis_smt1 a
      LEFT JOIN dbref.t_lokasi_2025 b ON a.kdlokasi=b.kdlokasi
      LEFT JOIN dbref.t_kabkota_2025 c ON a.kdlokasi=c.kdlokasi AND a.kdkabkota=c.kdkabkota
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ORDER BY bidang_dak, kdlokasi ASC, pagu DESC, persen_real6 ASC`;
    } else if (namaThang === "2025" && namaSemester === "2") {
      query = `SELECT a.id,a.thang,a.semester,a.kddept, a.kdsatker, a.nmsatker, a.bidang_dak, a.jenis_tkd, a.kdkabkota,
      a.kdlokasi, c.nmkabkota, a.kdprogram, a.kdgiat, a.kdoutput, a.kdsoutput, a.ursoutput, a.sat,
      a.vol, a.pagu, a.real7, a.real8, a.real9, a.real10, a.real11, a.real12, a.realfisik7, a.realfisik8, a.realfisik9, a.realfisik10, a.realfisik11, a.realfisik12,
      CONCAT(a.kdprogram,'.',a.kdgiat,'.',a.kdoutput,'.',a.kdsoutput) AS coa, a.revisi_anggaran, a.blokir_anggaran, a.automatic_adjustment, 
      a.halaman_3_dipa, a.sdana_sbsn, a.lainnya_anggaran, a.proses_lelang, a.lelang_dini, a.gagal_lelang, a.keterbatasan_penyedia, a.tkdn, a.ecatalog, a.lainnya_pbj, a.kekurangan_prasyarat,
      a.prasyarat_lahan, a.faktor_cuaca, a.kesiapan_pedum, a.penerimaan_bantuan, a.pembagian_bantuan, a.kenaikan_harga, a.lainnya_eksekusi, a.regulasi_kemenkeu, a.regulasi_kl,
      a.regulasi_pemda, a.lainnya_regulasi, a.pergantian_pejabat, a.kekurangan_sdm, a.pemahaman_aplikasi, a.lainnya_sdm
      FROM monev2025.pagu_output_2025_new_harmonis_smt1 a
      LEFT JOIN dbref.t_lokasi_2025 b ON a.kdlokasi=b.kdlokasi
      LEFT JOIN dbref.t_kabkota_2025 c ON a.kdlokasi=c.kdlokasi AND a.kdkabkota=c.kdkabkota
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ORDER BY bidang_dak, kdlokasi ASC, pagu DESC, persen_real9 ASC`;
    } else {
      // Jika tahun anggaran tidak valid
      throw new Error("Tahun anggaran tidak valid");
    }

    const encodedQuery = encodeURIComponent(query);

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_HARMONISASI
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_HARMONISASI
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
  const handleRekam = ({
    id,
    jenis,
    revisi_anggaran = "",
    blokir_anggaran = "",
    automatic_adjustment = "",
    halaman_3_dipa = "",
    sdana_sbsn = "",
    lainnya_anggaran = "",
    proses_lelang = "",
    lelang_dini = "",
    gagal_lelang = "",
    keterbatasan_penyedia = "",
    tkdn = "",
    ecatalog = "",
    lainnya_pbj = "",
    kekurangan_prasyarat = "",
    prasyarat_lahan = "",
    faktor_cuaca = "",
    kesiapan_pedum = "",
    penerimaan_bantuan = "",
    pembagian_bantuan = "",
    kenaikan_harga = "",
    lainnya_eksekusi = "",
    regulasi_kemenkeu = "",
    regulasi_kl = "",
    regulasi_pemda = "",
    lainnya_regulasi = "",
    pergantian_pejabat = "",
    kekurangan_sdm = "",
    pemahaman_aplikasi = "",
    lainnya_sdm = ""
  }) => {
    setShowModal(true);
    setId(id);
    setJenisCluster(Number(jenis));

    // Set semua state sesuai jenis cluster
    setRevisi_anggaran(revisi_anggaran);
    setBlokir_anggaran(blokir_anggaran);
    setAutomatic_adjustment(automatic_adjustment);
    setHalaman_3_dipa(halaman_3_dipa);
    setSdana_sbsn(sdana_sbsn);
    setLainnya_anggaran(lainnya_anggaran);

    setProses_lelang(proses_lelang);
    setLelang_dini(lelang_dini);
    setGagal_lelang(gagal_lelang);
    setKeterbatasan_penyedia(keterbatasan_penyedia);
    setTkdn(tkdn);
    setEcatalog(ecatalog);
    setLainnya_pbj(lainnya_pbj);

    setKekurangan_prasyarat(kekurangan_prasyarat);
    setPrasyarat_lahan(prasyarat_lahan);
    setFaktor_cuaca(faktor_cuaca);
    setKesiapan_pedum(kesiapan_pedum);
    setPenerimaan_bantuan(penerimaan_bantuan);
    setPembagian_bantuan(pembagian_bantuan);
    setKenaikan_harga(kenaikan_harga);
    setLainnya_eksekusi(lainnya_eksekusi);

    setRegulasi_kemenkeu(regulasi_kemenkeu);
    setRegulasi_kl(regulasi_kl);
    setRegulasi_pemda(regulasi_pemda);
    setLainnya_regulasi(lainnya_regulasi);

    setPergantian_pejabat(pergantian_pejabat);
    setKekurangan_sdm(kekurangan_sdm);
    setPemahaman_aplikasi(pemahaman_aplikasi);
    setLainnya_sdm(lainnya_sdm);
  };

  const handleRekamUpaya = () => {
    setShowModalUpaya(true);
  };

  const handleCloseModalUpaya = () => {
    setShowModalUpaya(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // getData();
    setId(null);
    setJenisCluster(null);
    setRevisi_anggaran("");
    setBlokir_anggaran("");
    setAutomatic_adjustment("");
    setHalaman_3_dipa("");
    setSdana_sbsn("");
    setLainnya_anggaran("");

    setProses_lelang("");
    setLelang_dini("");
    setGagal_lelang("");
    setKeterbatasan_penyedia("");
    setTkdn("");
    setEcatalog("");
    setLainnya_pbj("");

    setKekurangan_prasyarat("");
    setPrasyarat_lahan("");
    setFaktor_cuaca("");
    setKesiapan_pedum("");
    setPenerimaan_bantuan("");
    setPembagian_bantuan("");
    setKenaikan_harga("");
    setLainnya_eksekusi("");

    setRegulasi_kemenkeu("");
    setRegulasi_kl("");
    setRegulasi_pemda("");
    setLainnya_regulasi("");

    setPergantian_pejabat("");
    setKekurangan_sdm("");
    setPemahaman_aplikasi("");
    setLainnya_sdm("");
  };

  const handleSaveSuccess = async (updatedRevisi_anggaran, updatedBlokir_anggaran, updatedAutomatic_adjustment, updatedHalaman_3_dipa, updatedSdana_sbsn, updatedLainnya_anggaran,
    updatedProses_lelang, updatedLelang_dini, updatedGagal_lelang, updatedKeterbatasan_penyedia, updatedTkdn, updatedEcatalog, updatedLainnya_pbj, updatedKekurangan_prasyarat, updatedPrasyarat_lahan, updatedFaktor_cuaca,
    updatedKesiapan_pedum, updatedPenerimaan_bantuan, updatedPembagian_bantuan, updatedKenaikan_harga, updatedLainnya_eksekusi, updatedRegulasi_kemenkeu, updatedRegulasi_kl, updatedRegulasi_pemda, updatedLainnya_regulasi,
    updatedPergantian_pejabat, updatedKekurangan_sdm, updatedPemahaman_aplikasi, updatedLainnya_sdm) => {
    handleCloseModal();
    await getData();
    // setRevisi_anggaran(updatedRevisi_anggaran);
    // setBlokir_anggaran(updatedBlokir_anggaran);
    // setAutomatic_adjustment(updatedAutomatic_adjustment);
    // setHalaman_3_dipa(updatedHalaman_3_dipa);
    // setSdana_sbsn(updatedSdana_sbsn);
    // setLainnya_anggaran(updatedLainnya_anggaran);

    // setProses_lelang(updatedProses_lelang);
    // setLelang_dini(updatedLelang_dini);
    // setGagal_lelang(updatedGagal_lelang);
    // setKeterbatasan_penyedia(updatedKeterbatasan_penyedia);
    // setTkdn(updatedTkdn);
    // setEcatalog(updatedEcatalog);
    // setLainnya_pbj(updatedLainnya_pbj);

    // setKekurangan_prasyarat(updatedKekurangan_prasyarat);
    // setPrasyarat_lahan(updatedPrasyarat_lahan);
    // setFaktor_cuaca(updatedFaktor_cuaca);
    // setKesiapan_pedum(updatedKesiapan_pedum);
    // setPenerimaan_bantuan(updatedPenerimaan_bantuan);
    // setPembagian_bantuan(updatedPembagian_bantuan);
    // setKenaikan_harga(updatedKenaikan_harga);
    // setLainnya_eksekusi(updatedLainnya_eksekusi);

    // setRegulasi_kemenkeu(updatedRegulasi_kemenkeu);
    // setRegulasi_kl(updatedRegulasi_kl);
    // setRegulasi_pemda(updatedRegulasi_pemda);
    // setLainnya_regulasi(updatedLainnya_regulasi);

    // setPergantian_pejabat(updatedPergantian_pejabat);
    // setKekurangan_sdm(updatedKekurangan_sdm);
    // setPemahaman_aplikasi(updatedPemahaman_aplikasi);
    // setLainnya_sdm(updatedLainnya_sdm);
    // setKeterangan(updatedKeterangan);
    // pilihan2 && setPilihan(pilihan2);
    setShowModal(false);
  };

  const halaman = ({ selected }) => {
    setPage(selected);
  };
  const handleSearch = (query) => {
    setSearchQuery(query); // Step 2: Update search query state
    if (query) {
      // Reset kanwil and namaBidang when search query is entered
      setKanwil("00");
      setNamaBidang("00");
    }
  };
  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
  };
  // console.log(idCluster);

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Harmonisasi Belanja K/L & TKD </h1>
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
        <h5 className=" text-center my-4 fw-bold">
          Harmonisasi Perencanaan dan Penganggaran Belanja K/L dan TKD
          (data per{" "}
          {namaThang === "2024" && namaSemester === "1"
            ? "Semester I 2024"
            : namaThang === "2024" && namaSemester === "2"
              ? "Semester II 2024"
              : namaThang === "2025" && namaSemester === "1"
                ? "Semester I 2025"
                : namaThang === "2025" && namaSemester === "2"
                  ? "Semester II 2025"
                  : ""}
          )
        </h5>
        <></>
        <Form>
          <Form.Group as={Row} className="mt-0 justify-content-between">
            <Col sm="2" className="filter-gray">
              <Form.Label>Tahun</Form.Label>
              <Form.Select
                id="thang"
                value={namaThang}
                onChange={(e) => setNamaThang(e.target.value)}
              >
                <option value="2025">2025</option>
              </Form.Select>
            </Col>

            <Col sm="2" className="filter-gray">
              <Form.Label>Semester</Form.Label>
              <Form.Select
                id="semester"
                value={namaSemester}
                onChange={(e) => setNamaSemester(e.target.value)}
              >
                <option value="1">Semester I</option>
                <option value="2">Semester II</option>
              </Form.Select>
            </Col>

            <Col sm="2" className="filter-gray">
              <Form.Label>Kode Kanwil</Form.Label>
              <Kdkanwil kdkanwil={kanwil} onChange={handleKanwil} />
            </Col>

            <Col sm="2" className="filter-gray">
              <Form.Label>Nama Bidang</Form.Label>
              <Form.Select
                id="namaBidang"
                value={namaBidang}
                onChange={(e) => setNamaBidang(e.target.value)}
              >
                <option value="00">Semua Bidang</option>
                <option value="Ketahanan Pangan">Ketahanan Pangan</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Jalan">Jalan</option>
                <option value="Sanitasi">Sanitasi</option>
                <option value="Air Minum">Air Minum</option>
                <option value="Irigasi">Irigasi</option>
                <option value="Infrastruktur">Infrastruktur</option>
                <option value="Perumahan">Perumahan</option>
                <option value="Perlindungan Perempuan dan Anak">Perlindungan Perempuan dan Anak</option>
              </Form.Select>
            </Col>

            <Col sm="2" className="filter-gray">
              <Form.Label>Pencarian</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col sm="1">
              <div className="d-flex justify-content-end align-item-center">
                <Button
                  variant="warning"
                  size="sm"
                  className="button"
                  onClick={() => handleRekamUpaya(true)}
                  style={{ padding: "5px 10px", marginTop: "35px" }}
                >
                  <i className="bi bi-pencil-square mx-1"></i>
                  Upaya
                </Button>
              </div>
            </Col>
            <Col sm="1">
              <div className="d-flex justify-content-end align-item-center">
                <Button
                  variant="secondary"
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
              query3={sql}
              status={handleStatus}
              namafile={`v3_CSV_HARMONISASI_${moment().format(
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
              <Card.Body className="data-max fade-in p-3 rounded">
                <div className="table-scroll-wrapper">
                  <Table striped bordered hover responsive className="table-rounded table-hover-shadow table-zebra">
                    <thead className="is-sticky-datauser bg-secondary">
                      <tr className="text-center">
                        <th rowSpan={2} className="align-middle text-center">
                          No
                        </th>
                        <th rowSpan={2} className="align-middle text-center">
                          Nama Satker
                        </th>
                        <th rowSpan={2} className="align-middle text-center">
                          Bidang
                        </th>
                        <th rowSpan={2} className="align-middle text-center">
                          Jenis TKD
                        </th>
                        <th rowSpan={2} className="align-middle text-center">
                          Lokasi/Kabkota
                        </th>
                        <th rowSpan={2} className="align-middle text-center">
                          COA
                        </th>
                        <th rowSpan={2} className="align-middle text-center">
                          Nama RO
                        </th>
                        <th rowSpan={2} className="align-middle text-center">
                          Satuan/Vol
                        </th>
                        <th rowSpan={2} className="align-middle text-center">
                          Pagu
                        </th>
                        <th colSpan={6}>Realisasi (Rupiah)</th>
                        <th colSpan={6}>RVRO (Volume)</th>
                        <th colSpan={5}>Cluster Tantangan/Hambatan</th>
                      </tr>
                      <tr>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Jan"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Jul"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Jan"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Jul"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Feb"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Ags"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Feb"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Ags"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Mar"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Sep"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Mar"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Sep"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Apr"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Okt"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Apr"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Okt"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Mei"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Nov"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Mei"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Nov"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Jun"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Des"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Jun"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Des"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Jan"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Jul"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Jan"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Jul"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Feb"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Ags"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Feb"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Ags"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Mar"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Sep"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Mar"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Sep"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Apr"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Okt"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Apr"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Okt"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Mei"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Nov"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Mei"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Nov"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">
                          s.d{" "}
                          {namaThang === "2024" && namaSemester === "1"
                            ? "Jun"
                            : namaThang === "2024" && namaSemester === "2"
                              ? "Des"
                              : namaThang === "2025" && namaSemester === "1"
                                ? "Jun"
                                : namaThang === "2025" && namaSemester === "2"
                                  ? "Des"
                                  : ""}
                        </th>
                        <th className="align-middle text-center">Penganggaran</th>
                        <th className="align-middle text-center">PBJ</th>
                        <th className="align-middle text-center">
                          Eksekusi Kegiatan
                        </th>
                        <th className="align-middle text-center">Regulasi</th>
                        <th className="align-middle text-center">SDM</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {data.map((row, index) => (
                        <tr key={row.id}>
                          <td className="align-middle text-center">
                            {index + 1 + page * limit}
                          </td>
                          <td className="align-middle text-center">
                            {row.nmsatker} ({row.kddept}.{row.kdsatker})
                          </td>
                          <td className="align-middle text-center">
                            {row.bidang_dak}
                          </td>
                          <td className="align-middle text-center">
                            {row.jenis_tkd}
                          </td>
                          <td className="align-middle text-center">
                            {row.kdlokasi}
                            <br />
                            {row.nmkabkota}
                          </td>
                          <td className="align-middle text-center">{row.coa}</td>
                          <td className="align-middle text-center">
                            {row.ursoutput}
                          </td>
                          <td className="align-middle text-center">
                            {row.sat}
                            <br />
                            {numeral(row.vol).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(row.pagu).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.real1 : row.real7).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.real2 : row.real8).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.real3 : row.real9).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.real4 : row.real10).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.real5 : row.real11).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.real6 : row.real12).format("0,0")}
                          </td>

                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.realfisik1 : row.realfisik7).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.realfisik2 : row.realfisik8).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.realfisik3 : row.realfisik9).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.realfisik4 : row.realfisik10).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.realfisik5 : row.realfisik11).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            {numeral(namaSemester === "1" ? row.realfisik6 : row.realfisik12).format("0,0")}
                          </td>
                          <td className="align-middle text-center">
                            <i
                              className={`bi bi-check2-square ${row.revisi_anggaran !== '' &&
                                row.blokir_anggaran !== '' &&
                                row.automatic_adjustment !== '' &&
                                row.halaman_3_dipa !== '' &&
                                row.sdana_sbsn !== '' &&
                                row.lainnya_anggaran !== ''
                                ? "text-success"
                                : "text-warning"
                                } fw-bold mx-3`}
                              style={{ cursor: "pointer", fontSize: "20px" }}
                              onClick={() =>
                                handleRekam({
                                  id: row.id,
                                  jenis: 1,
                                  revisi_anggaran: row.revisi_anggaran,
                                  blokir_anggaran: row.blokir_anggaran,
                                  automatic_adjustment: row.automatic_adjustment,
                                  halaman_3_dipa: row.halaman_3_dipa,
                                  sdana_sbsn: row.sdana_sbsn,
                                  lainnya_anggaran: row.lainnya_anggaran
                                })
                              }
                            ></i>
                          </td>
                          <td className="align-middle text-center">
                            <i
                              className={`bi bi-check2-square ${row.proses_lelang !== '' &&
                                row.lelang_dini !== '' &&
                                row.gagal_lelang !== '' &&
                                row.keterbatasan_penyedia !== '' &&
                                row.tkdn !== '' &&
                                row.ecatalog !== '' &&
                                row.lainnya_pbj !== ''
                                ? "text-success"
                                : "text-warning"
                                } fw-bold mx-3`}
                              style={{ cursor: "pointer", fontSize: "20px" }}
                              onClick={() =>
                                handleRekam(
                                  {
                                    id: row.id,
                                    jenis: 2,
                                    proses_lelang: row.proses_lelang,
                                    lelang_dini: row.lelang_dini,
                                    gagal_lelang: row.gagal_lelang,
                                    keterbatasan_penyedia: row.keterbatasan_penyedia,
                                    tkdn: row.tkdn,
                                    ecatalog: row.ecatalog,
                                    lainnya_pbj: row.lainnya_pbj
                                  }
                                )
                              }
                            ></i>
                          </td>
                          <td className="align-middle text-center">
                            <i
                              className={`bi bi-check2-square ${row.kekurangan_prasyarat !== '' &&
                                row.prasyarat_lahan !== '' &&
                                row.faktor_cuaca !== '' &&
                                row.kesiapan_pedum !== '' &&
                                row.penerimaan_bantuan !== '' &&
                                row.pembagian_bantuan !== '' &&
                                row.kenaikan_harga !== '' &&
                                row.lainnya_eksekusi !== ''
                                ? "text-success"
                                : "text-warning"
                                } fw-bold mx-3`}
                              style={{ cursor: "pointer", fontSize: "20px" }}
                              onClick={() =>
                                handleRekam({
                                  id: row.id,
                                  jenis: 3,
                                  kekurangan_prasyarat: row.kekurangan_prasyarat,
                                  prasyarat_lahan: row.prasyarat_lahan,
                                  faktor_cuaca: row.faktor_cuaca,
                                  kesiapan_pedum: row.kesiapan_pedum,
                                  penerimaan_bantuan: row.penerimaan_bantuan,
                                  pembagian_bantuan: row.pembagian_bantuan,
                                  kenaikan_harga: row.kenaikan_harga,
                                  lainnya_eksekusi: row.lainnya_eksekusi
                                })
                              }
                            ></i>
                          </td>
                          <td className="align-middle text-center">
                            <i
                              className={`bi bi-check2-square ${row.regulasi_kemenkeu !== '' &&
                                row.regulasi_kl !== '' &&
                                row.regulasi_pemda !== '' &&
                                row.lainnya_regulasi !== ''
                                ? "text-success"
                                : "text-warning"
                                } fw-bold mx-3`}
                              style={{ cursor: "pointer", fontSize: "20px" }}
                              onClick={() =>
                                handleRekam({
                                  id: row.id,
                                  jenis: 4,
                                  regulasi_kemenkeu: row.regulasi_kemenkeu,
                                  regulasi_kl: row.regulasi_kl,
                                  regulasi_pemda: row.regulasi_pemda,
                                  lainnya_regulasi: row.lainnya_regulasi
                                })
                              }
                            ></i>
                          </td>
                          <td className="align-middle text-center">
                            <i
                              className={`bi bi-check2-square ${row.pergantian_pejabat !== '' &&
                                row.kekurangan_sdm !== '' &&
                                row.pemahaman_aplikasi !== '' &&
                                row.lainnya_sdm !== ''
                                ? "text-success"
                                : "text-warning"
                                } fw-bold mx-3`}
                              style={{ cursor: "pointer", fontSize: "20px" }}
                              onClick={() =>
                                handleRekam({
                                  id: row.id,
                                  jenis: 5,
                                  pergantian_pejabat: row.pergantian_pejabat,
                                  kekurangan_sdm: row.kekurangan_sdm,
                                  pemahaman_aplikasi: row.pemahaman_aplikasi,
                                  lainnya_sdm: row.lainnya_sdm
                                })
                              }
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
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
              revisi_anggaran_isi={revisi_anggaran}
              blokir_anggaran_isi={blokir_anggaran}
              automatic_adjustment_isi={automatic_adjustment}
              halaman_3_dipa_isi={halaman_3_dipa}
              sdana_sbsn_isi={sdana_sbsn}
              lainnya_anggaran_isi={lainnya_anggaran}

              proses_lelang_isi={proses_lelang}
              lelang_dini_isi={lelang_dini}
              gagal_lelang_isi={gagal_lelang}
              keterbatasan_penyedia_isi={keterbatasan_penyedia}
              tkdn_isi={tkdn}
              ecatalog_isi={ecatalog}
              lainnya_pbj_isi={lainnya_pbj}

              kekurangan_prasyarat_isi={kekurangan_prasyarat}
              prasyarat_lahan_isi={prasyarat_lahan}
              faktor_cuaca_isi={faktor_cuaca}
              kesiapan_pedum_isi={kesiapan_pedum}
              penerimaan_bantuan_isi={penerimaan_bantuan}
              pembagian_bantuan_isi={pembagian_bantuan}
              kenaikan_harga_isi={kenaikan_harga}
              lainnya_eksekusi_isi={lainnya_eksekusi}

              regulasi_kemenkeu_isi={regulasi_kemenkeu}
              regulasi_kl_isi={regulasi_kl}
              regulasi_pemda_isi={regulasi_pemda}
              lainnya_regulasi_isi={lainnya_regulasi}

              pergantian_pejabat_isi={pergantian_pejabat}
              kekurangan_sdm_isi={kekurangan_sdm}
              pemahaman_aplikasi_isi={pemahaman_aplikasi}
              lainnya_sdm_isi={lainnya_sdm}
              onSaveSuccess={handleSaveSuccess}
            />
            <RekamUpaya
              show={showModalUpaya}
              onHide={handleCloseModalUpaya}
            />

          </>
        )}
      </section>
    </main >
  );
}