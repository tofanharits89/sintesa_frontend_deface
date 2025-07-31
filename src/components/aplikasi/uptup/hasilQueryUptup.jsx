import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Modal, Spinner, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Tgupdate } from "../inquiry/hasilQuery";
import DataExport from "../CSV/formatCSV";
import "../../layout/layout.css";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const HasilQueryUptup = (props) => {
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
  const [total, setTotal] = useState(0);

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
    const encodedQuery = encodeURIComponent(sql.replace(/%/g, "%%"));
    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_UPTUP
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_UPTUP
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
      setTotal(response.data.total);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
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
  const columnTotals = new Array(1).fill(0);

  data.forEach((row) => {
    for (
      let cellIndex = jumlahKolom - 1;
      cellIndex < jumlahKolom;
      cellIndex++
    ) {
      columnTotals[cellIndex - (jumlahKolom - 1)] += Number(
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
                  <div className="d-flex justify-content-center my-2 text-danger">
                    Data Tidak Ditemukan
                  </div>
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
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td className="text-tengah">
                        {index + 1 + page * limit}
                      </td>
                      {Object.values(row).map((cell, index) => (
                        <React.Fragment key={index}>
                          {index > jumlahKolom - 2 ? (
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
                        className="text-end  baris-total"
                        colSpan={jumlahKolom}
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
              <span className="pagination justify-content-between mt-2 text-dark">
                Total : {numeral(rows).format("0,0")}, &nbsp; Hal :
                {rows ? page + 1 : 0} dari {pages}
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
                </nav>
              </span>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default HasilQueryUptup;
