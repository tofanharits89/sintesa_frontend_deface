import React, { useState, useContext, useEffect } from "react";
import { Card, Container, Modal, Table } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import numeral from "numeral";

import { Loading2 } from "../../layout/LoadingTable";
import ReactPaginate from "react-paginate";

export default function DataPemdaCabut25({ show, onHide, nokmk, thang }) {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");

  useEffect(() => {
    getData();
  }, [nokmk, page]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.no_kmk,a.tgl_kmk,a.no_kmkcabut,a.tglcabut,nm_kriteria,nmjenis,a.kdkppn,a.kdpemda,d.nmkppn,d.nmpemda FROM tkd25.ref_kmk_dau a
      LEFT OUTER JOIN ( SELECT b.jenis,b.nmjenis AS nmjenis FROM tkd25.ref_kmk b) b ON a.jenis=b.jenis 
      LEFT OUTER JOIN ( SELECT c.id_kriteria,c.nm_kriteria AS nm_kriteria FROM tkd25.ref_kmk_dau_kriteria c) c  ON a.kriteria=c.id_kriteria 
      LEFT OUTER JOIN ( SELECT d.kdkppn,d.kdpemda,d.nmkppn,d.nmpemda FROM tkd25.alokasi_bulanan d) d ON a.kdkppn=d.kdkppn AND a.kdpemda=d.kdpemda
      WHERE !ISNULL(a.kdkppn) and a.no_kmk='${nokmk}' GROUP BY a.no_kmk,a.kdkppn,a.kdpemda order by a.id desc`
    );
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_TKD_DAU_25
          ? `${
              import.meta.env.VITE_REACT_APP_TKD_DAU_25
            }${encryptedQuery}&limit=${limit}&page=${page}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
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
    }
  };
  const handleModalClose = () => {
    onHide();
    setPage(0);
  };
  const halaman = ({ selected }) => {
    setPage(selected);
  };

  return (
    <Container fluid>
      <Modal
        show={show}
        onHide={handleModalClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        animation={false}
        fullscreen={true}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>
            <i className="bi bi-back text-success mx-3"></i>
            Data Pencabutan DAU Pemda
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body className="data-user fade-in">
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
                  <table className="fixhead table-striped table-hover">
                    <thead>
                      <tr>
                        <th className="text-header text-center align-middle">
                          No
                        </th>
                        <th className="text-header text-center align-middle">
                          Jenis
                        </th>
                        <th className="text-header text-center align-middle">
                          Kriteria
                        </th>
                        <th className="text-header text-center align-middle">
                          Nomor/Tanggal KMK Penundaan
                        </th>
                        <th className="text-header text-center align-middle">
                          Nomor/Tanggal KMK Pencabutan
                        </th>
                        <th className="text-header text-center align-middle">
                          KPPN
                        </th>
                        <th className="text-header text-center align-middle">
                          Kab/ kota
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index}>
                          <td className="text-header text-center align-middle">
                            {index + 1 + page * limit}
                          </td>
                          <td className="text-header text-center align-middle">
                            {row.nmjenis}
                          </td>
                          <td className="text-header text-center align-middle">
                            {row.nm_kriteria}
                          </td>
                          <td className="text-header text-center align-middle">
                            No. {row.no_kmk} <br />
                            Tgl{" "}
                            {new Date(row.tgl_kmk).toLocaleDateString("en-GB")}
                          </td>
                          <td className="text-header text-center align-middle">
                            No. {row.no_kmkcabut} <br />
                            Tgl{" "}
                            {new Date(row.tglcabut).toLocaleDateString("en-GB")}
                          </td>
                          <td className="text-header text-center align-middle">
                            {row.nmkppn}
                          </td>
                          <td className="text-header text-center align-middle">
                            {row.nmpemda}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </Card.Body>
          </Card>

          {data.length > 0 && (
            <>
              <span className="pagination justify-content-between">
                Total : {numeral(rows).format("0,0")}, &nbsp; Hal : &nbsp;
                {rows ? page + 1 : 0} dari {pages}
                <nav>
                  <ReactPaginate
                    breakLabel="..."
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
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
        </Modal.Body>
      </Modal>
    </Container>
  );
}
