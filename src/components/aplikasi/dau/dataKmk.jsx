import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Table,
  Row,
  Col,
  Offcanvas,
  Tab,
  Nav,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import numeral from "numeral";

import { Loading2 } from "../../layout/LoadingTable";
import ReactPaginate from "react-paginate";

import RekamKMKModal from "./RekamKMKModal";
import "../dau/tkd.css";
import RekamKMKModalCabut from "./RekamKMKModalCabut";
import RekamKMKModalPotongan from "./RekamKMKModalPotongan";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";
import RekamKMKModalPenundaan from "./RekamKMKModalPenundaan";
import DataPemdaCabut from "./RekamKMKModalPemdaCabut";

import RekamKMKModalTambahPenundaan from "./RekamKMKModalTambahPenundaan";

import RekamTransaksi from "./Transaksi";
import Rekon from "./rekon";

export default function DataKmk(props) {
  const { darkMode } = props;
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [cek, setCek] = useState("0");
  const [showModalCabut, setShowModalCabut] = useState(false);
  const [showModalRekam, setShowModalRekam] = useState(false);
  const [showModalPotongan, setShowModalPotongan] = useState(false);
  const [showModalPenundaan, setShowModalPenundaan] = useState(false);
  const [showModalPemdaCabut, setShowModalPemdaCabut] = useState(false);
  const [showModalTambahPenundaan, setShowModalTambahPenundaan] =
    useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");
  const [nokmk, setNokmk] = useState("");
  const [thang, setThang] = useState("");
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [fileModalUrl, setFileModalUrl] = useState("");
  const [open, setOpen] = useState("");
  const [alias, setAlias] = useState("");

  useEffect(() => {
    getData();
  }, [page]);

  const getData = async () => {
    setLoading(true);
    let filterKanwil = "";
    if (role === "2") {
      filterKanwil =
        props.where +
        (props.where ? " AND " : "") +
        `a.kdkanwil = '${kdkanwil}'`;
    } else {
      filterKanwil = props.where;
    }

    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.thang,a.no_kmk,a.tgl_kmk,MONTH(a.tgl_kmk) bulan,a.uraian,a.filekmk,a.no_kmkcabut,a.tglcabut,a.jenis,a.kriteria,nm_kriteria,nmjenis,a.status_cabut FROM tkd.ref_kmk_dau a LEFT OUTER JOIN ( SELECT b.jenis,b.nmjenis AS nmjenis FROM tkd.ref_kmk b) b ON a.jenis=b.jenis LEFT OUTER JOIN ( SELECT c.id_kriteria,c.nm_kriteria AS nm_kriteria FROM tkd.ref_kmk_dau_kriteria c) c ON a.kriteria=c.id_kriteria	GROUP BY a.no_kmk ORDER BY a.createdAt DESC`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_DAU
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_DAU
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
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
    }
  };

  const handleRekam = async () => {
    setOpen("5");

    setShowModalRekam(true);
  };
  const handleCloseModal = () => {
    setShowModalRekam(false);
    getData();
  };
  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };
  const handleRekamCabut = async () => {
    setShowModalCabut(true);
  };
  const handleCloseCabut = () => {
    setShowModalCabut(false);
  };

  const handleFileModalOpen = (url) => {
    setFileModalUrl(url);
    setFileModalVisible(true);
  };

  const halaman = ({ selected }) => {
    setPage(selected);
  };

  const handleRekamPotongan = async (no_kmk) => {
    setShowModalPotongan(true);
    setNokmk(no_kmk);
    setOpen("3");
  };
  const handleClosePotongan = () => {
    setShowModalPotongan(false);
  };
  const handleDataPenundaan = async (no_kmk, thang, alias) => {
    setShowModalPenundaan(true);
    setNokmk(no_kmk);
    setThang(thang);
    setOpen("2");
    setAlias(alias);
  };
  const handleClosePenundaan = () => {
    setShowModalPenundaan(false);
  };

  const handleDataTambahPenundaan = async (id, thang) => {
    setShowModalTambahPenundaan(true);
    setNokmk(id);
    setThang(thang);
    setOpen("4");
  };
  const handleCloseTambahPenundaan = () => {
    setShowModalTambahPenundaan(false);
  };

  const handleHapusKMK = async (id) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";

    Swal.fire({
      title: "Konfirmasi Hapus",
      html: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      position: "top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.delete(
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC}dau/kmk/delete/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Notifikasi("Data telah dihapus.");
          getData();
        } catch (error) {
          const { status, data } = error.response || {};
          handleHttpError(
            status,
            (data && data.error) ||
              "Terjadi Permasalahan Koneksi atau Server Backend"
          );
        }
      }
    });
  };
  const handleDataPemdaCabut = async (no_kmk, thang) => {
    setShowModalPemdaCabut(true);
    setNokmk(no_kmk);
    setThang(thang);
    setOpen("1");
  };
  const handleClosePemdaCabut = () => {
    setShowModalPemdaCabut(false);
  };
  const [activeTab, setActiveTab] = useState("dataKMK");
  const handleTabSelect = (key) => {
    if (key === "dataKMK") {
      setCek("0");
      setActiveTab(key);
    } else if (key === "transaksi") {
      setCek("1");
      setOpen("7");
      setActiveTab(key);
    } else if (key === "rekon") {
      setCek("2");
      setOpen("6");
      setActiveTab(key);
    }
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Dana Alokasi Umum</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              <li className="breadcrumb-item active"> KMK</li>
            </ol>
          </nav>
        </div>
        <section className="section my-0">
          <>
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
                <Tab.Container
                  defaultActiveKey={"dataKMK"}
                  onSelect={(key) => handleTabSelect(key)}
                >
                  <Nav variant="tabs" role="tablist">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="dataKMK"
                        role="tab"
                        className={` ${
                          darkMode ? "text-secondary" : "text-success"
                        }`}
                      >
                        <i
                          className={`bi bi-layout-text-sidebar mx-2 ${
                            activeTab === "dataKMK"
                              ? darkMode
                                ? "text-success"
                                : "text-dark"
                              : ""
                          }`}
                        ></i>
                        Data KMK
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link
                        eventKey="transaksi"
                        role="tab"
                        className={` ${
                          darkMode ? "text-secondary" : "text-secondary"
                        }`}
                      >
                        <i
                          className={`bi bi-layout-text-sidebar mx-2 ${
                            activeTab === "transaksi"
                              ? darkMode
                                ? "text-secondary"
                                : "text-dark"
                              : ""
                          }`}
                        ></i>
                        Transaksi
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="rekon"
                        role="tab"
                        className={` ${
                          darkMode ? "text-secondary" : "text-primary"
                        }`}
                      >
                        <i
                          className={`bi bi-layout-text-sidebar mx-2 ${
                            activeTab === "rekon"
                              ? darkMode
                                ? "text-primary"
                                : "text-dark"
                              : ""
                          }`}
                        ></i>
                        Rekon Data
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="dataKMK">
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="primary"
                          size="sm"
                          style={{
                            fontSize: "15px",
                            width: "190px",
                            marginRight: "15px",
                          }}
                          className="my-3 btn-block "
                          onClick={() => handleRekam()}
                        >
                          <i className="bi bi-layout-text-sidebar mx-2"></i>{" "}
                          Data KMK
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          style={{ fontSize: "15px", width: "190px" }}
                          className="my-3 btn-block"
                          onClick={() => handleRekamCabut()}
                        >
                          <i className="bi bi-layout-split "></i> Pencabutan
                        </Button>
                        &nbsp;&nbsp;
                      </div>

                      <Card className="mt-3" bg="light">
                        <Card.Body className="data-max fade-in mb-3 mt-4">
                          <table className="fixhead table-striped table-hover">
                            <thead className="header">
                              <tr>
                                <th className="text-header text-center align-middle">
                                  No.
                                </th>
                                <th className="text-header text-center align-middle">
                                  Tahun
                                </th>
                                <th className="text-header text-center align-middle">
                                  Tgl/ Nomor KMK
                                </th>

                                <th className="text-header text-center align-middle">
                                  Uraian{" "}
                                </th>
                                <th className="text-header text-center align-middle">
                                  Jenis/ Kriteria
                                </th>

                                <th className="text-header text-center align-middle">
                                  File
                                </th>
                                <th className="text-header text-center align-middle">
                                  Opsi
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-center">
                              {data.map((row, index) => (
                                <tr key={index}>
                                  <td className="align-middle text-center">
                                    {index + 1 + page * limit}
                                  </td>
                                  <td className="align-middle text-center">
                                    {row.thang}
                                  </td>
                                  <td className="align-middle text-center">
                                    {row.tgl_kmk} <br /> {row.no_kmk}
                                  </td>

                                  <td className="align-middle text-center">
                                    {row.uraian}
                                  </td>
                                  <td className="align-middle text-center">
                                    {row.nmjenis} <br /> ({row.nm_kriteria})
                                  </td>

                                  <td className="align-middle text-center">
                                    {row.filekmk &&
                                    row.filekmk.includes("http") ? (
                                      <i
                                        className="bi bi-file-earmark-pdf-fill text-danger text-center align-middle"
                                        onClick={() =>
                                          handleFileModalOpen(row.filekmk)
                                        }
                                        style={{ cursor: "pointer" }}
                                      ></i>
                                    ) : (
                                      "-"
                                    )}
                                  </td>

                                  <td className="align-middle text-center">
                                    {row.jenis === "2" && (
                                      <>
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>Data Penundaan</Tooltip>
                                          }
                                        >
                                          <i
                                            className="bi bi-box-arrow-right text-success "
                                            onClick={() =>
                                              handleDataPenundaan(
                                                row.no_kmk,
                                                row.thang,
                                                row.alias
                                              )
                                            }
                                            style={{
                                              cursor: "pointer",
                                              margin: "6px",
                                            }}
                                          ></i>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>Data Pencabutan</Tooltip>
                                          }
                                        >
                                          <i
                                            className="bi bi-brightness-high-fill text-primary "
                                            onClick={() =>
                                              handleDataPemdaCabut(
                                                row.no_kmk,
                                                row.thang
                                              )
                                            }
                                            style={{
                                              cursor: "pointer",
                                              margin: "6px",
                                            }}
                                          ></i>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>Rekam Penundaan</Tooltip>
                                          }
                                        >
                                          <i
                                            className="bi bi-file-plus-fill text-danger"
                                            onClick={() =>
                                              handleDataTambahPenundaan(
                                                row.id,
                                                row.thang
                                              )
                                            }
                                            style={{
                                              cursor: "pointer",
                                              margin: "6px",
                                            }}
                                          ></i>
                                        </OverlayTrigger>
                                      </>
                                    )}
                                    {row.jenis === "1" && (
                                      <>
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>Data Potongan</Tooltip>
                                          }
                                        >
                                          <i
                                            className="bi bi-box-arrow-right text-success "
                                            onClick={() =>
                                              handleRekamPotongan(row.no_kmk)
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          ></i>
                                        </OverlayTrigger>
                                        &nbsp;&nbsp;
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>Hapus Data KMK</Tooltip>
                                          }
                                        >
                                          <i
                                            className="bi bi-trash-fill text-danger delete"
                                            onClick={() =>
                                              handleHapusKMK(row.id)
                                            }
                                            style={{ cursor: "pointer" }}
                                            aria-hidden="true"
                                          ></i>
                                        </OverlayTrigger>
                                      </>
                                    )}
                                    {row.jenis === "4" && (
                                      <>
                                        <a href="#">
                                          <i
                                            className="bi bi-box-arrow-right text-success "
                                            aria-hidden="true"
                                          ></i>
                                        </a>
                                        &nbsp;&nbsp;
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>Hapus Data KMK</Tooltip>
                                          }
                                        >
                                          <i
                                            className="bi bi-trash-fill text-danger delete"
                                            onClick={() =>
                                              handleHapusKMK(row.id)
                                            }
                                            style={{ cursor: "pointer" }}
                                            aria-hidden="true"
                                          ></i>
                                        </OverlayTrigger>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </Card.Body>
                      </Card>
                      {data.length > 0 && (
                        <>
                          <span className="pagination justify-content-between">
                            Total : {numeral(rows).format("0,0")}, &nbsp; Hal :
                            &nbsp;
                            {rows ? page + 1 : 0} dari {pages}
                            <nav>
                              <ReactPaginate
                                breakLabel="..."
                                previousLabel={<span>←</span>}
                                nextLabel={<span>→</span>}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={1}
                                pageCount={pages}
                                containerClassName="pagination"
                                pageClassName="page-item2"
                                pageLinkClassName="page-link2"
                                previousClassName="page-item2"
                                previousLinkClassName="page-link2"
                                nextClassName="page-item2"
                                nextLinkClassName="page-link2"
                                activeClassName="active"
                                disabledClassName="disabled"
                                onPageChange={handlePageChange}
                                initialPage={page}
                              />
                            </nav>
                          </span>
                        </>
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="transaksi">
                      {open === "7" && <RekamTransaksi cek2={cek} />}
                    </Tab.Pane>
                    <Tab.Pane eventKey="rekon">
                      {open === "6" && <Rekon cek2={cek} />}
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>

                {/* {export2 && <GenerateCSV query3={sql} status={handleStatus} />} */}
              </>
            )}
            {open === "1" && (
              <DataPemdaCabut
                show={showModalPemdaCabut}
                onHide={handleClosePemdaCabut}
                nokmk={nokmk}
                thang={thang}
              />
            )}
            {open === "2" && (
              <RekamKMKModalPenundaan
                show={showModalPenundaan}
                onHide={handleClosePenundaan}
                nokmk={nokmk}
                thang={thang}
                alias={alias}
              />
            )}
            {open === "3" && (
              <RekamKMKModalPotongan
                show={showModalPotongan}
                onHide={handleClosePotongan}
                nokmk={nokmk}
              />
            )}
            {open === "4" && (
              <RekamKMKModalTambahPenundaan
                show={showModalTambahPenundaan}
                onHide={handleCloseTambahPenundaan}
                id={nokmk}
              />
            )}
            {open === "5" && (
              <RekamKMKModal show={showModalRekam} onHide={handleCloseModal} />
            )}

            <RekamKMKModalCabut
              show={showModalCabut}
              onHide={handleCloseCabut}
            />

            <Modal
              show={fileModalVisible}
              onHide={() => setFileModalVisible(false)}
              backdrop="static"
              keyboard={false}
              size="xl"
              animation={false}
              fullscreen={true}
            >
              <Modal.Header closeButton>
                <Modal.Title>KMK DAU</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={{ height: "100%" }}>
                  <iframe
                    src={fileModalUrl}
                    width="100%"
                    height="100%" // Set the height to "100%" for full height
                    style={{ border: 0 }} // Remove the default border
                  />
                </div>
              </Modal.Body>
            </Modal>
          </>
        </section>
      </main>
      <div style={{ marginBottom: "50px" }}></div>
    </div>
  );
}
