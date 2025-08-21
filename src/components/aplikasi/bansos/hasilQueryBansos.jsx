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

const HasilQueryBansos = (props) => {
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
  const [realJan, setrealJan] = useState(0);
  const [realFeb, setrealFeb] = useState(0);
  const [realMar, setrealMar] = useState(0);
  const [realApr, setrealApr] = useState(0);
  const [realMei, setrealMei] = useState(0);
  const [realJun, setrealJun] = useState(0);
  const [realJul, setrealJul] = useState(0);
  const [realAgs, setrealAgs] = useState(0);
  const [realSep, setrealSep] = useState(0);
  const [realOkt, setrealOkt] = useState(0);
  const [realNov, setrealNov] = useState(0);
  const [realDes, setrealDes] = useState(0);

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
<<<<<<< HEAD
    // console.log("Encrypted Query:", sql);
=======
    // console.log(encodedQuery);
>>>>>>> origin/blnjwil
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_BANSOS
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_BANSOS
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
      setTotalJan(response.data.jml1);
      setTotalFeb(response.data.jml2);
      setTotalMar(response.data.jml3);
      setTotalApr(response.data.jml4);
      setTotalMei(response.data.jml5);
      setTotalJun(response.data.jml6);
      setTotalJul(response.data.jml7);
      setTotalAgs(response.data.jml8);
      setTotalSep(response.data.jml9);
      setTotalOkt(response.data.jml10);
      setTotalNov(response.data.jml11);
      setTotalDes(response.data.jml12);
      setrealJan(response.data.real1);
      setrealFeb(response.data.real2);
      setrealMar(response.data.real3);
      setrealApr(response.data.real4);
      setrealMei(response.data.real5);
      setrealJun(response.data.real6);
      setrealJul(response.data.real7);
      setrealAgs(response.data.real8);
      setrealSep(response.data.real9);
      setrealOkt(response.data.real10);
      setrealNov(response.data.real11);
      setrealDes(response.data.real12);
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
  const columnTotals = new Array(24).fill(0);

  data.forEach((row) => {
    for (
      let cellIndex = jumlahKolom - 24;
      cellIndex < jumlahKolom;
      cellIndex++
    ) {
      columnTotals[cellIndex - (jumlahKolom - 24)] += Number(
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
                          {index > jumlahKolom - 25 ? (
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
                        colSpan={jumlahKolom - 23}
                      >
                        SUB TOTAL
                      </td>
                      {columnTotals.map((total, totalIndex) => (
                        <td key={totalIndex} className="text-end  baris-total">
                          {numeral(total).format("0,0")}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td
                        className="text-end baris-total fw-bold"
                        colSpan={jumlahKolom - 23}
                      >
                        TOTAL
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalJan).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realJan).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalFeb).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realFeb).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalMar).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realMar).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalApr).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realApr).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalMei).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realMei).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalJun).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realJun).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalJul).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realJul).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalAgs).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realAgs).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalSep).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realSep).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalOkt).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realOkt).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalNov).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realNov).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(totalDes).format("0,0")}
                      </td>
                      <td className="text-end baris-total fw-bold">
                        {numeral(realDes).format("0,0")}
                      </td>
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
export default HasilQueryBansos;
