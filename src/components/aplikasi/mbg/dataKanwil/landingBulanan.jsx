import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Card,
  Table,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";

import numeral from "numeral";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import { ModalRekamKomoditas } from "./ModalRekamKomoditas";
import { EPANOTIF } from "../../notifikasi/Omspan";
import Swal from "sweetalert2";
import SolidColorfulSpinner from "./Spinner";
import ReactPaginate from "react-paginate";

export const LandingBulanan = ({ activeKey }) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const WhereKanwil = role === "2" ? `where a.kdkanwil=${kdkanwil}` : "";
  const getData = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT 
      a.id, a.tahun,
      a.kdkanwil, 
      b.nmkanwil,a.indikator,customsatuan,triwulan,keterangan
     FROM data_bgn.indikator_bulanan a
    LEFT JOIN dbref2025.t_kanwil b ON a.kdkanwil = b.kdkanwil  ${WhereKanwil}
    ORDER BY a.createdAt DESC`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TAYANGDATAKANWIL
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_TAYANGDATAKANWIL}${encryptedQuery}&limit=${limit}&page=${page}&user=${username}`
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeKey === "tab3") {
      getData();
    }
  }, [page, activeKey]);
  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  const handleDelete = async (id, kdkanwil, triwulan) => {
    const result = await Swal.fire({
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      position: "top",
      title: "Yakin hapus data ini?",
      // text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",

      toast: false, // Nonaktifkan mode toast
      showConfirmButton: true,
      showCloseButton: true,
      timer: null, // Menghindari timer otomatis
    });

    if (result.isConfirmed) {
      try {
        await axiosJWT.delete(
          `${import.meta.env.VITE_REACT_APP_LOCAL_HAPUS_DATAKANWIL}/${id}/${kdkanwil}/${triwulan}/3`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        EPANOTIF("Data Berhasil Dihapus");
        getData(); // Refresh tabel
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        handleHttpError("Terjadi kesalahan saat menghapus data.");
      }
    }
  };

  return (
    <>
      <Container fluid>
        <Card>
          <Card.Body
            style={{ height: "600px", overflow: "auto" }}
            className="p-3"
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <SolidColorfulSpinner />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                viewport={{ amount: 0.2, once: true }}
              >
                <Table striped bordered hover responsive className="mt-0">
                  <thead className="table-dark">
                    <tr>
                      {" "}
                      <th>TAHUN</th>
                      <th>KANWIL</th> <th>TRIWULAN</th>
                      <th>BAHAN PANGAN</th>
                      <th> KETERANGAN</th>
                      <th>HAPUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {" "}
                          <td>{row.tahun}</td>
                          <td>
                            {row.nmkanwil} ({row.kdkanwil})
                          </td>{" "}
                          <td>{row.triwulan}</td>
                          <td>
                            {row.customindikator &&
                            row.customindikator.trim() !== ""
                              ? row.customindikator
                              : row.indikator}
                          </td>
                          <td>{row.keterangan}</td>
                          <td className="text-center">
                            <i
                              className="bi bi-trash-fill text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleDelete(row.id, row.kdkanwil, row.triwulan)
                              }
                            ></i>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          Tidak ada data tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </motion.div>
            )}
          </Card.Body>
        </Card>{" "}
        {data.length > 0 && (
          <>
            <span className="pagination justify-content-between">
              Total : {numeral(rows).format("0,0")} baris, &nbsp; Hal : &nbsp;
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
      </Container>
    </>
  );
};
