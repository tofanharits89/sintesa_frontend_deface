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
import DetailSatkerKanwil from "./detailSatkerKanwil";

export default function MonitoringKanwil() {
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

  useEffect(() => {
    getData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getData = async () => {
    let filterKanwil = "";
    if (role === "X") {
      filterKanwil = `  `;
    } else if (role === "2" && kdkanwil !== "11") {
      filterKanwil = " and b.kdkanwil= '" + kdkanwil + "'";
    } else if (role === "2" && kdkanwil === "11") {
      filterKanwil = " and a.kddekon<>'1' and b.kdkanwil='11'";
    } else {
      filterKanwil = ` `;
    }
    try {
      if (loading) {
        return;
      }
      setLoading(true);

      const encryptedQuery = Encrypt(
        `SELECT        a.kddept,        b.kdkanwil,        c.nmkanwil,        COUNT(DISTINCT CASE WHEN a.STATUS = 'true' THEN a.kdsatker END) AS sudah,        COUNT(DISTINCT(a.kdsatker)) - COUNT(DISTINCT CASE WHEN a.STATUS = 'true' THEN a.kdsatker END) AS belum,        COUNT(DISTINCT(a.kdsatker)) AS jumlahsatker,        ROUND((COUNT(DISTINCT CASE WHEN a.STATUS = 'true' THEN a.kdsatker END) / COUNT(DISTINCT(a.kdsatker))) * 100) AS persentase    FROM        spending_review.ref_satker_dipa_2024 a    LEFT JOIN        dbref.t_kppn_2024 b ON a.kdkppn = b.kdkppn    INNER JOIN        dbref.t_kanwil_2014 c ON b.kdkanwil = c.kdkanwil ${filterKanwil}    GROUP BY  c.kdkanwil`
      );

      setSql(
        `SELECT        a.kddept,        b.kdkanwil,        c.nmkanwil,        COUNT(DISTINCT CASE WHEN a.STATUS = 'true' THEN a.kdsatker END) AS sudah,        COUNT(DISTINCT(a.kdsatker)) - COUNT(DISTINCT CASE WHEN a.STATUS = 'true' THEN a.kdsatker END) AS belum,        COUNT(DISTINCT(a.kdsatker)) AS jumlahsatker,        ROUND((COUNT(DISTINCT CASE WHEN a.STATUS = 'true' THEN a.kdsatker END) / COUNT(DISTINCT(a.kdsatker))) * 100) AS persentase    FROM        spending_review.ref_satker_dipa_2024 a    LEFT JOIN        dbref.t_kppn_2024 b ON a.kdkppn = b.kdkppn    INNER JOIN        dbref.t_kanwil_2014 c ON b.kdkanwil = c.kdkanwil ${filterKanwil}    GROUP BY  c.kdkanwil`
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
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-header text-center">No.</th>
                    <th className="text-header text-center">Provinsi</th>
                    <th className="text-header text-center">Sudah SR</th>
                    <th className="text-header text-center">Belum SR</th>
                    <th className="text-header text-center">Total Satker</th>

                    <th className="text-header text-center">Persentase</th>
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
                        {row.nmkanwil} ({row.kdkanwil})
                      </td>
                      <td
                        onClick={() => handleModalOpen(row.kdkanwil, 2)}
                        className="text-end bg-light"
                      >
                        <Card.Link href="#">
                          <strong>{numeral(row.sudah).format("0,0")}</strong>
                        </Card.Link>
                      </td>
                      <td
                        onClick={() => handleModalOpen(row.kdkanwil, 1)}
                        className="text-end bg-light"
                      >
                        <Card.Link href="#">
                          <strong>{numeral(row.belum).format("0,0")}</strong>
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
            </>
          )}
        </Card.Body>
      </Card>
      {export2 && (
        <GenerateCSV
          query3={sql}
          status={handleStatus}
          namafile={`v3_CSV_SR_KANWIL_${moment().format("DDMMYY-HHmmss")}`}
        />
      )}
      {isModalOpen && (
        <DetailSatkerKanwil
          isModalOpen={isModalOpen}
          handleModalClose={handleModalClose}
          kddept={selectedRow}
          jenis={jenis}
        />
      )}
    </>
  );
}
