import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Spinner,
  Table,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import numeral from "numeral";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";
import { Loading2, TableSkeleton } from "../../layout/LoadingTable";
import ReactPaginate from "react-paginate";
import GenerateCSV from "../CSV/generateCSV";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Monitoring(props) {
  const { axiosJWT, token, username, role, kdkanwil, kdkppn } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [totalSPM, setTotalSPM] = useState(0);
  const [totalNilaiSPM, setTotalNilaiSPM] = useState(0);

  useEffect(() => {
    if (props.cek && selectedDate) {
      getData();
    }
  }, [props.cek, props.id, props.where, page, selectedDate]);

  const getData = async () => {
    setLoading(true);

    let combinedFilter = props.where || "";

    if (role === "2") {
      combinedFilter += combinedFilter
        ? ` AND a.kdkanwil = '${kdkanwil}'`
        : `a.kdkanwil = '${kdkanwil}'`;
    } else if (role === "3") {
      combinedFilter += combinedFilter
        ? ` AND a.kdkppn = '${kdkppn}'`
        : `a.kdkppn = '${kdkppn}'`;
    }

    if (selectedDate) {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      combinedFilter += combinedFilter
        ? ` AND a.tgpersetujuan = '${formattedDate}'`
        : `a.tgpersetujuan = '${formattedDate}'`;
    }

    const encodedQuery = encodeURIComponent(combinedFilter);

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    // console.log(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_MONITORINGDISPENSASI}${encryptedQuery}&limit=${limit}&page=${page}&user=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      setPages(response.data.totalPages);
      setRows(response.data.totalRows);
      setTotalSPM(response.data.totalSPM); // Total SPM dari semua halaman
      setTotalNilaiSPM(response.data.totalNilaiSPM); // Total Nilai SPM dari semua halaman
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

  const handleFilterByDate = (date) => {
    setSelectedDate(date);
    setIsDataFetched(false);
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  return (
    <Card className="p-3 mt-3" bg="light" style={{ minHeight: "700px" }}>
      {/* Filter Tanggal */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form>
          <Form.Group controlId="tanggalPersetujuan">
            <Form.Label className="fw-bold">Tanggal Persetujuan</Form.Label>
            <div className="d-flex align-items-center">
              <DatePicker
                name="tanggalPersetujuan"
                selected={selectedDate}
                onChange={(date) => handleFilterByDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih Tanggal"
                autoComplete="off"
                className="form-control"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ced4da",
                  fontSize: "14px",
                }}
              />
              <i
                className="bi bi-calendar-date text-success fw-bold ms-2"
                style={{
                  fontSize: "25px",
                  color: "#6c757d",
                }}
              />
            </div>
          </Form.Group>
        </Form>
      </div>

      {/* Konten Utama: Loading atau Table */}
      {loading ? (
        <div className="text-center">
          <Loading2 /> <br />
          <Loading2 />
        </div>
      ) : (
        <div className="fade-in">
          {isDataFetched ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ fontSize: "14px" }}>No.</th>
                  <th style={{ fontSize: "14px" }}>Kementerian/Lembaga</th>
                  <th style={{ fontSize: "14px" }}>Jumlah SPM</th>
                  <th style={{ fontSize: "14px" }}>Nilai Dispensasi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1 + page * limit}</td>
                    <td>
                      {row.nmdept} ({row.kddept})
                    </td>
                    <td className="text-end">
                      {numeral(row.jumlah_spm).format("0,0")}
                    </td>
                    <td className="text-end">
                      {numeral(row.nilai_spm).format("0,0")}
                    </td>
                  </tr>
                ))}
                {/* Total SPM dan Nilai SPM */}
                <tr>
                  <td
                    colSpan="2"
                    className="fw-bold text-end"
                    style={{ fontSize: "14px" }}
                  >
                    Total
                  </td>
                  <td className="fw-bold text-end" style={{ fontSize: "14px" }}>
                    {numeral(totalSPM).format("0,0")}
                  </td>
                  <td className="fw-bold text-end" style={{ fontSize: "14px" }}>
                    {numeral(totalNilaiSPM).format("0,0")}
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <div className="text-center">
              <p className="text-muted">Tidak ada data yang tersedia.</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
