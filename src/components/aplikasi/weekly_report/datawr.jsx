import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Loading2 } from "../../layout/LoadingTable";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { Button, Table, Tab, Nav, Spinner, Card } from "react-bootstrap";

import ReactPaginate from "react-paginate";

import GenerateCSV from "../CSV/generateCSV";
import Rekam from "./modalRekamWR";

import Notifikasi from "../notifikasi/notif";
import Swal from "sweetalert2";

import moment from "moment";
import "moment/locale/id";

export default function DataWR() {
  const {
    axiosJWT,
    token,
    role,
    kdkppn: kodekppn,
    username,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");

  const [data, setData] = useState([]);

  const [showModalRekam, setShowModalRekam] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");

  const [where, setWhere] = useState("");

  const [export2, setExport2] = useState(false);
  const [open, setOpen] = useState(false);
  const [error2, setError2] = useState(null);

  useEffect(() => {
    getData();
  }, [page, where]);

  const getData = async () => {
    setLoading(true);
    let filterKppn = "";
    if (role === "3") {
      filterKppn = where + (where ? " AND " : "") + `a.kdkppn = '${kodekppn}'`;
    } else {
      filterKppn = where;
    }

    const encodedQuery = encodeURIComponent(
      ` SELECT id,tahun,periode,bulan,tglawal,tglakhir,keterangan,FILE AS fileupload,nmbulan FROM laporan_2023.data_weekly ORDER BY id DESC`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    setSql(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TAYANGDISPENSASIKPPN
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TAYANGDISPENSASIKPPN
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
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const handleRekam = async () => {
    setShowModalRekam(true);

    setOpen(true);
  };
  const handleCloseModal = () => {
    setShowModalRekam(false);

    getData();
  };

  const handledownload = async (id) => {
    const fileUrl = `${
      import.meta.env.VITE_REACT_APP_LOCAL_BASIC
    }wr/download/${id}`;

    try {
      const response = await axiosJWT.get(fileUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentDisposition = response.headers["content-disposition"];
      let fileName = fileUrl.split("/").pop() || "downloaded_file";
      const type = response.headers["content-type"];
      console.log(contentDisposition, type);

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError2("Terjadi kesalahan saat mendownload file. Silakan coba lagi.");
      Notifikasi(error2);
    }
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
            `${
              import.meta.env.VITE_REACT_APP_LOCAL_BASIC
            }wr/delete/${id}/${token}`,
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
  const halaman = ({ selected }) => {
    setPage(selected);
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Weekly Report</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              <li className="breadcrumb-item active">Rekam WR</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <>
            <div className="d-flex justify-content-end text-danger">
              <Button
                variant="success"
                size="sm"
                className="button  my-2"
                style={{ padding: "5px 5px", marginTop: "10px" }}
                onClick={() => handleRekam()}
              >
                Rekam
              </Button>
            </div>
          </>
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
              <Card className="mt-1 p-2" bg="light">
                <Card.Body className="data-user fade-in ">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th className="text-header text-center">No</th>
                        <th className="text-header text-center">Tahun</th>
                        <th className="text-header text-center">Periode</th>
                        <th className="text-header text-center">Keterangan</th>
                        <th className="text-header text-center"> Opsi</th>
                      </tr>
                    </thead>

                    <tbody className="text-center">
                      {data.map((row, index) => (
                        <tr key={index}>
                          <td className="align-middle text-center">
                            {" "}
                            {index + 1 + page * limit}
                          </td>
                          <td className="align-middle text-center">
                            {row.tahun}
                          </td>
                          <td className="align-middle text-center">
                            {row.periode}
                            {row.periode === "bulanan"
                              ? ` (${row.nmbulan})`
                              : ` (  ${moment(row.tglawal)
                                  .locale("id")
                                  .format("DD/MM/YYYY")} s.d ${moment(
                                  row.tglakhir
                                )
                                  .locale("id")
                                  .format("DD/MM/YYYY")} )`}
                          </td>
                          <td className="align-middle text-center">
                            {row.keterangan}
                          </td>

                          <td className="align-middle text-center">
                            <i
                              className="bi bi-arrow-down-circle-fill text-primary mx-2"
                              onClick={() => handledownload(row.id)}
                              style={{
                                fontSize: "17px",
                                cursor: "pointer",
                              }}
                            ></i>

                            <i
                              className="bi bi-trash-fill text-danger"
                              onClick={() => handleHapus(row.id)}
                              style={{
                                fontSize: "17px",
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
              {export2 && (
                <GenerateCSV
                  query3={sql}
                  status={handleStatus}
                  namafile={`v3_CSV_DISPENSASI_KONTRAK_KPPN_${moment().format(
                    "DDMMYY-HHmmss"
                  )}`}
                />
              )}
              {data.length > 0 && (
                <>
                  <span className="pagination justify-content-between mt-2 mx-4 text-dark">
                    Total : {numeral(rows).format("0,0")}, &nbsp; Hal : &nbsp;
                    {rows ? page + 1 : 0} dari {pages}
                    <nav>
                      <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        breakLabel="..."
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
            </>
          )}{" "}
        </section>
      </main>
      <Rekam show={showModalRekam} onHide={handleCloseModal} />
    </div>
  );
}
