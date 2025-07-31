import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Loading2 } from "../../layout/LoadingTable";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { Button, Table, Tab, Nav, Spinner, Card } from "react-bootstrap";

import ReactPaginate from "react-paginate";

import GenerateCSV from "../CSV/generateCSV";
import Rekam from "./modalRekam";
import Rekam2 from "./modalRekam2";
import DataKontrak from "./datakontrak";
import DataTup from "./datatup";
import Notifikasi from "../notifikasi/notif";
import Swal from "sweetalert2";
import FilterData from "./filterData";
import Monitoring from "./monitoringdispen";
import moment from "moment";

export default function DataDispensasi() {
  const { axiosJWT, token, role, kdkanwil, kdkppn, username } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalRekam, setShowModalRekam] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");
  const [kdsatker, setKdsatker] = useState("");
  const [nmsatker, setNmsatker] = useState("");
  const [cek, setCek] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [where, setWhere] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);
  const [open, setOpen] = useState(false);
  const [tahun, setTahun] = useState("");
  const [error2, setError2] = useState(null);
  const [filter, setFilter] = useState({
    selectedKementerian: "00",
    selectedKanwil: "00",
    selectedKppn: "00",
    tahun: "",
  });
  // console.log(filter);
  let FilterWhere = "";

  const handleFilterResult = (filterData) => {
    const { selectedKementerian, selectedKanwil, selectedKppn, tahun } =
      filterData;

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
    const updatedFilterWhere3 = addFilterClause(tahun, "a.thang");
    const updatedFilterWhere4 = addFilterClause(selectedKppn, "a.kdkppn");

    // Gabungkan klausul WHERE yang sesuai
    const whereClauses = [
      updatedFilterWhere,
      updatedFilterWhere2,
      updatedFilterWhere3,
      updatedFilterWhere4,
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

  const getData = async () => {
    setLoading(true);

    let filterKanwil = "";
    if (role === "2") {
      filterKanwil =
        where + (where ? " AND " : "") + `a.kdkanwil = '${kdkanwil}'`;
    } else {
      filterKanwil = where;
    }

    let filterKppn = "";
    if (role === "3") {
      filterKppn = where + (where ? " AND " : "") + `a.kdkppn = '${kdkppn}'`;
    } else {
      filterKppn = where;
    }

    // Menggabungkan filterKanwil dan filterKppn
    let combinedFilter = filterKanwil;
    if (role === "3") {
      combinedFilter = filterKppn; // Gunakan filter KPPN jika role adalah 3
    } else if (filterKanwil && filterKppn) {
      combinedFilter = `${filterKanwil} AND ${filterKppn}`; // Jika dua filter ada, gabungkan keduanya
    }

    const encodedQuery = encodeURIComponent(
      `SELECT a.id, a.thang, a.jmlspm, a.kddept, a.kdunit, a.kdsatker, c.nmsatker, a.kdlokasi, a.kdkppn, a.tgpermohonan, a.nopermohonan, a.uraian,
  a.kd_dispensasi 
  FROM laporan_2023.dispensasi_spm a 
  LEFT JOIN dbref.t_satker_2024 c ON a.kdsatker = c.kdsatker
  ${combinedFilter ? `WHERE ${combinedFilter}` : ""}
  GROUP BY a.id ORDER BY a.id DESC`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encodedQuery2 = encodeURIComponent(
      `SELECT a.id, a.kddept, b.nmdept, a.kdunit, c.nmunit, a.kdsatker, i.nmsatker, a.kdlokasi, e.nmlokasi, a.kdkanwil, g.nmkanwil, a.kdkppn,
  h.nmkppn, a.uraian, a.tgpermohonan, a.nopermohonan, a.kd_dispensasi, zz.nm_dispensasi, a.tgpersetujuan, a.nopersetujuan, z.nospm, z.tgspm, 
  z.nilspm, z.nobast, z.tgbast, z.status
  FROM laporan_2023.dispensasi_spm a 
  LEFT JOIN laporan_2023.dispensasi_spm_lampiran z ON a.id = z.id_dispensasi
  LEFT JOIN dbref.t_dept_2024 b ON a.kddept = b.kddept 
  LEFT JOIN dbref.t_unit_2024 c ON a.kddept = c.kddept AND a.kdunit = c.kdunit 
  LEFT JOIN dbref.t_lokasi_2024 e ON a.kdlokasi = e.kdlokasi 
  LEFT JOIN dbref.t_kanwil_2014 g ON a.kdkanwil = g.kdkanwil 
  LEFT JOIN dbref.t_kppn_2024 h ON a.kdkppn = h.kdkppn 
  LEFT JOIN dbref.t_satker_2024 i ON a.kdsatker = i.kdsatker 
  LEFT JOIN laporan_2023.ref_dispensasi zz ON a.kd_dispensasi = zz.kd_dispensasi 
  ${combinedFilter ? `WHERE ${combinedFilter}` : ""}
  ORDER BY a.kddept, a.kdsatker, a.id`
    );

    const cleanedQuery2 = decodeURIComponent(encodedQuery2)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery2);
    const encryptedQuery = Encrypt(cleanedQuery);
    // console.log(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TAYANGDISPENSASI
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TAYANGDISPENSASI
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
      // console.log(error);
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const handleRekam = async () => {
    setShowModal(true);
    setCek(false);
    setOpen(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    getData();
    setCek(true);
  };

  const handleRekamSPM = async (
    id,
    nopermohonan,
    nmsatker,
    kdsatker,
    tahun
  ) => {
    setId(id);
    setNomor(nopermohonan);
    setNmsatker(nmsatker);
    setKdsatker(kdsatker);
    setShowModalRekam(true);
    setTahun(tahun);
  };
  const handleCloseModalSPM = () => {
    setShowModalRekam(false);
    setOpen(false);
    getData();
  };

  const handleHapusDispSPM = async (id, jumlah) => {
    const confirmText =
      jumlah > 0
        ? `Ada ${jumlah} SPM yang sudah direkam.<br/> Anda yakin ingin menghapus data ini ? `
        : "Anda yakin ingin menghapus data ini ?";

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
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC}dispspm/delete/${id}`,
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

  const handledownload = async (id) => {
    const intId = parseInt(id, 10); // Pastikan ID adalah integer
    const fileUrl = `${
      import.meta.env.VITE_REACT_APP_LOCAL_BASIC
    }dispen/download/${intId}`;

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
      let fileName = "Surat_Persetujuan_Dispen_SPM.pdf"; // Default filename

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
  };

  const handleFilter = () => {
    setShowModalFilter(true);
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
  // console.log(filter);
  // console.log(`ID to download: ${id}`);
  // console.log(`Type of ID received: ${typeof id}`);

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Data Dispensasi LLAT </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              <li className="breadcrumb-item active">Rekam Dispensasi</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <>
            <div className="d-flex justify-content-end text-danger">
              {role !== "3" && (
                <Button
                  variant="primary"
                  size="sm"
                  className="button  my-0"
                  style={{
                    padding: "5px 5px",
                    marginTop: "1px",
                    width: "150px",
                  }}
                  onClick={() => handleRekam()}
                >
                  Rekam Dispensasi
                </Button>
              )}{" "}
            </div>
          </>
          <Tab.Container defaultActiveKey="dispensasi-spm">
            <Nav
              variant="tabs"
              className="nav-tabs-bordered sticky-user is-sticky-user mb-1 bg-white"
              role="tablist"
            >
              <Nav.Item className="dispensasi-tab">
                <Nav.Link eventKey="dispensasi-spm" role="tab">
                  <i className="bi bi-grid-1x2-fill text-warning fw-bold"></i>{" "}
                  Dispensasi SPM
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="dispensasi-kontrak"
                  role="tab"
                  onClick={handleCek}
                >
                  <i className="bi bi-grid-fill text-success fw-bold"></i>{" "}
                  Dispensasi Kontrak
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="dispensasi-tup"
                  role="tab"
                  onClick={handleCek}
                >
                  <i className="bi bi-grid-3x3-gap-fill text-indigo fw-bold mx-2"></i>{" "}
                  Dispensasi TUP
                </Nav.Link>
              </Nav.Item>
              {(role === "X" || role === "1" || role === "2") && (
                <Nav.Item>
                  <Nav.Link
                    eventKey="monitoring-spm"
                    role="tab"
                    onClick={handleCek}
                  >
                    <i className="bi bi-layout-wtf text-success fw-bold"></i>{" "}
                    Monitoring
                  </Nav.Link>
                </Nav.Item>
              )}
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
                  filter.selectedKppn !== "00" ||
                  filter.tahun !== "") && (
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
                {filter.selectedKppn !== "00" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="my-1 mx-1 fade-in"
                  >
                    Kppn {filter.selectedKppn}
                  </Button>
                )}
              </span>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="dispensasi-spm" role="tabpanel">
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
                    <div className="d-flex justify-content-end align-item-center">
                      <Button
                        variant="danger"
                        style={{
                          padding: "5px 5px",
                          marginTop: "1px",
                          width: "150px",
                        }}
                        size="sm"
                        className="my-2 mx-1 "
                        onClick={() => {
                          setLoadingStatus(true);
                          setExport2(true);
                        }}
                        disabled={loadingStatus}
                      >
                        {loadingStatus && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        )}
                        {!loadingStatus && (
                          <i className="bi bi-file-earmark-excel-fill mx-2"></i>
                        )}
                        {loadingStatus ? " Loading..." : "Download"}
                      </Button>
                    </div>
                    <Card className="mt-3" bg="light">
                      <Card.Body className="data-user fade-in ">
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th className="text-header text-center">No.</th>
                              <th className="text-header text-center">TA</th>
                              <th className="text-header text-center">
                                Satker
                              </th>
                              <th className="text-header text-center">
                                Tgl Permohonan
                              </th>
                              <th className="text-header text-center">
                                Nomor Permohonan
                              </th>

                              <th className="text-header text-center">
                                Jumlah SPM
                              </th>
                              <th className="text-header text-center"> Opsi</th>
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
                                  {row.thang}
                                </td>
                                <td className="align-middle text-center">
                                  {row.nmsatker} ({row.kdsatker})
                                </td>
                                <td className="align-middle text-center">
                                  {row.tgpermohonan}
                                </td>
                                <td className="align-middle text-center">
                                  {row.nopermohonan}
                                </td>

                                <td className="align-middle text-center">
                                  {row.jmlspm}
                                </td>
                                <td className="align-middle text-center">
                                  {role !== "3" && (
                                    <i
                                      className="bi bi-plus-square-fill text-success mx-3"
                                      onClick={() =>
                                        handleRekamSPM(
                                          row.id,
                                          row.nopermohonan,
                                          row.nmsatker,
                                          row.kdsatker,
                                          row.thang
                                        )
                                      }
                                      style={{
                                        fontSize: "17px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  )}
                                  {role !== "3" && (
                                    <i
                                      className="bi bi-trash-fill text-danger"
                                      onClick={() =>
                                        handleHapusDispSPM(row.id, row.jmlspm)
                                      }
                                      style={{
                                        fontSize: "20px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  )}
                                  <i
                                    className="bi bi-arrow-down-circle-fill text-primary mx-2"
                                    onClick={() => handledownload(row.id)}
                                    style={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                    }}
                                  ></i>
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
                        namafile={`v3_CSV_DISPENSASI_${moment().format(
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
              <Tab.Pane eventKey="dispensasi-kontrak" role="tabpanel">
                <DataKontrak cek={cek} id={id} where={where} />
              </Tab.Pane>
              <Tab.Pane eventKey="dispensasi-tup" role="tabpanel">
                <DataTup cek={cek} id={id} where={where} />
              </Tab.Pane>
              <Tab.Pane eventKey="monitoring-spm" role="tabpanel">
                <Monitoring cek={cek} id={id} where={where} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>
      </main>
      <Rekam2
        show={showModalRekam}
        onHide={handleCloseModalSPM}
        id={id}
        tahun={tahun}
        nomor={nomor}
        kdsatker={kdsatker}
        nmsatker={nmsatker}
      />
      {open && <Rekam show={showModal} onHide={handleCloseModal} />}
      <FilterData
        show={showModalFilter}
        onHide={handleCloseModalFilter}
        onFilter={handleFilterResult}
      />{" "}
    </div>
  );
}
