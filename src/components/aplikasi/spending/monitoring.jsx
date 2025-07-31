import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Tab,
  Tabs,
  TabPane,
  TabContent,
  Nav,
  Button,
  Card,
  Table,
  Spinner,
} from "react-bootstrap";
import { Treebeard } from "react-treebeard";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import _ from "lodash";
import { Loading2 } from "../../layout/LoadingTable";
import GenerateCSV from "../CSV/generateCSV";
import numeral from "numeral";
import moment from "moment";
import MonitoringKanwil from "./monitoringKanwil";
import DetailSatker from "./detailSatker";

export default function Monitoring() {
  const { axiosJWT, token, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [data, setData] = useState([]);
  const [cek, setCek] = useState(false);
  const [export2, setExport2] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sql, setSql] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [jenis, setJenis] = useState(0);
  const [activeTab, setActiveTab] = useState(
    role && role === "2" ? "kanwil" : "pusat"
  );

  useEffect(() => {
    (role === "X" || role === "1") && getData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getData = async () => {
    let filterKanwil = "";
    if (role === "2") {
      filterKanwil = `WHERE b.kdkanwil = '${kdkanwil}' `;
    } else if (role === "X") {
      filterKanwil = `  `;
    } else if (role === "2" && kdkanwil === "11") {
      filterKanwil = `where b.kdkanwil = '11' AND a.kddekon <> '1' AND a.STATUS IN ('true', 'false')`;
    } else {
      filterKanwil = ` where b.kdkanwil = '11' AND a.kddekon = '1' AND a.STATUS IN ('true', 'false')`;
    }

    try {
      if (loading) {
        return;
      }
      setLoading(true);

      const encryptedQuery = Encrypt(
        `SELECT         a.kddept,        d.nmdept,         COUNT(DISTINCT(CASE WHEN a.STATUS = 'true' THEN a.kdsatker END)) AS sudah,        COUNT(DISTINCT(CASE WHEN a.STATUS = 'false' THEN a.kdsatker END)) AS belum,        COUNT(DISTINCT(a.kdsatker)) AS jumlahsatker, ROUND((COUNT(DISTINCT(CASE WHEN a.STATUS = 'true' THEN a.kdsatker END)) / COUNT(DISTINCT(a.kdsatker))) * 100, 0) AS persentase     FROM           spending_review.ref_satker_dipa_2025 a     LEFT JOIN          dbref.t_dept_2025 d ON  a.kddept = d.kddept     LEFT JOIN         dbref.t_kppn_2025 b ON a.kdkppn = b.kdkppn   ${filterKanwil} GROUP BY  a.kddept`
      );
      setSql(
        `SELECT         a.kddept,        d.nmdept,         COUNT(DISTINCT(CASE WHEN a.STATUS = 'true' THEN a.kdsatker END)) AS sudah,        COUNT(DISTINCT(CASE WHEN a.STATUS = 'false' THEN a.kdsatker END)) AS belum,        COUNT(DISTINCT(a.kdsatker)) AS jumlahsatker, ROUND((COUNT(DISTINCT(CASE WHEN a.STATUS = 'true' THEN a.kdsatker END)) / COUNT(DISTINCT(a.kdsatker))) * 100, 0) AS persentase     FROM           spending_review.ref_satker_dipa_2025 a     LEFT JOIN          dbref.t_dept_2025 d ON  a.kddept = d.kddept     LEFT JOIN         dbref.t_kppn_2025 b ON a.kdkppn = b.kdkppn   ${filterKanwil} GROUP BY  a.kddept`
      );
      // console.log(sql);
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.result);
    } catch (error) {
      console.log(error);
      handleHttpError(
        error.response?.status,
        (error.response?.data && error.response.data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };
  // console.log(sql);
  const handleCek = () => {
    setCek(true);
  };
  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
  };

  const handleModalOpen = (row, params) => {
    setIsModalOpen(true);
    setSelectedRow(row);
    params === 1 ? setJenis(1) : setJenis(2);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Monitoring SR </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              <li className="breadcrumb-item active">Monitoring</li>
            </ol>
          </nav>
        </div>
        <section className="section profile fade-in ">
          <Tab.Container
            defaultActiveKey={role === "X" || role === "1" ? "pusat" : "kanwil"}
            onSelect={(tab) => handleTabChange(tab)}
          >
            <Nav
              variant="tabs"
              className="nav-tabs-bordered sticky-user is-sticky-user mb-3 bg-white"
              role="tablist"
            >
              {(role === "X" || role === "1") && (
                <Nav.Item className="spending">
                  <Nav.Link eventKey="pusat" role="tab">
                    Kantor Pusat
                  </Nav.Link>
                </Nav.Item>
              )}
              {(role === "X" || role === "1" || role === "2") && (
                <Nav.Item>
                  <Nav.Link eventKey="kanwil" role="tab" onClick={handleCek}>
                    Kanwil
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            <Tab.Content>
              <Tab.Pane
                eventKey={(role === "X" || role === "1") && "pusat"}
                role="tabpanel"
              >
                {loading ? (
                  <div className="mt-3">
                    <Loading2 />
                    <br />
                    <Loading2 />
                    <br />
                    <Loading2 />
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-end align-item-center">
                      <Button
                        variant="danger"
                        size="sm"
                        className="my-2 "
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
                              <th
                                className="text-header text-center"
                                style={{ width: "10px" }}
                              >
                                No.
                              </th>
                              <th
                                className="text-header text-center"
                                style={{ width: "40px" }}
                              >
                                Kementerian
                              </th>
                              <th
                                className="text-header text-center"
                                style={{ width: "40px" }}
                              >
                                Sudah SR
                              </th>
                              <th
                                className="text-header text-center"
                                style={{ width: "40px" }}
                              >
                                Belum SR
                              </th>
                              <th
                                className="text-header text-center"
                                style={{ width: "40px" }}
                              >
                                Total Satker
                              </th>

                              <th
                                className="text-header text-center"
                                style={{ width: "40px" }}
                              >
                                Persentase
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
                                  {row.nmdept} ({row.kddept})
                                </td>
                                <td
                                  onClick={() => handleModalOpen(row.kddept, 2)}
                                  className="text-end bg-light"
                                >
                                  <Card.Link href="#">
                                    <strong>
                                      {numeral(row.sudah).format("0,0")}
                                    </strong>
                                  </Card.Link>
                                </td>
                                <td
                                  onClick={() => handleModalOpen(row.kddept, 1)}
                                  className="text-end bg-light"
                                >
                                  <Card.Link href="#">
                                    <strong>
                                      {numeral(row.belum).format("0,0")}
                                    </strong>
                                  </Card.Link>
                                </td>
                                <td className="align-middle text-end">
                                  {numeral(row.jumlahsatker).format("0,0")}
                                </td>
                                <td className="align-middle text-end">
                                  {row.persentase}%
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
                        namafile={`v3_CSV_SR_PUSAT_${moment().format(
                          "DDMMYY-HHmmss"
                        )}`}
                      />
                    )}
                  </>
                )}{" "}
              </Tab.Pane>
              <Tab.Pane eventKey="kanwil" role="tabpanel">
                {activeTab === "kanwil" && <MonitoringKanwil />}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>
        {isModalOpen && (
          <DetailSatker
            isModalOpen={isModalOpen}
            handleModalClose={handleModalClose}
            kddept={selectedRow}
            jenis={jenis}
          />
        )}
      </main>
    </div>
  );
}
