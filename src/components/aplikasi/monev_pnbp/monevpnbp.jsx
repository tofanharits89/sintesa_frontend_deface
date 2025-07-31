import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Loading2 } from "../../layout/LoadingTable";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { Button, Table, Tab, Nav, Spinner, Card, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import GenerateCSV from "../CSV/generateCSV";
import Rekam2 from "./modalRekam2";
import Notifikasi from "../notifikasi/notif";
import Swal from "sweetalert2";
import FilterData from "./filterData";
import moment from "moment";
import Rekam from "./modalRekam";
import RekamanNotaDinas from "./monitoringND";
import RekamanTantangan from "./modalTantangan";
import RekamKesimpulan from "./modalRekamKesimpulan";

export default function MonevPnbp() {
  const { axiosJWT, token, role, kdkanwil, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [jenisCluster, setJenisCluster] = useState(null); // Menambahkan variabel id
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalRekam, setShowModalRekam] = useState(false);
  const [showRekaman, setShowRekaman] = useState(false);
  const [showTantangan, setShowTantangan] = useState(false);
  const [showModalKesimpulan, setShowModalKesimpulan] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");
  const [kdsatker, setKdsatker] = useState("");
  const [nmsatker, setNmsatker] = useState("");
  const [nmmppnbp, setNmmppnbp] = useState("");
  const [cek, setCek] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [where, setWhere] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);
  const [open, setOpen] = useState(false);
  const [tahun, setTahun] = useState("");
  const [triwulan, setTriwulan] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [no_surat, setNosurat] = useState("");
  const [tgl_surat, setTglsurat] = useState("");
  const [laporan, setLaporan] = useState(null);
  const [file_surat, setFilesurat] = useState(null);
  // const [nomor_nd, setNomornd] = useState("");
  // const [tgl_nd, setTglnd] = useState("");
  const [nd_kanwil, setNdkanwil] = useState(null);

  const [kesesuaian_pnbp, setKesesuaian_pnbp] = useState("");
  const [ketepatan_waktu, setKetepatan_waktu] = useState("");
  const [surat_dispensasi, setSurat_dispensasi] = useState("");
  const [kesesuaian_tarif, setKesesuaian_tarif] = useState("");
  const [tambahan_kepatuhan, setTambahan_kepatuhan] = useState("");

  const [kesesuaian_kas, setKesesuaian_kas] = useState("");
  const [kesesuaian_nomor, setKesesuaian_nomor] = useState("");
  const [ketepatan_lpj, setKetepatan_lpj] = useState("");
  const [kepatuhan_saldo, setKepatuhan_saldo] = useState("");
  const [kesesuaian_transaksi, setKesesuaian_transaksi] = useState("");
  const [tambahan_pelaporan, setTambahan_pelaporan] = useState("");

  const [tren_belanja, setTren_belanja] = useState("");
  const [masalah_penganggaran, setMasalah_penganggaran] = useState("");
  const [masalah_kegiatan, setMasalah_kegiatan] = useState("");
  const [masalah_regulasi, setMasalah_regulasi] = useState("");
  const [masalah_mp, setMasalah_mp] = useState("");
  const [kesesuaian_real_rpd, setKesesuaian_real_rpd] = useState("");
  const [kendala_belanja_lainnya, setKendala_belanja_lainnya] = useState("");

  const [kendala_internal, setKendala_internal] = useState("");
  const [kendala_eksternal, setKendala_eksternal] = useState("");
  const [kendala_jaringan_app, setKendala_jaringan_app] = useState("");
  const [kendala_lokasi, setKendala_lokasi] = useState("");
  const [kesesuaian_pnbp_target, setKesesuaian_pnbp_target] = useState("");
  const [kendala_penerimaan_lainnya, setKendala_penerimaan_lainnya] = useState("");

  const [rekomendasi, setRekomendasi] = useState("");

  const [error2, setError2] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    selectedKementerian: "00",
    selectedKanwil: "00",
    selectedJenisMp: "00",
    // selectedKppn: "00",
    tahun: "",
    triwulan: "",
  });
  // console.log(filter);
  let FilterWhere = "";

  const handleFilterResult = (filterData) => {
    const {
      selectedKementerian,
      selectedKanwil,
      tahun,
      triwulan,
      selectedJenisMp,
    } = filterData;

    const addFilterClause = (filter, columnName) => {
      if (filter !== "00" && filter !== "") {
        if (FilterWhere) {
          return ` AND ${columnName} = '${filter}'`;
        } else {
          return `${columnName} = '${filter}'`;
        }
      }
      return "";
    };
    setFilter(filterData);
    // Menambahkan klausul WHERE berdasarkan pilihan filter
    const updatedFilterWhere = addFilterClause(selectedKementerian, "a.kddept");
    const updatedFilterWhere2 = addFilterClause(selectedKanwil, "a.kdkanwil");
    const updatedFilterWhere3 = addFilterClause(tahun, "a.tahun");
    const updatedFilterWhere4 = addFilterClause(triwulan, "a.triwulan");
    const updatedFilterWhere5 = addFilterClause(selectedJenisMp, "a.kdmppnbp");

    // Gabungkan klausul WHERE yang sesuai
    const whereClauses = [
      updatedFilterWhere,
      updatedFilterWhere2,
      updatedFilterWhere3,
      updatedFilterWhere4,
      updatedFilterWhere5,
    ].filter(Boolean);

    if (whereClauses.length > 0) {
      FilterWhere = "  " + whereClauses.join(" AND ");
    }

    setWhere(FilterWhere);
    handleCek();
  };

  const handleCek = () => {
    setCek(true);
  };

  useEffect(() => {
    getData();
  }, [page, where]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getData();
    }, 500); // Menunggu 500ms setelah user selesai mengetik sebelum fetch data
    return () => clearTimeout(delaySearch); // Membersihkan timeout jika user masih mengetik
  }, [searchQuery]); // Memantau perubahan `searchQuery` agar langsung diterapkan

  const getData = async () => {
    setLoading(true);

    let finalWhere = where; // Gunakan filter yang sudah diterapkan sebelumnya

    // Jika ada pencarian, tambahkan filter `nmsatker` dan `kdsatker`
    if (searchQuery.trim() !== "") {
      finalWhere +=
        (finalWhere ? " AND " : "") +
        `(
                a.nmsatker LIKE '%${searchQuery}%' 
                OR a.kdsatker LIKE '%${searchQuery}%'
            )`;
    }

    let filterKanwil = "";
    if (role === "2") {
      filterKanwil =
        finalWhere + (finalWhere ? " AND " : "") + `a.kdkanwil = '${kdkanwil}'`;
    } else {
      filterKanwil = finalWhere;
    }

    const query = `SELECT a.id, a.tahun, a.triwulan, a.kdkanwil, a.nmkanwil, a.kddept, a.kdsatker, a.nmsatker, a.target, a.setoran, a.persen_pnbp, a.mp_riil, a.pagu_belanja, a.mp_pnbp, a.kdmppnbp, b.nmmppnbp,
            a.real_belanja, a.persen_belanja, a.selisih_belanja_mp_riil, a.nd_kanwil, a.tgl_surat, a.no_surat, a.file_surat, a.ringkasan, a.laporan, a.tgl_kirim, a.tgl_upload_koord, a.kesesuaian_pnbp, a.ketepatan_waktu, a.surat_dispensasi,
            a.kesesuaian_tarif, a.tambahan_kepatuhan, a.kesesuaian_kas, a.kesesuaian_nomor, a.ketepatan_lpj, a.kepatuhan_saldo, a.kesesuaian_transaksi, a.tambahan_pelaporan, a.tren_belanja, a.masalah_penganggaran, a.masalah_kegiatan, a.masalah_regulasi,
            a.masalah_mp, a.kesesuaian_real_rpd, a.kendala_belanja_lainnya, a.kendala_internal, a.kendala_eksternal, a.kendala_jaringan_app, a.kendala_lokasi, a.kesesuaian_pnbp_target, a.kendala_penerimaan_lainnya, a.rekomendasi
  FROM laporan_2023.monev_pnbp a LEFT JOIN dbref.ref_mp_pnbp b ON a.kdmppnbp=b.kdmppnbp
  ${filterKanwil ? `WHERE ${filterKanwil}` : ""}
  ORDER BY a.tgl_kirim DESC`;

    //encoding dan cleaned query
    const encodedQuery = encodeURIComponent(query);
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const query2 = `SELECT a.id, a.tahun, a.triwulan, a.kdkanwil, a.nmkanwil, a.kddept, a.kdsatker, a.nmsatker, a.target, a.setoran, a.persen_pnbp, a.mp_riil, a.pagu_belanja, a.mp_pnbp, a.kdmppnbp, b.nmmppnbp,
            a.real_belanja, a.persen_belanja, a.selisih_belanja_mp_riil, a.nd_kanwil, a.tgl_surat, a.no_surat, a.file_surat, a.ringkasan, a.laporan, a.tgl_kirim, a.tgl_upload_koord, a.kesesuaian_pnbp, a.ketepatan_waktu, a.surat_dispensasi,
            a.kesesuaian_tarif, a.tambahan_kepatuhan, a.kesesuaian_kas, a.kesesuaian_nomor, a.ketepatan_lpj, a.kepatuhan_saldo, a.kesesuaian_transaksi, a.tambahan_pelaporan, a.tren_belanja, a.masalah_penganggaran, a.masalah_kegiatan, a.masalah_regulasi,
            a.masalah_mp, a.kesesuaian_real_rpd, a.kendala_belanja_lainnya, a.kendala_internal, a.kendala_eksternal, a.kendala_jaringan_app, a.kendala_lokasi, a.kesesuaian_pnbp_target, a.kendala_penerimaan_lainnya, a.rekomendasi
  FROM laporan_2023.monev_pnbp a LEFT JOIN dbref.ref_mp_pnbp b ON a.kdmppnbp=b.kdmppnbp
  ${filterKanwil ? `WHERE ${filterKanwil}` : ""}
  ORDER BY a.tgl_kirim DESC`;

    const encodedQuery2 = encodeURIComponent(query2);
    const cleanedQuery2 = decodeURIComponent(encodedQuery2)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery2);
    const encryptedQuery = Encrypt(cleanedQuery);
    // console.log(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TAYANGMONEVPNBP
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_TAYANGMONEVPNBP
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

  const handleRekam = async (nd_kanwil) => {
    setNdkanwil(nd_kanwil);
    setShowModal(true);
    setCek(false);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    getData();
    setCek(true);
  };

  const handleRekamMonev = async (
    id,
    nmmppnbp,
    nmsatker,
    kdsatker,
    tahun,
    triwulan,
    ringkasan,
    no_surat,
    tgl_surat,
    laporan,
    file_surat
  ) => {
    setId(id);
    setNmmppnbp(nmmppnbp);
    setNmsatker(nmsatker);
    setKdsatker(kdsatker);
    setShowModalRekam(true);
    setTahun(tahun);
    setTriwulan(triwulan);
    setRingkasan(ringkasan);
    setNosurat(no_surat);
    setTglsurat(tgl_surat);
    setLaporan(laporan);
    setFilesurat(file_surat);
  };

  const handleCloseModalMonev = () => {
    setShowModalRekam(false);
    setOpen(false);
    getData();
  };

  const handleRekamTantangan = ({
    id, jenis,
    kesesuaian_pnbp = "", ketepatan_waktu = "", surat_dispensasi = "",
    kesesuaian_tarif = "", tambahan_kepatuhan = "", kesesuaian_kas = "", kesesuaian_nomor = "", ketepatan_lpj = "", kepatuhan_saldo = "", kesesuaian_transaksi = "", tambahan_pelaporan = "", tren_belanja = "", masalah_penganggaran = "", masalah_kegiatan = "", masalah_regulasi = "",
    masalah_mp = "", kesesuaian_real_rpd = "", kendala_belanja_lainnya = "", kendala_internal = "", kendala_eksternal = "", kendala_jaringan_app = "", kendala_lokasi = "", kesesuaian_pnbp_target = "", kendala_penerimaan_lainnya = "", rekomendasi = ""
  }) => {
    setShowTantangan(true);
    setId(id);
    setJenisCluster(Number(jenis));
    // Set semua state sesuai jenis cluster
    setKesesuaian_pnbp(kesesuaian_pnbp);
    setKetepatan_waktu(ketepatan_waktu);
    setSurat_dispensasi(surat_dispensasi);
    setKesesuaian_tarif(kesesuaian_tarif);
    setTambahan_kepatuhan(tambahan_kepatuhan);
    setKesesuaian_kas(kesesuaian_kas);

    setKesesuaian_nomor(kesesuaian_nomor);
    setKetepatan_lpj(ketepatan_lpj);
    setKepatuhan_saldo(kepatuhan_saldo);
    setKesesuaian_transaksi(kesesuaian_transaksi);
    setTambahan_pelaporan(tambahan_pelaporan);
    setTren_belanja(tren_belanja);
    setMasalah_penganggaran(masalah_penganggaran);

    setMasalah_kegiatan(masalah_kegiatan);
    setMasalah_regulasi(masalah_regulasi);
    setMasalah_mp(masalah_mp);
    setKesesuaian_real_rpd(kesesuaian_real_rpd);
    setKendala_belanja_lainnya(kendala_belanja_lainnya);
    setKendala_internal(kendala_internal);
    setKendala_eksternal(kendala_eksternal);
    setKendala_jaringan_app(kendala_jaringan_app);

    setKendala_lokasi(kendala_lokasi);
    setKesesuaian_pnbp_target(kesesuaian_pnbp_target);
    setKendala_penerimaan_lainnya(kendala_penerimaan_lainnya);
    setRekomendasi(rekomendasi);
  };

  const handleCloseModalTantangan = () => {
    setShowTantangan(false);
    // setOpen(false);
    // getData();
  };

  const handleRekamKesimpulan = () => {
    setShowModalKesimpulan(true);
  };

  const handleCloseModalKesimpulan = () => {
    setShowModalKesimpulan(false);
  };

  const handleSaveSuccess = async (
    updatedRingkasan,
    updatedNosurat,
    updatedTglsurat,
    updatedLaporan,
    updatedFilesurat,
    updatedNdkanwil
  ) => {
    await getData();
    setRingkasan(updatedRingkasan);
    setNosurat(updatedNosurat);
    setTglsurat(updatedTglsurat);
    setLaporan(updatedLaporan);
    setFilesurat(updatedFilesurat);
    setNdkanwil(updatedNdkanwil);
    // pilihan2 && setPilihan(pilihan2);
    setShowModal(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query); // Perbarui state pencarian
  };

  const handledownload = async (id) => {
    const intId = parseInt(id, 10); // Pastikan ID adalah integer
    const fileUrl = `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC
      }ND_Kanwil/download/${intId}`;

    try {
      // Make the request to download the file as a blob
      const response = await axiosJWT.get(fileUrl, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Extract the filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "ND_Kanwil.pdf"; // Default filename

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      // Set the filename for download
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.remove(); // Clean up the link element

      // Revoke the object URL to free up resources
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Handle errors
      setError2("Terjadi kesalahan saat mendownload file. Silakan coba lagi.");
      Notifikasi(error2);
    }
  };

  const halaman = ({ selected }) => {
    setPage(selected);
    // setTahun("2025");
    // setTriwulan("1");
  };

  const handleFilter = () => {
    setShowModalFilter(true);
    // setTahun("2025");
    // setTriwulan("1");
  };
  const handleCloseModalFilter = () => {
    setShowModalFilter(false);
    setOpen(false);
    // getData();
  };

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
  };

  // console.log(id);
  //   console.log(kdkanwil);

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Monitoring dan Evaluasi PNBP </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              <li className="breadcrumb-item active">Monev PNBP</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <></>
          <Tab.Container defaultActiveKey="monev-pnbp">
            <Nav
              variant="tabs"
              className="nav-tabs-bordered sticky-user is-sticky-user mb-1 bg-white"
              role="tablist"
            >
              <Nav.Item className="monev-tab">
                <Nav.Link eventKey="monev-pnbp" role="tab">
                  <i className="bi bi-grid-1x2-fill text-warning fw-bold"></i>{" "}
                  Monev PNBP
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <span
                  className="d-flex mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleFilter}
                >
                  <i className="bi bi-grid-3x3-gap-fill text-primary fw-bold mx-2 "></i>{" "}
                  Filter Data
                </span>
              </Nav.Item>
              <span style={{ marginLeft: "50px" }}>
                {(filter.selectedKanwil !== "00" ||
                  filter.selectedKementerian !== "00" ||
                  filter.tahun !== "" ||
                  filter.triwulan !== "" ||
                  filter.selectedJenisMp !== "00") && (
                    <Button
                      variant="success"
                      size="sm"
                      className="my-1 mx-1 fade-in"
                    >
                      Filter Aktif
                    </Button>
                  )}
                {filter.tahun !== "" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="my-1 mx-1 fade-in"
                  >
                    Tahun {filter.tahun}
                  </Button>
                )}
                {filter.triwulan !== "" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="my-1 mx-1 fade-in"
                  >
                    Triwulan {filter.triwulan}
                  </Button>
                )}
                {filter.selectedKementerian !== "00" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="my-1 mx-1 fade-in"
                  >
                    Kementerian {filter.selectedKementerian}
                  </Button>
                )}{" "}
                {filter.selectedKanwil !== "00" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="my-1 mx-1 fade-in"
                  >
                    Kanwil {filter.selectedKanwil}
                  </Button>
                )}
                {filter.selectedJenisMp !== "00" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="my-1 mx-1 fade-in"
                  >
                    Jenis PNBP {filter.selectedJenisMp}
                  </Button>
                )}{" "}
              </span>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="monev-pnbp" role="tabpanel">
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
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        {/* <Form.Label className="mb-0">Pencarian</Form.Label> */}
                        <Form.Control
                          type="text"
                          placeholder="Cari Satker..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          style={{ minWidth: "10px" }} // Agar lebar input lebih nyaman
                        />
                      </div>
                      <div className="d-flex gap-2">
                        {(role === "X" || role === "1" || role === "0") && (
                          <Button
                            variant="warning"
                            size="sm"
                            className="my-2"
                            onClick={() => setShowRekaman(true)}
                          >
                            <i className="bi bi-journal-text mx-1"></i>
                            Monitoring ND
                          </Button>
                        )}

                        {role === "2" && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="my-2"
                            onClick={() => handleRekam()}
                          >
                            <i className="bi bi-pencil-square mx-1"></i>
                            Rekam ND Kanwil
                          </Button>
                        )}

                        <Button
                          variant="success"
                          size="sm"
                          className="my-2"
                          onClick={() => handleRekamKesimpulan()}
                        >
                          <i className="bi bi-save mx-1"></i>
                          Kesimpulan
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          className="my-2"
                          onClick={() => {
                            setLoadingStatus(true);
                            setExport2(true);
                          }}
                          disabled={loadingStatus}
                        >
                          {loadingStatus ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              Loading...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-file-earmark-excel-fill mx-1"></i>
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <Card className="mt-3" bg="light">
                      <Card.Body className="data-user fade-in ">
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th className="text-header text-center">No.</th>
                              <th className="text-header text-center">
                                Periode (Y/Q)
                              </th>
                              <th className="text-header text-center">
                                Satker
                              </th>
                              <th className="text-header text-center">
                                Target PNBP
                              </th>
                              <th className="text-header text-center">
                                Setoran PNBP
                              </th>
                              <th className="text-header text-center">
                                % Penerimaan
                              </th>
                              <th className="text-header text-center">
                                MP Riil
                              </th>
                              <th className="text-header text-center">
                                Pagu Belanja
                              </th>
                              <th className="text-header text-center">
                                MP PNBP
                              </th>
                              <th className="text-header text-center">
                                Jenis PNBP
                              </th>
                              <th className="text-header text-center">
                                Real Belanja
                              </th>
                              <th className="text-header text-center">
                                % Real Belanja
                              </th>
                              <th className="text-header text-center">
                                Selisih (Real Belanja - MP Riil)
                              </th>
                              <th className="text-header text-center">
                                Hasil Koordinasi
                              </th>
                              <th className="align-middle text-center">Kepatuhan</th>
                              <th className="align-middle text-center">Pelaporan</th>
                              <th className="align-middle text-center">
                                Pelaksanaan
                              </th>
                              <th className="align-middle text-center">Penerimaan</th>
                              <th className="align-middle text-center">Rekomendasi</th>
                              <th className="text-header text-center">
                                Tgl Kirim ND
                              </th>
                            </tr>
                          </thead>

                          <tbody className="text-center">
                            {data.map((row, index) => (
                              <tr key={index}>
                                <td className="align-middle text-center">
                                  {" "}
                                  {index + 1 + page * limit}
                                </td>
                                <td className="align-middle text-center">
                                  {row.tahun}/{row.triwulan}
                                </td>
                                <td className="align-middle text-center">
                                  {row.nmsatker} ({row.kdsatker})
                                </td>
                                <td className="align-middle text-center">
                                  {numeral(row.target).format("0,0")}
                                </td>
                                <td className="align-middle text-center">
                                  {numeral(row.setoran).format("0,0")}
                                </td>
                                <td className="align-middle text-center">
                                  {(row.persen_pnbp * 100).toFixed(2)}
                                </td>
                                <td className="align-middle text-center">
                                  {numeral(row.mp_riil).format("0,0")}
                                </td>
                                <td className="align-middle text-center">
                                  {numeral(row.pagu_belanja).format("0,0")}
                                </td>
                                <td className="align-middle text-center">
                                  {numeral(row.mp_pnbp).format("0,0")}
                                </td>
                                <td className="align-middle text-center">
                                  {row.nmmppnbp}
                                </td>
                                <td className="align-middle text-center">
                                  {numeral(row.real_belanja).format("0,0")}
                                </td>
                                <td className="align-middle text-center">
                                  {(row.persen_belanja * 100).toFixed(2)}
                                </td>
                                <td className="align-middle text-center">
                                  {numeral(row.selisih_belanja_mp_riil).format(
                                    "0,0"
                                  )}
                                </td>
                                <td className="align-middle text-center">
                                  {role !== "3" && (
                                    <i
                                      className="bi bi-plus-square-fill text-primary mx-3"
                                      onClick={() =>
                                        handleRekamMonev(
                                          row.id,
                                          row.nmmppnbp,
                                          row.nmsatker,
                                          row.kdsatker,
                                          row.tahun,
                                          row.triwulan,
                                          row.ringkasan,
                                          row.no_surat,
                                          row.tgl_surat,
                                          row.laporan,
                                          row.file_surat,
                                          row.nd_kanwil
                                        )
                                      }
                                      style={{
                                        fontSize: "17px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  )}
                                </td>
                                <td className="align-middle text-center">
                                  {/* <i
                                    className={`bi bi-check2-square ${row.kesesuaian_pnbp !== '' &&
                                      row.ketepatan_waktu !== '' &&
                                      row.surat_dispensasi !== '' &&
                                      row.kesesuaian_tarif !== '' &&
                                      row.tambahan_kepatuhan !== ''
                                      ? "text-success"
                                      : "text-warning"
                                      } fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() =>
                                      handleRekamTantangan(
                                        {
                                          id: row.id,
                                          jenis: 1,
                                          kesesuaian_pnbp: row.kesesuaian_pnbp,
                                          ketepatan_waktu: row.ketepatan_waktu,
                                          surat_dispensasi: row.surat_dispensasi,
                                          kesesuaian_tarif: row.kesesuaian_tarif,
                                          tambahan_kepatuhan: row.tambahan_kepatuhan
                                        }
                                      )
                                    }
                                    
                                  ></i> */}
                                  <i
                                    className={`bi bi-check2-square ${row.triwulan === "1" ||
                                      row.triwulan === "3"
                                      ? "text-danger"
                                      : (row.kesesuaian_pnbp !== '' &&
                                        row.ketepatan_waktu !== '' &&
                                        row.surat_dispensasi !== '' &&
                                        row.kesesuaian_tarif !== '' &&
                                        row.tambahan_kepatuhan !== ''
                                        ? "text-success"
                                        : "text-warning"
                                      )} fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() => {
                                      if (
                                        row.triwulan !== "1" &&
                                        row.triwulan !== "3"
                                      )
                                        handleRekamTantangan(
                                          {
                                            id: row.id,
                                            jenis: 1,
                                            kesesuaian_pnbp: row.kesesuaian_pnbp,
                                            ketepatan_waktu: row.ketepatan_waktu,
                                            surat_dispensasi: row.surat_dispensasi,
                                            kesesuaian_tarif: row.kesesuaian_tarif,
                                            tambahan_kepatuhan: row.tambahan_kepatuhan
                                          }
                                        )
                                    }}

                                  ></i>
                                </td>
                                <td className="align-middle text-center">
                                  {/* <i
                                    className={`bi bi-check2-square ${row.kesesuaian_kas !== '' &&
                                      row.kesesuaian_nomor !== '' &&
                                      row.ketepatan_lpj !== '' &&
                                      row.kepatuhan_saldo !== '' &&
                                      row.kesesuaian_transaksi !== '' &&
                                      row.tambahan_pelaporan !== ''
                                      ? "text-success"
                                      : "text-warning"
                                      } fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() =>
                                      handleRekamTantangan(
                                        {
                                          id: row.id,
                                          jenis: 2,
                                          kesesuaian_kas: row.kesesuaian_kas,
                                          kesesuaian_nomor: row.kesesuaian_nomor,
                                          ketepatan_lpj: row.ketepatan_lpj,
                                          kepatuhan_saldo: row.kepatuhan_saldo,
                                          kesesuaian_transaksi: row.kesesuaian_transaksi,
                                          tambahan_pelaporan: row.tambahan_pelaporan
                                        }
                                      )
                                    }
                                  ></i> */}
                                  <i
                                    className={`bi bi-check2-square ${row.triwulan === "1" ||
                                      row.triwulan === "3"
                                      ? "text-danger"
                                      : (row.kesesuaian_kas !== '' &&
                                        row.kesesuaian_nomor !== '' &&
                                        row.ketepatan_lpj !== '' &&
                                        row.kepatuhan_saldo !== '' &&
                                        row.kesesuaian_transaksi !== '' &&
                                        row.tambahan_pelaporan !== ''
                                        ? "text-success"
                                        : "text-warning"
                                      )} fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() => {
                                      if (
                                        row.triwulan !== "1" &&
                                        row.triwulan !== "3"
                                      )
                                        handleRekamTantangan(
                                          {
                                            id: row.id,
                                            jenis: 2,
                                            kesesuaian_kas: row.kesesuaian_kas,
                                            kesesuaian_nomor: row.kesesuaian_nomor,
                                            ketepatan_lpj: row.ketepatan_lpj,
                                            kepatuhan_saldo: row.kepatuhan_saldo,
                                            kesesuaian_transaksi: row.kesesuaian_transaksi,
                                            tambahan_pelaporan: row.tambahan_pelaporan
                                          }
                                        )
                                    }}

                                  ></i>
                                </td>
                                <td className="align-middle text-center">
                                  {/* <i
                                    className={`bi bi-check2-square ${row.tren_belanja !== '' &&
                                      row.masalah_penganggaran !== '' &&
                                      row.masalah_kegiatan !== '' &&
                                      row.masalah_regulasi !== '' &&
                                      row.masalah_mp !== '' &&
                                      row.kesesuaian_real_rpd !== '' &&
                                      row.kendala_belanja_lainnya !== ''
                                      ? "text-success"
                                      : "text-warning"
                                      } fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() =>
                                      handleRekamTantangan({
                                        id: row.id,
                                        jenis: 3,
                                        tren_belanja: row.tren_belanja,
                                        masalah_penganggaran: row.masalah_penganggaran,
                                        masalah_kegiatan: row.masalah_kegiatan,
                                        masalah_regulasi: row.masalah_regulasi,
                                        masalah_mp: row.masalah_mp,
                                        kesesuaian_real_rpd: row.kesesuaian_real_rpd,
                                        kendala_belanja_lainnya: row.kendala_belanja_lainnya
                                      })
                                    }
                                  ></i> */}
                                  <i
                                    className={`bi bi-check2-square ${row.triwulan === "1" ||
                                      row.triwulan === "3"
                                      ? "text-danger"
                                      : (row.tren_belanja !== '' &&
                                        row.masalah_penganggaran !== '' &&
                                        row.masalah_kegiatan !== '' &&
                                        row.masalah_regulasi !== '' &&
                                        row.masalah_mp !== '' &&
                                        row.kesesuaian_real_rpd !== '' &&
                                        row.kendala_belanja_lainnya !== ''
                                        ? "text-success"
                                        : "text-warning"
                                      )} fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() => {
                                      if (
                                        row.triwulan !== "1" &&
                                        row.triwulan !== "3"
                                      )
                                        handleRekamTantangan(
                                          {
                                            id: row.id,
                                            jenis: 3,
                                            tren_belanja: row.tren_belanja,
                                            masalah_penganggaran: row.masalah_penganggaran,
                                            masalah_kegiatan: row.masalah_kegiatan,
                                            masalah_regulasi: row.masalah_regulasi,
                                            masalah_mp: row.masalah_mp,
                                            kesesuaian_real_rpd: row.kesesuaian_real_rpd,
                                            kendala_belanja_lainnya: row.kendala_belanja_lainnya
                                          }
                                        )
                                    }}

                                  ></i>
                                </td>
                                <td className="align-middle text-center">
                                  {/* <i
                                    className={`bi bi-check2-square ${row.kendala_internal !== '' &&
                                      row.kendala_eksternal !== '' &&
                                      row.kendala_jaringan_app !== '' &&
                                      row.kendala_lokasi !== '' &&
                                      row.kesesuaian_pnbp_target !== ''
                                      ? "text-success"
                                      : "text-warning"
                                      } fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() =>
                                      handleRekamTantangan({
                                        id: row.id,
                                        jenis: 4,
                                        kendala_internal: row.kendala_internal,
                                        kendala_eksternal: row.kendala_eksternal,
                                        kendala_jaringan_app: row.kendala_jaringan_app,
                                        kendala_lokasi: row.kendala_lokasi,
                                        kesesuaian_pnbp_target: row.kesesuaian_pnbp_target
                                      })
                                    }
                                  ></i> */}
                                  <i
                                    className={`bi bi-check2-square ${row.triwulan === "1" ||
                                      row.triwulan === "3"
                                      ? "text-danger"
                                      : (row.kendala_internal !== '' &&
                                        row.kendala_eksternal !== '' &&
                                        row.kendala_jaringan_app !== '' &&
                                        row.kendala_lokasi !== '' &&
                                        row.kesesuaian_pnbp_target !== ''
                                        ? "text-success"
                                        : "text-warning"
                                      )} fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() => {
                                      if (
                                        row.triwulan !== "1" &&
                                        row.triwulan !== "3"
                                      )
                                        handleRekamTantangan(
                                          {
                                            id: row.id,
                                            jenis: 4,
                                            kendala_internal: row.kendala_internal,
                                            kendala_eksternal: row.kendala_eksternal,
                                            kendala_jaringan_app: row.kendala_jaringan_app,
                                            kendala_lokasi: row.kendala_lokasi,
                                            kesesuaian_pnbp_target: row.kesesuaian_pnbp_target
                                          }
                                        )
                                    }}

                                  ></i>
                                </td>
                                <td className="align-middle text-center">
                                  {/* <i
                                    className={`bi bi-check2-square ${row.rekomendasi !== ''
                                      ? "text-success"
                                      : "text-warning"
                                      } fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() =>
                                      handleRekamTantangan({
                                        id: row.id,
                                        jenis: 5,
                                        rekomendasi: row.rekomendasi
                                      })
                                    }
                                  ></i> */}
                                  <i
                                    className={`bi bi-check2-square ${row.triwulan === "1" ||
                                      row.triwulan === "3"
                                      ? "text-danger"
                                      : (row.rekomendasi !== ''
                                        ? "text-success"
                                        : "text-warning"
                                      )} fw-bold mx-3`}
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() => {
                                      if (
                                        row.triwulan !== "1" &&
                                        row.triwulan !== "3"
                                      )
                                        handleRekamTantangan(
                                          {
                                            id: row.id,
                                            jenis: 5,
                                            rekomendasi: row.rekomendasi
                                          }
                                        )
                                    }}

                                  ></i>
                                </td>
                                <td className="align-middle text-center">
                                  {moment(row.tgl_kirim).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                    {export2 && (
                      <GenerateCSV
                        query3={sql}
                        status={handleStatus}
                        namafile={`v3_CSV_MONEV_PNBP_${moment().format(
                          "DDMMYY-HHmmss"
                        )}`}
                      />
                    )}
                    {data.length > 0 && (
                      <>
                        <span className="pagination justify-content-between mt-2 mx-4 text-dark">
                          Total : {numeral(rows).format("0,0")}, &nbsp; Hal :
                          &nbsp;
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
                  </>
                )}{" "}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>
      </main>
      <Rekam2
        show={showModalRekam}
        onHide={handleCloseModalMonev}
        id={id}
        tahun={tahun}
        triwulan={triwulan}
        kdsatker={kdsatker}
        nmsatker={nmsatker}
        nmmppnbp={nmmppnbp}
        ringkasanpilih={ringkasan}
        laporanpilih={laporan}
        nosuratpilih={no_surat}
        tglsuratpilih={tgl_surat}
        filesuratpilih={file_surat}
        onSaveSuccess={handleSaveSuccess}
      />
      {open && (
        <Rekam
          show={showModal}
          onHide={handleCloseModal}
          tahun={tahun}
          triwulan={triwulan}
          kdkanwil={kdkanwil}
          ndkanwilpilih={nd_kanwil}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
      <FilterData
        show={showModalFilter}
        onHide={handleCloseModalFilter}
        onFilter={handleFilterResult}
      />
      <RekamanNotaDinas
        show={showRekaman}
        onHide={() => setShowRekaman(false)}
      />
      <RekamanTantangan
        show={showTantangan}
        onHide={() => setShowTantangan(false)}
        // onHide={handleCloseModalTantangan}
        id={id}
        jenis={jenisCluster}
        //Kepatuhan
        kesesuaian_pnbp_isi={kesesuaian_pnbp}
        ketepatan_waktu_isi={ketepatan_waktu}
        surat_dispensasi_isi={surat_dispensasi}
        kesesuaian_tarif_isi={kesesuaian_tarif}
        tambahan_kepatuhan_isi={tambahan_kepatuhan}
        //Pelaporan
        kesesuaian_kas_isi={kesesuaian_kas}
        kesesuaian_nomor_isi={kesesuaian_nomor}
        ketepatan_lpj_isi={ketepatan_lpj}
        kepatuhan_saldo_isi={kepatuhan_saldo}
        kesesuaian_transaksi_isi={kesesuaian_transaksi}
        tambahan_pelaporan_isi={tambahan_pelaporan}
        //Pelaksanaan
        tren_belanja_isi={tren_belanja}
        masalah_penganggaran_isi={masalah_penganggaran}
        masalah_kegiatan_isi={masalah_kegiatan}
        masalah_regulasi_isi={masalah_regulasi}
        masalah_mp_isi={masalah_mp}
        kesesuaian_real_rpd_isi={kesesuaian_real_rpd}
        kendala_belanja_lainnya_isi={kendala_belanja_lainnya}
        //Penerimaan
        kendala_internal_isi={kendala_internal}
        kendala_eksternal_isi={kendala_eksternal}
        kendala_jaringan_app_isi={kendala_jaringan_app}
        kendala_lokasi_isi={kendala_lokasi}
        kesesuaian_pnbp_target_isi={kesesuaian_pnbp_target}
        kendala_penerimaan_lainnya_isi={kendala_penerimaan_lainnya}
        //Rekomendasi
        rekomendasi_isi={rekomendasi}

        onSaveSuccess={handleSaveSuccess}
      />
      <RekamKesimpulan
        show={showModalKesimpulan}
        onHide={handleCloseModalKesimpulan}
      />{" "}
    </div>
  );
}