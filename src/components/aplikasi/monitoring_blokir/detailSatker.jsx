import React, { useState, useContext, useEffect } from "react";
import numeral from "numeral";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
  Table,
} from "react-bootstrap";
import GenerateCSV from "../CSV/generateCSV";
import InfiniteScroll from "react-infinite-scroll-component";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import moment from "moment";
import { LoadingChart } from "../../layout/LoadingTable";

export default function DetailSatkerBlokir({
  isModalOpen,
  handleModalClose,
  kddept,
  kdunit,
  jenis,
}) {
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, kdlokasi, role, kdkanwil } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [export2, setExport2] = useState(false);
  const [sql, setSql] = useState("");
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); // State for download button

  // console.log(kddept, kdunit);

  useEffect(() => {
    getData();
  }, [isModalOpen]);

  const getData = async () => {
    let limitakses = "";
    if (role === "X" || role === "1" || role === "0") {
      limitakses = " ";
    } else if (role === "2" && kdkanwil !== "11") {
      limitakses = " and c.kdkanwil= '" + kdkanwil + "'  ";
    } else if (role === "2" && kdkanwil === "11") {
      limitakses = " and c.kdkanwil='11'  and a.kddekon<>'1' ";
    }

    const encodedQuery2 = encodeURIComponent(
      `SELECT b.kddept, d.nmdept, a.kdsatker, c.nmsatker, SUM(a.total) as nilai_blokir,(CASE WHEN a.total <= '0' THEN 'Belum Revisi' WHEN a.total > '0' THEN 'Sudah Revisi' END) AS status_revisi FROM laporan_2023.blokir_perjadin_satker a LEFT JOIN laporan_2023.target_blokir_perjadin b ON a.kddept = b.kddept and a.kdunit = b.kdunit LEFT JOIN dbref.t_satker_2024 c ON a.kddept = c.kddept and a.kdunit = c.kdunit and a.kdsatker = c.kdsatker LEFT JOIN dbref.t_dept_2024 d ON a.kddept = d.kddept WHERE a.kddept='${kddept}' and a.kdunit='${kdunit}' group by b.kddept, b.kdunit, a.kdsatker ORDER BY a.kddept,a.kdunit,a.kdsatker DESC`
    );

    const cleanedQuery2 = decodeURIComponent(encodedQuery2)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery2);
    const encryptedQuery = Encrypt(cleanedQuery2);

    try {
      setLoading(true);
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_MONITORINGBLOKIRSATKER
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_MONITORINGBLOKIRSATKER
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prevData) => [...prevData, ...response.data.result]);
      setOffset((prevOffset) => prevOffset + 30);

      if (response.data.result.length < 30) {
        setLoading(true);
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }
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

  // Handle CSV download
  const handleDownloadCSV = (status) => {
    setIsDownloading(true); // Start the download
    setExport2(true);
    setSql(sql);
    setIsDownloading(false); // Stop the download after it's triggered
  };

  // const handleStatus = (status, total) => {
  //     setLoadingStatus(status);
  //     setExport2(status);

  //     if (total === 0) {
  //       setLoadingStatus(false);
  //     }
  //   };

  return (
    <Modal
      show={isModalOpen}
      onHide={handleModalClose}
      fullscreen={false}
      size="xl"
      animation={false}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h6>
            <i className="bi bi-briefcase-fill mx-2 text-success"></i>
            Satker yang Sudah dan Belum Revisi Blokir
          </h6>
        </Modal.Title>
      </Modal.Header>
      <ModalBody>
        <Card className="mt-3" bg="light">
          <div id="scrollableDiv" style={{ height: "50vh", overflow: "auto" }}>
            <InfiniteScroll
              dataLength={data.length}
              next={getData}
              hasMore={hasMoreData}
              loader={<p>Loading...</p>}
              scrollableTarget="scrollableDiv"
            >
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-header text-center">No.</th>
                    <th className="text-header text-center">
                      Kementerian/ Lembaga
                    </th>
                    <th className="text-header text-center">Satker</th>
                    <th className="text-header text-center">Nilai Blokir</th>
                    <th className="text-header text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle text-center">
                        {row.nmdept} ({row.kddept})
                      </td>
                      <td className="align-middle text-center">
                        {row.nmsatker} ({row.kdsatker})
                      </td>
                      <td>{numeral(row.nilai_blokir).format("0,0")}</td>
                      <td className="align-middle text-center">
                        {row.status_revisi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </InfiniteScroll>
          </div>
        </Card>
        {export2 && (
          <GenerateCSV
            query3={sql}
            status={handleDownloadCSV}
            namafile={`v3_CSV_MONITORING_BLOKIR_${moment().format("DDMMYY-HHmmss")}`}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleDownloadCSV}
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download CSV"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
