import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Loading2 } from "../../layout/LoadingTable";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { Button, Table, Tab, Nav, Spinner, Card } from "react-bootstrap";

import ReactPaginate from "react-paginate";

import GenerateCSV from "../CSV/generateCSV";
import Notifikasi from "../notifikasi/notif";
import Swal from "sweetalert2";
import FilterData from "./filterData";
import moment from "moment";
import DetailSatkerBlokir from "./detailSatker";
// import RekamDispen from "./rekamDispen";
import Edit_dispen from "./Edit_dispen";

export default function MonitoringBlokir() {
  const { axiosJWT, token, role, kdkanwil, kdkppn, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModaledit, setShowModaledit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKddept, setSelectedKddept] = useState(null);
  const [selectedKdunit, setSelectedKdunit] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");
  const [cek, setCek] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [where, setWhere] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);
  const [open, setOpen] = useState(false);
  const [error2, setError2] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [totalTargetBlokir, setTotalTargetBlokir] = useState(0);
  const [totalDispenBlokir, setTotalDispenBlokir] = useState(0);
  const [totalNilaiBlokir, setTotalNilaiBlokir] = useState(0);
  const [totalSisaBlokir, setTotalSisaBlokir] = useState(0);
  const [filter, setFilter] = useState({
    selectedKementerian: "00",
  });

  // console.log(filter);
  let FilterWhere = "";

  const handleFilterResult = (filterData) => {
    const { selectedKementerian } = filterData;

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

    // Gabungkan klausul WHERE yang sesuai
    const whereClauses = [
      updatedFilterWhere,
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
  }, [page, where, refresh]);

  const getData = async () => {
    setLoading(true);

    let filterKanwil = "";
    if (role === "2") {
      filterKanwil = where + (where ? " AND " : "") + `a.kdkanwil = '${kdkanwil}'`;
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
      `SELECT a.id, a.kddept, c.nmdept, a.kdunit, d.nmunit, SUM(a.target) as target_blokir, sum(a.dispensasi_blokir) as dispensasi_blokir, SUM(a.blokir_7 + a.blokir_A) as sudah_blokir, SUM(a.target) - SUM(a.dispensasi_blokir) - SUM(a.blokir_7 + a.blokir_A) AS sisa
    FROM laporan_2023.target_blokir_perjadin a 
    LEFT JOIN dbref.t_dept_2024 c ON a.kddept = c.kddept
    LEFT JOIN dbref.t_unit_2024 d ON a.kddept = d.kddept and a.kdunit = d.kdunit
    ${combinedFilter ? `WHERE ${combinedFilter}` : ""}
    GROUP BY a.kddept, a.kdunit ORDER BY a.kddept, a.kdunit`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encodedQuery2 = encodeURIComponent(
      `SELECT a.id, a.kddept, c.nmdept, a.kdunit, d.nmunit, SUM(a.target) as target_blokir, sum(a.dispensasi_blokir) as dispensasi_blokir, SUM(a.blokir_7 + a.blokir_A) as sudah_blokir, SUM(a.target) - SUM(a.dispensasi_blokir) - SUM(a.blokir_7 + a.blokir_A) AS sisa
    FROM laporan_2023.target_blokir_perjadin a 
    LEFT JOIN dbref.t_dept_2024 c ON a.kddept = c.kddept
    LEFT JOIN dbref.t_unit_2024 d ON a.kddept = d.kddept and a.kdunit = d.kdunit
    ${combinedFilter ? `WHERE ${combinedFilter}` : ""}
    GROUP BY a.kddept, a.kdunit ORDER BY a.kddept, a.kdunit`
    );

    const cleanedQuery2 = decodeURIComponent(encodedQuery2)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery2);
    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_MONITORINGBLOKIR}${encryptedQuery}&limit=${limit}&page=${page}&user=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      setPages(response.data.totalPages);
      setRows(response.data.totalRows);
      setTotalTargetBlokir(response.data.totalTargetBlokir);  // Total Target Blokir
      setTotalDispenBlokir(response.data.totalDispenBlokir);  // Total Dispen Blokir
      setTotalNilaiBlokir(response.data.totalNilaiBlokir);  // Total Nilai Blokir
      setTotalSisaBlokir(response.data.totalSisaBlokir);  // Total Sisa Blokir
      setLoading(false);
      setIsDataFetched(true);
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

  const handleCloseModal = () => {
    setShowModal(false);
    getData();
    setCek(true);
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

  const handleModalOpen = (kddept, kdunit) => {
    setIsModalOpen(true);
    setSelectedKddept(kddept);
    setSelectedKdunit(kdunit);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditdata = async (id) => {
    setShowModaledit(true);
    setId(id);
    setCek(false);
    setOpen("2");
  };

  const handleCloseedit = () => {
    setShowModaledit(false);
    setCek(true);
    setOpen("");
    setRefresh(!refresh); // Toggle refresh state
    // setRefresh(refresh ? false : true);
  };

  // console.log(filter);
  // console.log(`ID to download: ${id}`);
  // console.log(`Type of ID received: ${typeof id}`);
  // console.log(row);

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Monitoring Blokir Perjadin </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              <li className="breadcrumb-item active">Blokir Perjadin</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <Tab.Container defaultActiveKey="monitoring-blokir">
            <Nav
              variant="tabs"
              className="nav-tabs-bordered sticky-user is-sticky-user mb-1 bg-white"
              role="tablist"
            >
              {(role === "X" ||
                role === "1" ||
                role === "0") && (
                  <Nav.Item className="monitoring-tab">
                    <Nav.Link eventKey="monitoring-blokir" role="tab">
                      <i className="bi bi-grid-1x2-fill text-warning fw-bold"></i>{" "}
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
                {(filter.selectedKementerian !== "00") && (
                  <Button
                    variant="success"
                    size="sm"
                    className="my-1 mx-1 fade-in"
                  >
                    Filter Aktif
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
              </span>

            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="monitoring-blokir" role="tabpanel">
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
                      <Card.Body className="data-user fade-in">
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>No.</th>
                              <th>Kementerian/Lembaga</th>
                              <th>Unit Eselon I</th>
                              <th>Target Blokir</th>
                              <th>Dispensasi</th>
                              <th>Sudah BLokir</th>
                              <th>Sisa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1 + page * limit}</td>
                                <td>{row.nmdept} ({row.kddept})</td>
                                <td>{row.nmunit} ({row.kdunit})</td>
                                <td style={{ textAlign: "right" }}>{numeral(row.target_blokir).format("0,0")}</td>
                                <td
                                  onClick={() => handleEditdata(row.id)}
                                  className="text-end bg-light"
                                  style={{ textAlign: "right" }}
                                >
                                  <Card.Link href="#">
                                    <strong>
                                      {numeral(row.dispensasi_blokir).format("0,0")}
                                    </strong>
                                  </Card.Link>
                                </td>
                                <td
                                  onClick={() => handleModalOpen(row.kddept, row.kdunit)}
                                  className="text-end bg-light"
                                  style={{ textAlign: "right" }}
                                >
                                  <Card.Link href="#">
                                    <strong>
                                      {numeral(row.sudah_blokir).format("0,0")}
                                    </strong>
                                  </Card.Link>
                                </td>
                                <td style={{ textAlign: "right" }}>{numeral(row.sisa).format("0,0")}</td>
                              </tr>
                            ))}
                            {/* Total Nilai Blokir dari semua halaman */}
                            <tr>
                              <td colSpan="3" style={{ fontWeight: "bold", textAlign: "right" }}><center>Total</center></td>
                              <td style={{ fontWeight: "bold", textAlign: "right" }}>{numeral(totalTargetBlokir).format("0,0")}</td>
                              <td style={{ fontWeight: "bold", textAlign: "right" }}>{numeral(totalDispenBlokir).format("0,0")}</td>
                              <td style={{ fontWeight: "bold", textAlign: "right" }}>{numeral(totalNilaiBlokir).format("0,0")}</td>
                              <td style={{ fontWeight: "bold", textAlign: "right" }}>{numeral(totalSisaBlokir).format("0,0")}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                    {export2 && (
                      <GenerateCSV
                        query3={sql}
                        status={handleStatus}
                        namafile={`v3_CSV_MONITORING_BLOKIR_${moment().format(
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
        {isModalOpen && (
          <DetailSatkerBlokir
            isModalOpen={isModalOpen}
            handleModalClose={handleModalClose}
            kddept={selectedKddept}
            kdunit={selectedKdunit}
          />
        )}
        {open === "2" && (
          <Edit_dispen
            show={showModaledit}
            cek={cek}
            onHide={handleCloseedit}
            setRefresh={setRefresh}
            // onUpdate={handleCloseedit}
            id={id}
          // kddept={selectedKddept}
          // kdunit={selectedKdunit}
          />
        )}
      </main>
      <FilterData
        show={showModalFilter}
        onHide={handleCloseModalFilter}
        onFilter={handleFilterResult}
      />{" "}
    </div>
  );
}