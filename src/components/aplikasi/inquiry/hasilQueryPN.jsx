import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Modal, Spinner, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Tgupdate } from "./hasilQuery";
import Notifikasi from "../notifikasi/notif";
import DataExport from "../CSV/formatCSV";
import "../../layout/layout.css";
import { handleHttpError } from "../notifikasi/toastError";
// import ToastError from "../notifikasi/toastError";

const HasilQueryPN = (props) => {
  const navigate = useNavigate();

  const { showModalPN, closeModalPN } = props;
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [sql] = useState(props.queryPN);
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

  useEffect(() => {
    getData();
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
    const encodedQuery = encodeURIComponent(sql);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY
          }${encodedQuery}&page=${page}&limit=${limit}`
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

  const tutupModalPN = () => {
    closeModalPN();
  };

  const cekerror = () => {
    setErr(false);
  };

  const columns = Object.keys(data[0] || {});
  const jumlahKolom = Object.keys(data[0] || {}).length;
  const columnTotals = new Array(39).fill(0);


  data.forEach((row) => {
    for (
      let cellIndex = jumlahKolom - 39;
      cellIndex < jumlahKolom;
      cellIndex++
    ) {
      columnTotals[cellIndex - (jumlahKolom - 39)] += Number(
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
        onHide={tutupModalPN}
        show={showModalPN}
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
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="text-tengah">
                        {rowIndex + 1 + page * limit}
                      </td>
                      {Object.values(row).map((cell, colIndex) => {
                        if (
                          colIndex > jumlahKolom - 40 &&
                          colIndex < jumlahKolom - 2
                        ) {
                          return (
                            <td key={colIndex} className="text-kanan">
                              {numeral(cell).format("0,0")}
                            </td>
                          );
                        } else if (colIndex === 39 || colIndex === 40) {
                          return (
                            <td key={colIndex} className="text-tengah">
                              {cell}
                            </td>
                          );
                        } else {
                          return (
                            <td key={colIndex} className="text-tengah">
                              {cell}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
                </tbody>

                {jumlahKolom !== 0 && (
                  <tfoot>
                    <tr>
                      <td
                        className="text-end  baris-total"
                        colSpan={jumlahKolom - 38}
                      >
                        TOTAL
                      </td>
                      {columnTotals.map((total, totalIndex) => (
                        <td key={totalIndex} className="text-end  baris-total">
                          {numeral(total).format("0,0")}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </>

          {data.length > 0 && (
            <>
              <p className="pagination justify-content-between mt-2 ">
                <span>
                  Total Baris: {numeral(rows).format("0,0")}, &nbsp; Halaman :{" "}
                  {rows ? page + 1 : 0} dari {pages}
                </span>
                {/* <p className="text-center text-danger">{msg}</p> */}
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
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default HasilQueryPN;
