import React, { useState, useContext, useEffect } from "react";
import { Button, Card, Container, Spinner, Table } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import numeral from "numeral";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";
import RekamTup from "./modalRekamTup";
import { Loading2, TableSkeleton } from "../../layout/LoadingTable";
import ReactPaginate from "react-paginate";
import GenerateCSV from "../CSV/generateCSV";
import moment from "moment";

export default function DataTup(props) {
  const { axiosJWT, token, username, role, kdkanwil, kdkppn } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalRekam, setShowModalRekam] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [sql, setSql] = useState("");
  const [kdsatker, setKdsatker] = useState("");
  const [nmsatker, setNmsatker] = useState("");
  const [cek, setCek] = useState(false);
  const [id, setId] = useState("");
  const [nomor, setNomor] = useState("");
  const [tahun, setTahun] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);
  const [error2, setError2] = useState(null);

  useEffect(() => {
    props.cek && getData();
  }, [props.cek, props.id, props.where, page]);

  const getData = async () => {
    setLoading(true);
    let filterKanwil = "";
    if (role === "2") {
      filterKanwil =
        props.where +
        (props.where ? " AND " : "") +
        `a.kdkanwil = '${kdkanwil}'`;
    } else {
      filterKanwil = props.where;
    }

    let filterKppn = "";
    if (role === "3") {
      filterKppn =
        props.where + (props.where ? " AND " : "") + `a.kdkppn = '${kdkppn}'`;
    } else {
      filterKppn = props.where;
    }

    // Menggabungkan filterKanwil dan filterKppn
    let combinedFilter = filterKanwil;
    if (role === "3") {
      combinedFilter = filterKppn; // Gunakan filter KPPN jika role adalah 3
    } else if (filterKanwil && filterKppn) {
      combinedFilter = `${filterKanwil} AND ${filterKppn}`; // Jika dua filter ada, gabungkan keduanya
    }

    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.thang,a.kddept,a.kdunit,a.kdsatker,c.nmsatker,a.kdlokasi,a.kdkppn,a.tgpermohonan,a.nopermohonan,a.uraian,a.username,a.kdkanwil_upload,a.jmltup jumlah,SUM(b.niltup) nilaitup FROM laporan_2023.dispensasi_tup a LEFT JOIN laporan_2023.dispensasi_tup_lampiran b ON a.id=b.id_dispensasi  LEFT JOIN dbref.t_satker_2024 c ON a.kdsatker=c.kdsatker  ${
        combinedFilter ? `WHERE ${combinedFilter}` : "  "
      }GROUP BY a.id order by id desc`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encodedQuery2 = encodeURIComponent(
      `SELECT a.id,a.kddept,b.nmdept,a.thang,a.kdunit,c.nmunit,a.kdsatker,i.nmsatker,a.kdlokasi,e.nmlokasi,a.kdkanwil,g.nmkanwil,a.kdkppn,h.nmkppn,a.uraian,a.tgpermohonan,
                a.nopermohonan,a.tgpersetujuan,a.nopersetujuan,z.notup,z.tgtup,z.niltup,z.status,a.username,a.kdkanwil_upload 
                FROM laporan_2023.dispensasi_tup a 
                LEFT JOIN laporan_2023.dispensasi_tup_lampiran z ON a.id=z.id_dispensasi
                LEFT JOIN dbref.t_dept_2024 b ON a.kddept=b.kddept 
                LEFT JOIN dbref.t_unit_2024 c ON a.kddept=c.kddept AND a.kdunit=c.kdunit 
                LEFT JOIN dbref.t_lokasi_2024 e ON a.kdlokasi=e.kdlokasi 
                LEFT JOIN dbref.t_kanwil_2014 g ON a.kdkanwil=g.kdkanwil 
                LEFT JOIN dbref.t_kppn_2024 h ON a.kdkppn=h.kdkppn 
                LEFT JOIN dbref.t_satker_2024 i ON a.kdsatker=i.kdsatker  ${
                  combinedFilter ? `WHERE ${combinedFilter}` : " "
                } ORDER BY a.kddept,a.kdsatker,a.id`
    );
    // console.log(encodedQuery2);

    const cleanedQuery2 = decodeURIComponent(encodedQuery2)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery2);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TAYANGTUP
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TAYANGTUP
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

  const handleRekamTup = async (
    id,
    nopermohonan,
    nmsatker,
    kdsatker,
    tahun
  ) => {
    setId(id);
    setNomor(nopermohonan);
    setNmsatker(nmsatker);
    setKdsatker(kdsatker);
    setShowModalRekam(true);
    setTahun(tahun);
  };
  const handleCloseModalSPM = () => {
    setShowModalRekam(false);
    getData();
  };

  const handleHapusDispTup = async (id, jumlah) => {
    const confirmText =
      jumlah > 0
        ? `Ada ${jumlah} TUP yang sudah direkam.<br/> Anda yakin ingin menghapus data ini ? `
        : "Anda yakin ingin menghapus data ini ?";

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
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC}disptup/delete/${id}`,
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

  const handledownloadTup = async (id) => {
    const intId = parseInt(id, 10); // Pastikan ID adalah integer
    const fileUrl = `${
      import.meta.env.VITE_REACT_APP_LOCAL_BASIC
    }dispentup/download/${intId}`;

    try {
      // Make the request to download the file as a blob
      const response = await axiosJWT.get(fileUrl, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Extract the filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "Surat_Persetujuan_Dispen_TUP.pdf"; // Default filename

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      // Set the filename for download
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.remove(); // Clean up the link element

      // Revoke the object URL to free up resources
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Handle errors
      setError2("Terjadi kesalahan saat mendownload file. Silakan coba lagi.");
      Notifikasi(error2);
    }
  };

  const halaman = ({ selected }) => {
    setPage(selected);
  };

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
  };
  return (
    <>
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
          <div className="d-flex justify-content-end align-item-center">
            <Button
              variant="danger"
              size="sm"
              className="my-2 mx-1"
              style={{ marginTop: "1px", width: "150px" }}
              onClick={() => {
                setLoadingStatus(true);
                setExport2(true);
              }}
              disabled={loadingStatus}
            >
              {loadingStatus && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {!loadingStatus && (
                <i className="bi bi-file-earmark-excel-fill mx-2"></i>
              )}
              {loadingStatus ? " Loading..." : "Download"}
            </Button>
          </div>
          <Card className="mt-3" bg="light">
            <Card.Body className="data-user fade-in ">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-header text-center">No.</th>
                    <th className="text-header text-center">TA</th>
                    <th className="text-header text-center">Satker</th>
                    <th className="text-header text-center">Tgl Permohonan</th>
                    <th className="text-header text-center">
                      Nomor Permohonan
                    </th>
                    <th className="text-header text-center">Jumlah TUP</th>
                    <th className="text-header text-center">Opsi</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">
                        {" "}
                        {index + 1 + page * limit}
                      </td>
                      <td className="align-middle text-center">{row.thang}</td>
                      <td className="align-middle text-center">
                        {row.nmsatker} ({row.kdsatker})
                      </td>
                      <td className="align-middle text-center">
                        {row.tgpermohonan}
                      </td>
                      <td className="align-middle text-center">
                        {row.nopermohonan}
                      </td>
                      <td className="align-middle text-center">{row.jumlah}</td>
                      <td className="align-middle text-center">
                        {role !== "3" && (
                          <i
                            className="bi bi-plus-square-fill text-success mx-3"
                            onClick={() =>
                              handleRekamTup(
                                row.id,
                                row.nopermohonan,
                                row.nmsatker,
                                row.kdsatker,
                                row.thang
                              )
                            }
                            style={{
                              fontSize: "17px",
                              cursor: "pointer",
                            }}
                          ></i>
                        )}
                        {role !== "3" && (
                          <i
                            className="bi bi-trash-fill text-danger"
                            onClick={() =>
                              handleHapusDispTup(row.id, row.jumlah)
                            }
                            style={{
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                          ></i>
                        )}
                        <i
                          className="bi bi-arrow-down-circle-fill text-primary mx-2"
                          onClick={() => handledownloadTup(row.id)}
                          style={{
                            fontSize: "20px",
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
              namafile={`v3_CSV_DISPEN_TUP_${moment().format("DDMMYY-HHmmss")}`}
            />
          )}
          {data.length > 0 && (
            <>
              <span className="pagination justify-content-between mt-2  mx-4 text-dark">
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
        </>
      )}
      <RekamTup
        show={showModalRekam}
        onHide={handleCloseModalSPM}
        tahun={tahun}
        id={id}
        nomor={nomor}
        kdsatker={kdsatker}
        nmsatker={nmsatker}
      />
    </>
  );
}
