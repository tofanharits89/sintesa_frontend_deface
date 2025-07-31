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

const RekamKMKModalPotongan25 = ({ show, onHide, nokmk }) => {
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
      `SELECT a.id, a.thang, a.NMBULAN, a.no_kmk, a.kdkppn, a.bulan, a.kdakun, a.kdsatker, a.kdlokasi, a.kriteria, a.kdkabkota, a.nilai nilai, b.nmpemda, b.nmkppn
        FROM tkd25.detail_kmk_dau a
        LEFT JOIN tkd25.m_dau_24 b ON a.kdkppn = b.kdkppn AND a.kdkabkota = b.kdpemda
        WHERE a.no_kmk='${nokmk}'`
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
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC_DAU25}dau/potongan/delete/${id}`,
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
  const handlePageChange = ({ selected }) => {
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
            Data Potongan DAU
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body className="data-user fade-in">
              <Table striped bordered hover responsive className="my-3">
                <thead>
                  <tr>
                    <th className="text-header text-center align-middle">No</th>
                    <th className="text-header text-center align-middle">
                      Thang
                    </th>
                    <th className="text-header text-center align-middle">
                      No KMK
                    </th>
                    <th className="text-header text-center align-middle">
                      KPPN
                    </th>
                    <th className="text-header text-center align-middle">
                      Kab/ Kota
                    </th>
                    <th className="text-header text-center align-middle">
                      Bulan
                    </th>
                    <th className="text-header text-center align-middle">
                      Kode Akun
                    </th>
                    <th className="text-header text-center align-middle">
                      Kode Satker
                    </th>
                    <th className="text-header text-center align-middle">
                      Kode Lokasi
                    </th>
                    <th className="text-header text-center align-middle">
                      Nilai
                    </th>
                    <th className="text-header text-center align-middle">
                      Hapus
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">
                        {" "}
                        {index + 1 + page * limit}
                      </td>
                      <td className="align-middle text-center">{row.thang}</td>
                      <td className="align-middle text-center">{row.no_kmk}</td>
                      <td className="align-middle text-center">{row.nmkppn}</td>
                      <td className="align-middle text-center">
                        {row.nmpemda}
                      </td>
                      <td className="align-middle text-center">
                        {row.NMBULAN}
                      </td>
                      <td className="align-middle text-center">{row.kdakun}</td>
                      <td className="align-middle text-center">
                        {row.kdsatker}
                      </td>
                      <td className="align-middle text-center">
                        {row.kdlokasi}
                      </td>
                      <td className="align-middle text-end">
                        {numeral(row.nilai).format("0,0")}
                      </td>
                      <td className="align-middle text-center">
                        <i
                          className="bi bi-trash-fill text-danger"
                          onClick={() => handleHapus(row.id)}
                          style={{
                            cursor: "pointer",
                          }}
                        ></i>
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
                    previousLabel={<span>←</span>}
                    nextLabel={<span>→</span>}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    pageCount={pages}
                    containerClassName="pagination"
                    pageClassName="page-item2"
                    pageLinkClassName="page-link2"
                    previousClassName="page-item2"
                    previousLinkClassName="page-link2"
                    nextClassName="page-item2"
                    nextLinkClassName="page-link2"
                    activeClassName="active"
                    disabledClassName="disabled"
                    onPageChange={handlePageChange}
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

export default RekamKMKModalPotongan25;
