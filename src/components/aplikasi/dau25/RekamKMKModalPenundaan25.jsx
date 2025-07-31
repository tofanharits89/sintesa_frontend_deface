import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Button,
  Form,
  Col,
  Row,
  Spinner,
  Card,
  Container,
  FloatingLabel,
  Table,
} from "react-bootstrap";

import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import numeral from "numeral";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";

const RekamKMKModalPenundaan25 = ({ show, onHide, nokmk, thang, alias }) => {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");

  useEffect(() => {
    nokmk && getData();
  }, [page, nokmk]);

  const getData = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT
      a.id,
      a.thang,
      a.no_kmk,
      a.uraian,
      a.kdkppn,
      a.kdpemda,
      a.kriteria,
      a.jenis,
      (a.jan / 1000000) AS jan,
      (a.peb / 1000000) AS peb,
      (a.mar / 1000000) AS mar,
      (a.apr / 1000000) AS apr,
      (a.mei / 1000000) AS mei,
      (a.jun / 1000000) AS jun,
      (a.jul / 1000000) AS jul,
      (a.ags / 1000000) AS ags,
      (a.sep / 1000000) AS sep,
      (a.okt / 1000000) AS okt,
      (a.nov / 1000000) AS nov,
      (a.des / 1000000) AS des,
      b.nmpemda,
      b.nmkppn
    FROM
      tkd25.ref_kmk_penundaan a
    LEFT JOIN
      tkd25.m_dau_24 b
    ON
      a.kdkppn = b.kdkppn AND a.kdpemda = b.kdpemda  WHERE a.no_kmk='${nokmk}' and  a.thang='${thang}'
    `
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

  const handleHapus = async (id) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";

    Swal.fire({
      title: "Konfirmasi Hapus",
      html: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      position: "top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.delete(
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC_DAU25}dau/penundaan/delete/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Notifikasi("Data telah dihapus.");
          getData();
        } catch (error) {
          const { status, data } = error.response || {};
          handleHttpError(
            status,
            (data && data.error) ||
              "Terjadi Permasalahan Koneksi atau Server Backend"
          );
        }
      }
    });
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
            Data Penundaan DAU
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: "100%" }}>
          <Card>
            <Card.Body className="data-user fade-in">
              <Table striped bordered hover responsive className="my-3">
                <thead>
                  <tr>
                    <th
                      rowSpan="2"
                      className="text-header text-center align-middle"
                    >
                      No
                    </th>
                    <th
                      rowSpan="2"
                      className="text-header text-center align-middle"
                    >
                      Thang
                    </th>
                    <th
                      rowSpan="2"
                      className="text-header text-center align-middle"
                    >
                      No KMK
                    </th>
                    <th
                      rowSpan="2"
                      className="text-header text-center align-middle"
                    >
                      Uraian
                    </th>
                    <th
                      rowSpan="2"
                      className="text-header text-center align-middle"
                    >
                      KPPN
                    </th>
                    <th
                      rowSpan="2"
                      className="text-header text-center align-middle"
                    >
                      Kab/ Kota
                    </th>
                    <th
                      colSpan="12"
                      className="text-header text-center align-middle"
                    >
                      Penundaan
                    </th>
                    <th
                      rowSpan="2"
                      className="text-header text-center align-middle"
                    >
                      Hapus
                    </th>
                  </tr>
                  <tr>
                    <th>Jan</th>
                    <th>Peb</th>
                    <th>Mar</th>
                    <th>Apr</th>
                    <th>Mei</th>
                    <th>Jun</th>
                    <th>Jul</th>
                    <th>Ags</th>
                    <th>Sep</th>
                    <th>Okt</th>
                    <th>Nov</th>
                    <th>Des</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td className="text-header text-center align-middle">
                        {index + 1 + page * limit}
                      </td>
                      <td className="text-header text-center align-middle">
                        {row.thang}
                      </td>
                      <td className="text-header text-center align-middle">
                        {row.no_kmk}
                      </td>
                      <td className="text-header text-center align-middle">
                        {row.uraian}
                      </td>
                      <td className="text-header text-center align-middle">
                        {row.nmkppn}
                      </td>
                      <td className="text-header text-center align-middle">
                        {row.nmpemda}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.jan).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.peb).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.mar).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.apr).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.mei).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.jun).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.jul).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.ags).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.sep).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.okt).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.nov).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {numeral(row.des).format("0,0")}
                      </td>
                      <td className="text-header text-center align-middle">
                        {row.id ? (
                          <i
                            className="bi bi-trash-fill text-danger"
                            onClick={() => handleHapus(row.id)}
                            style={{
                              cursor: "pointer",
                            }}
                          ></i>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
};

export default RekamKMKModalPenundaan25;
