import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { Loading2 } from "../../layout/LoadingTable";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { Button, Table, Tab, Nav, Spinner, Card } from "react-bootstrap";

import ReactPaginate from "react-paginate";

import GenerateCSV from "../CSV/generateCSV";
import Rekam from "./modalRekam";

import Notifikasi from "../notifikasi/notif";
import Swal from "sweetalert2";

import moment from "moment";
import RekamKontrak from "./modalRekamKontrak";

export default function DataDispensasiKPPN() {
  const {
    axiosJWT,
    token,
    role,
    kdkppn: kodekppn,
    kdlokasi,
    username,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [nomor, setNomor] = useState("");
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
  const [kdkppn, setKdkppn] = useState("");
  const [cek, setCek] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [where, setWhere] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCek = () => {
    setCek(true);
  };

  useEffect(() => {
    getData();
  }, [page, where]);

  const getData = async () => {
    setLoading(true);
    let filterKppn = "";
    if (role === "3") {
      filterKppn = where + (where ? " AND " : "") + `a.kdkppn = '${kodekppn}'`;
    } else if (role === "2") {
      filterKppn =
        where + (where ? " AND " : "") + `a.kdlokasi = '${kdlokasi}'`;
    } else {
      filterKppn = where;
    }

    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.thang,a.kddept,a.kdunit,a.kdsatker,c.nmsatker,a.kdlokasi,a.kdkppn,a.tgpermohonan, a.nopermohonan,
      a.kd_dispensasi,a.uraian,b.nmkppn,a.jmlkontrak 
      FROM laporan_2023.dispensasi_kppn a 
      left join dbref.t_kppn_2025 b on a.kdkppn=b.kdkppn
      LEFT JOIN dbref.t_satker_2025 c ON a.kdsatker=c.kdsatker  ${
        filterKppn ? `WHERE ${filterKppn}` : "  "
      }
        GROUP BY a.id ORDER BY id DESC`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);

    const encodedQuery2 = encodeURIComponent(
      ` SELECT a.thang,
        a.jenis,
         CASE 
            WHEN a.jenis = '01' THEN '01 - Kontrak'
            WHEN a.jenis = '02' THEN '02 - Adendum Kontrak'
            ELSE 'Lainnya'
        END AS uraianjenis,
        a.kddept,
        d.nmdept,
        a.kdunit,
        e.nmunit,
        a.kdkppn,
        b.nmkppn,
        a.kdsatker,
        c.nmsatker,
        a.kdlokasi,
        f.nmlokasi,
        a.tgpermohonan, 
        a.nopermohonan,a.tgpersetujuan,a.nopersetujuan,a.uraian AS keterangan,
        g.nokontrak,g.tgkontrak,g.nilkontrak,
        a.kd_dispensasi,
        CASE 
            WHEN a.kd_dispensasi = '01' THEN '01 - Kendala pada aplikasi'
            WHEN a.kd_dispensasi = '02' THEN '02 - Kendala pada pejabat perbendaharaan'
            WHEN a.kd_dispensasi = '03' THEN '03 - Kendala pada penyedia barang/jasa'
            WHEN a.kd_dispensasi = '04' THEN '04 - Kendala administrasi (dokumen kurang lengkap)'
            WHEN a.kd_dispensasi = '05' THEN '05 - Kendala pada revisi DIPA/MP PNBP'
            WHEN a.kd_dispensasi = '06' THEN '06 - Kendala jaringan dan listrik'
            ELSE 'Lainnya'
        END AS uraian,
        a.jmlkontrak 
    FROM 
        laporan_2023.dispensasi_kppn a 
    LEFT JOIN 
        dbref.t_kppn_2025 b ON a.kdkppn = b.kdkppn 
    LEFT JOIN 
        dbref.t_satker_2025 c ON a.kdsatker = c.kdsatker 
    LEFT JOIN 
        dbref.t_dept_2025 d ON a.kddept = d.kddept
    LEFT JOIN 
        dbref.t_unit_2025 e ON a.kddept = e.kddept AND a.kdunit = e.kdunit
    LEFT JOIN 
        dbref.t_lokasi_2025 f ON a.kdlokasi = f.kdlokasi 
    LEFT JOIN laporan_2023.dispensasi_kppn_lampiran g ON a.id=g.id_dispensasi
         ${filterKppn ? `WHERE ${filterKppn}` : "  "}
    GROUP BY 
          g.id
    ORDER BY 
    a.id DESC`
    );

    const cleanedQuery2 = decodeURIComponent(encodedQuery2)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery2);
    // console.log(cleanedQuery2);
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
  // console.log(sql);
  const handleRekam = async () => {
    setShowModal(true);
    setCek(false);
    setOpen(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    getData();
    setCek(true);
  };

  const handleRekamKontrak = async (
    id,
    nopermohonan,
    nmsatker,
    kdsatker,
    kdkppn
  ) => {
    setId(id);
    setNomor(nopermohonan);
    setNmsatker(nmsatker);
    setKdsatker(kdsatker);
    setKdkppn(kdkppn);
    setShowModalRekam(true);
  };
  const handleCloseModalSPM = () => {
    setShowModalRekam(false);
    setOpen(false);
    getData();
  };

  const handleHapusDispSPM = async (
    id,
    jumlah,
    kdsatker,
    kppn,
    id_dispensasi
  ) => {
    const confirmText =
      jumlah > 0
        ? `Ada ${jumlah} Kontrak yang sudah direkam.<br/> Anda yakin ingin menghapus data ini ? `
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
            `${
              import.meta.env.VITE_REACT_APP_LOCAL_BASIC
            }dispkontrakkppn/delete/${id}/${kdsatker}/${kppn}`,
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

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Dispensasi Kontrak KPPN</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              <li className="breadcrumb-item active">Rekam Dispensasi</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <>
            <div className="d-flex justify-content-end text-danger">
              {role !== "2" && (
                <Button
                  variant="success"
                  size="sm"
                  className="button  my-2"
                  style={{ padding: "5px 5px", marginTop: "10px" }}
                  onClick={() => handleRekam()}
                >
                  Rekam Dispensasi
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                className="button  my-2"
                style={{ padding: "5px 5px", marginTop: "10px" }}
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
                        {/* <th className="text-header text-center">Thang</th> */}
                        <th className="text-header text-center">KPPN</th>
                        <th className="text-header text-center">Satker</th>
                        <th className="text-header text-center">
                          Tgl Permohonan
                        </th>
                        <th className="text-header text-center">
                          Nomor Permohonan
                        </th>

                        <th className="text-header text-center">
                          Jumlah Kontrak
                        </th>

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
                          {/* <td className="align-middle text-center">
                            {row.thang}
                          </td> */}
                          <td className="align-middle text-center">
                            {row.nmkppn} ({row.kdkppn})
                          </td>
                          <td className="align-middle text-center">
                            {row.nmsatker} ({row.kdsatker})
                          </td>
                          <td className="align-middle text-center">
                            {row.tgpermohonan}
                          </td>
                          <td className="align-middle text-center">
                            {row.nopermohonan}
                          </td>{" "}
                          <td className="align-middle text-center">
                            {row.jmlkontrak > 0 ? (
                              row.jmlkontrak
                            ) : (
                              <span className="text-danger fw-bold">
                                kontrak belum direkam
                              </span>
                            )}
                          </td>
                          {role !== "2" ? (
                            <td className="align-middle text-center">
                              <i
                                className="bi bi-plus-square-fill text-success mx-3"
                                onClick={() =>
                                  handleRekamKontrak(
                                    row.id,
                                    row.nopermohonan,
                                    row.nmsatker,
                                    row.kdsatker,
                                    row.kdkppn
                                  )
                                }
                                style={{
                                  fontSize: "17px",
                                  cursor: "pointer",
                                }}
                              ></i>

                              <i
                                className="bi bi-trash-fill text-danger"
                                onClick={() =>
                                  handleHapusDispSPM(
                                    row.id,
                                    row.jmlkontrak,
                                    row.kdsatker,
                                    row.kdkppn
                                  )
                                }
                                style={{
                                  fontSize: "20px",
                                  cursor: "pointer",
                                }}
                              ></i>
                            </td>
                          ) : (
                            "-"
                          )}
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

      {open && <Rekam show={showModal} onHide={handleCloseModal} />}
      <RekamKontrak
        show={showModalRekam}
        onHide={handleCloseModalSPM}
        id={id}
        nomor={nomor}
        kdsatker={kdsatker}
        nmsatker={nmsatker}
        kdkppn={kdkppn}
      />
    </div>
  );
}
