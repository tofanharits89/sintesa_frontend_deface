import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Modal, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Tgupdate } from "./hasilQuery";
import DataExport from "../CSV/formatCSV";
import Encrypt from "../../../auth/Random";
import "../../layout/layout.css";
import { handleHttpError } from "../notifikasi/toastError";
import Thang from "../../referensi/Thang";

const HasilQueryJnsblokir = (props) => {
  const navigate = useNavigate();
  const { showModalJnsblokir, closeModalJnsblokir } = props;
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [sql] = useState(props.queryJnsblokir);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");
  const [dataerr, setErr] = useState(false);
  const [fulls, setFulls] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [msg, setMsg] = useState("");
  const [fit, setFit] = useState("table-scroll");
  const [thang, setThang] = useState(props.thang);

  const [totalJan, setTotalJan] = useState(0);
  const [totalFeb, setTotalFeb] = useState(0);
  const [totalMar, setTotalMar] = useState(0);
  const [totalApr, setTotalApr] = useState(0);
  const [totalMei, setTotalMei] = useState(0);
  const [totalJun, setTotalJun] = useState(0);
  const [totalJul, setTotalJul] = useState(0);
  const [totalAgs, setTotalAgs] = useState(0);
  const [totalSep, setTotalSep] = useState(0);
  const [totalOkt, setTotalOkt] = useState(0);
  const [totalNov, setTotalNov] = useState(0);
  const [totalDes, setTotalDes] = useState(0);

  useEffect(() => {
    getData();
  }, [sql, page]);

  const full = (event) => {
    const isChecked = event.target.checked;
    setFulls(isChecked);
    isChecked ? setFit("table-scroll2") : setFit("table-scroll");
  };

  const getData = async () => {
    setError("");
    setErr(false);
    setLoading(true);
    const encodedQuery = encodeURIComponent(sql);
    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRYJNSBLOKIR}${encryptedQuery}&page=${page}&limit=${limit}&user=${username}&thang=${thang}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.result.filter((item) => item.kddept !== "000"));
      setPages(response.data.totalPages);
      setRows(response.data.totalRows);

      if (thang === "2024") {
        setTotalJul(response.data.totalJul);
        setTotalAgs(response.data.totalAgs);
        setTotalSep(response.data.totalSep);
        setTotalOkt(response.data.totalOkt);
        setTotalNov(response.data.totalNov);
        setTotalDes(response.data.totalDes);
      } else {
        setTotalJan(response.data.totalJan);
        setTotalFeb(response.data.totalFeb);
        setTotalMar(response.data.totalMar);
        setTotalApr(response.data.totalApr);
        setTotalMei(response.data.totalMei);
        setTotalJun(response.data.totalJun);
        setTotalJul(response.data.totalJul);
        setTotalAgs(response.data.totalAgs);
        setTotalSep(response.data.totalSep);
        setTotalOkt(response.data.totalOkt);
        setTotalNov(response.data.totalNov);
        setTotalDes(response.data.totalDes);
      }

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
        "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
      setErr(true);
    }
  };

  const tutupModalJnsblokir = () => {
    closeModalJnsblokir();
  };

  const cekerror = () => {
    setErr(false);
  };

  const columns = Object.keys(data[0] || {});
  const jumlahKolom = columns.length;
  const isThang2024 = thang === "2024";
  const columnTotals = new Array(isThang2024 ? 6 : 12).fill(0);
  // console.log(columnTotals);

  data.forEach((row) => {
    const startColumnIndex = jumlahKolom - (isThang2024 ? 6 : 12);
    for (let cellIndex = startColumnIndex; cellIndex < jumlahKolom; cellIndex++) {
      columnTotals[cellIndex - startColumnIndex] += Number(
        row[columns[cellIndex]]
      );
    }
  });

  const changePage = ({ selected }) => {
    setPage(selected);
    setFulls(true);
    setFit("table-scroll2");
    if (selected === 9) {
      setMsg(
        "Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!"
      );
    } else {
      setMsg("");
    }
  };

  const renderTableHeaders = () => {
    const commonHeaders = columns.slice(0, -44);
    const monthHeaders2024 = columns.slice(-38); // JUL to DES
    const monthHeadersOther = columns.slice(-44); // JAN to DES

    return (
      <>
        {data.length > 0 && <th className="text-header">No</th>}
        {commonHeaders.map((column, index) => (
          <th key={index} className="text-header">
            {column}
          </th>
        ))}
        {(isThang2024 ? monthHeaders2024 : monthHeadersOther).map((column, index) => (
          <th key={index + commonHeaders.length} className="text-header">
            {column}
          </th>
        ))}
      </>
    );
  };

  const renderTableData = () => {
    const monthDataKeys = isThang2024
      ? Object.keys(data[0] || {}).slice(-38)
      : Object.keys(data[0] || {}).slice(-44);

    const startIndex = monthDataKeys.indexOf("JUL");
    const endIndex = monthDataKeys.indexOf("DES");
    const totalDataAll = monthDataKeys.length;
    const totalDataMonth = monthDataKeys.length - 6;

    // console.log(startIndex, endIndex, totalDataAll, totalDataMonth);

    return data
      .filter((item) => item.kddept !== "000")
      .map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td className="text-center">{rowIndex + 1 + page * limit}</td>
          {monthDataKeys.map((key, index) => {
            const isRightAligned = index >= startIndex && index <= endIndex;
            // console.log(`Row ${rowIndex}, Column ${index}: ${isRightAligned ? 'text-right' : 'text-center'}`);
            const className = isRightAligned ? "text-kanan" : "text-tengah";
            return (
              <td key={`month-${rowIndex}-${index}`} className={className}>
                {isRightAligned ? numeral(row[key]).format("0,0") : row[key]}
              </td>
            );
          })}
        </tr>
      ));
  };

  const renderTableFooter = () => {
    const totalData2024 = [
      totalJul, totalAgs, totalSep, totalOkt, totalNov, totalDes
    ];
    const totalDataOther = [
      totalJan, totalFeb, totalMar, totalApr, totalMei, totalJun,
      totalJul, totalAgs, totalSep, totalOkt, totalNov, totalDes
    ];

    return (
      <tr>
        <td className="text-end baris-total text-right" colSpan={jumlahKolom - (isThang2024 ? 5 : 11)}>
          TOTAL
        </td>
        {(isThang2024 ? totalData2024 : totalDataOther).map((total, index) => (
          <td key={index} className="text-end baris-total fw-bold text-right">
            {numeral(total).format("0,0")}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <Modal
      onHide={tutupModalJnsblokir}
      show={showModalJnsblokir}
      backdrop="static"
      keyboard={false}
      size="xl"
      animation={false}
      fullscreen={fulls}
      dialogClassName="custom-modal"
      contentClassName="modal-content"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "15px" }}>
          <span>
            <Form.Check
              inline
              className="fw-normal mx-2 text-dark"
              type="checkbox"
              label="Full Screen"
              onChange={full}
              checked={fulls}
            />
          </span>
        </Modal.Title>
      </Modal.Header>
      {loading && (
        <div className="loading-container">
          <Spinner
            className="loading-spinner"
            as="span"
            animation="border"
            size="md"
            role="status"
            aria-hidden="true"
          />
        </div>
      )}
      <Modal.Body>
        <>
          {rows === 0 ? (
            !loading && (
              <p className="text-danger text-center datakosong">
                Data Tidak Ditemukan
              </p>
            )
          ) : (
            <>
              <div className="d-flex justify-content-between my-2">
                <div>
                  <Tgupdate thang={props.thang} />
                </div>

                <div>
                  <DataExport data={data} filename="data.csv" />
                </div>
              </div>
            </>
          )}

          <div className={fit}>
            <table className="table real-table table-hover table-responsive" width="100%">
              <thead>
                <tr>
                  {renderTableHeaders()}
                </tr>
              </thead>
              <tbody>
                {renderTableData()}
              </tbody>
              {jumlahKolom !== 0 && (
                <tfoot>
                  <tr>
                    <td
                      className="text-end  baris-total text-right"
                      colSpan={jumlahKolom - (isThang2024 ? 5 : 11)}
                    >
                      SUB TOTAL
                    </td>
                    {columnTotals.map((total, totalIndex) => (
                      <td key={totalIndex} className="text-end  baris-total text-right">
                        {numeral(total).format("0,0")}
                      </td>
                    ))}
                  </tr>
                  {renderTableFooter()}
                </tfoot>
              )}
            </table>
          </div>
        </>

        {data.length > 0 && (
          <p className="pagination justify-content-between mt-2">
            <span>
              Total: {numeral(rows).format("0,0")}, Hal: {rows ? page + 1 : 0} dari {pages}
            </span>
            <nav>
              <ReactPaginate
                breakLabel="..."
                nextLabel="›"
                onPageChange={changePage}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={pages}
                previousLabel="‹"
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
              />
            </nav>
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default HasilQueryJnsblokir;