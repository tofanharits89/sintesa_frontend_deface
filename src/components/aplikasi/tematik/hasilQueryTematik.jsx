import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Modal, Spinner, Alert, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import format from "date-fns/format";
import CopyToClipboard from "react-copy-to-clipboard";
import DataExport from "../inquiry/formatCSV";
import "../../layout/layout.css";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const HasilQuery = (props) => {
  const { showModal, closeModal } = props;
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [sql] = useState(props.query);
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
  const [totPagu, settotPagu] = useState(0);
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
  const [totBlokir, settotBlokir] = useState(0);

  useEffect(() => {
    sql && getData();
  }, [sql, page]);

  function full(event) {
    const isChecked = event.target.checked;
    setFulls(isChecked);
    isChecked ? setFit("table-scroll2") : setFit("table-scroll");
  }

  const getData = async () => {
    setError("");
    setErr(false);
    setLoading(true);
    const encodedQuery = encodeURIComponent(sql.replace(/%/g, "%%"));
    const encryptedQuery = Encrypt(encodedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_TEMATIK
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_TEMATIK
            }${encryptedQuery}&page=${page}&limit=${limit}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.result.filter((item) => item.kddept !== "000"));
      setPages(response.data.totalPages);
      setRows(response.data.totalRows);
      settotPagu(response.data.totalPagu);
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
      settotBlokir(response.data.totalBlokir);

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

  const tutupModal = () => {
    closeModal();
  };

  const cekerror = () => {
    setErr(false);
  };

  const columns = Object.keys(data[0] || {});
  const jumlahKolom = Object.keys(data[0] || {}).length;
  const columnTotalSums = new Array(14).fill(0);

  data.forEach((row) => {
    for (
      let cellIndex = jumlahKolom - 14;
      cellIndex < jumlahKolom;
      cellIndex++
    ) {
      columnTotalSums[cellIndex - (jumlahKolom - 14)] += Number(
        row[Object.keys(row)[cellIndex]]
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

  return (
    <>
      <Modal
        onHide={tutupModal}
        show={showModal}
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
              <>
                {!loading && (
                  <p className="text-danger text-center datakosong">
                    Data Tidak Ditemukan
                  </p>
                )}
              </>
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
              <table
                className="table real-table table-hover table-responsive "
                width="100%"
              >
                <thead>
                  <tr>
                    {data.length > 0 && <th className="text-header">No</th>}
                    {columns.map((column, index) => (
                      <th key={index} className="text-header">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data
                    .filter((item) => item.kddept !== "000")
                    .map((row, index) => (
                      <tr key={index}>
                        <td className="text-tengah">
                          {index + 1 + page * limit}
                        </td>
                        {Object.values(row).map((cell, index) => (
                          <React.Fragment key={index}>
                            {index > jumlahKolom - 15 ? (
                              <td className="text-kanan">
                                {numeral(cell).format("0,0")}
                              </td>
                            ) : (
                              <td className="text-tengah">{cell}</td>
                            )}
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                </tbody>

                {jumlahKolom !== 0 && (
                  <tfoot>
                    <tr>
                      <td
                        className="text-end baris-total"
                        colSpan={jumlahKolom - 13}
                      >
                        SUB TOTAL
                      </td>
                      {columnTotalSums.map((total, totalIndex) => (
                        <td key={totalIndex} className="text-end baris-total">
                          {numeral(total).format("0,0")}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td
                        className="text-end baris-total fw-bold"
                        colSpan={jumlahKolom - 13}
                      >
                        TOTAL
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totPagu).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalJan).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalFeb).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalMar).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalApr).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalMei).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalJun).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalJul).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalAgs).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalSep).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalOkt).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalNov).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalDes).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totBlokir).format("0,0")}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </>

          {data.length > 0 && (
            <>
              <div className="pagination justify-content-between mt-2 text-dark">
                <span>
                  Total : {numeral(rows).format("0,0")}, &nbsp; Hal :{" "}
                  {rows ? page + 1 : 0} dari {pages}
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
                </nav>{" "}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
function Tgupdate(props) {
  const { axiosJWT, token } = useContext(MyContext);
  const [dataupdate, setDataupdate] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUpdate();
  }, []);

  const getUpdate = async () => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TGUPDATE
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_TGUPDATE}?thang=${
              props.thang
            }`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setDataupdate(response.data);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        "Loading ..."
      ) : (
        <span style={{ fontSize: "13px" }} className="bg-dark text-white p-1">
          {dataupdate.map((row, index) => (
            <React.Fragment key={index}>
              {`data update s.d ${format(
                new Date(row.tgupdate),
                "dd-MM-yyyy"
              )}`}
            </React.Fragment>
          ))}
        </span>
      )}
    </>
  );
}

const Sql = (props) => {
  const { showModalsql, closeModalsql } = props;
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
  };

  const tutupModalsql = () => {
    closeModalsql();
    setIsCopied(false);
  };

  return (
    <>
      <Modal
        onHide={tutupModalsql}
        show={showModalsql}
        backdrop="static"
        keyboard={false}
        size="xl"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px" }}></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "auto" }}>
          {loading ? (
            <div className="text-center"></div>
          ) : (
            <>
              <Alert variant="success text-center">
                {props.query2.toUpperCase()}
              </Alert>

              <div className="text-center">
                <CopyToClipboard text={props.query2} onCopy={handleCopy}>
                  <Button variant="primary" size="sm" className="w-25  me-2 ">
                    Copy to Clipboard
                  </Button>
                </CopyToClipboard>
                {isCopied ? (
                  <span style={{ color: "green" }}>Copied!</span>
                ) : null}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export { HasilQuery, Tgupdate, Sql };
