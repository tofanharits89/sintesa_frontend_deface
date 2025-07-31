import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  OverlayTrigger,
  Table,
  Tooltip,
  Spinner,
  Form,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import DownloadModal from "./DownloadModal";

import moment from "moment";
import Encrypt from "../../../auth/Random";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";

const Monev = ({ cekMonev }) => {
  const { axiosJWT, token, kdkppn, role, username } = useContext(MyContext);
  const LIMIT = 20;
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sql, setSql] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("0201"); // Default Triwulan I
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Referensi periode triwulan
  const periodeOptions = [
    { value: "semua", label: "Semua Periode" },
    { value: "0201", label: "Triwulan I" },
    { value: "0202", label: "Triwulan II" },
    { value: "0203", label: "Triwulan III" },
    { value: "0204", label: "Triwulan IV" },
  ];

  useEffect(() => {
    if (cekMonev) {
      setData([]);
      setOffset(0);
      setHasMoreData(true);
      fetchData(0, true);
    }
  }, [cekMonev, selectedPeriode]); // Tambahkan selectedPeriode sebagai dependency

  const fetchData = async (currentOffset = offset, resetData = false) => {
    try {
      setLoading(true);

      let filterKppn = "";
      if (role === "3") {
        filterKppn = `and a.kdkppn = '${kdkppn}'`;
      } else {
        filterKppn = "";
      }

      // Filter periode - jika "semua" maka tidak ada filter periode
      let filterPeriode = "";
      if (selectedPeriode !== "semua") {
        filterPeriode = `and a.periode='${selectedPeriode}'`;
      }

      const rawQuery = `SELECT
        a.id,
        a.kdkppn,
        b.nmkppn,
        c.nmjenis,
        a.jenis,a.periode, e.nmsubperiode,
        d.kdperiode,
        d.nmperiode,
        a.waktu,
        a.fileasli,
        a.nilai,
        a.catatan,
        a.file,
        a.tahun
        FROM
        tkd.upload_data_kppn a
        LEFT JOIN
        dbref.t_kppn_2023 b ON a.kdkppn = b.kdkppn
        LEFT JOIN
        tkd.ref_jenis_laporan c ON a.jenis = c.kdjenis
        LEFT JOIN
        tkd.ref_periode_kppn d ON a.periode = d.kdperiode
        LEFT JOIN
        tkd.ref_subperiode_kppn e ON a.periode = e.subkdperiode 
        WHERE a.jenis='02' AND e.jenis='02' ${filterPeriode} ${filterKppn}
        GROUP BY
        a.kdkppn,
        a.subperiode,
        a.waktu
        ORDER BY
        a.waktu DESC
        LIMIT ${LIMIT} OFFSET ${currentOffset}`;

      setLoading(true);
      const cleanedQuery = rawQuery.replace(/\s+/g, " ").trim();
      const encryptedQuery = Encrypt(cleanedQuery);

      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
        }${encryptedQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resetData) {
        setData(response.data.result);
        setOffset(20);
      } else {
        setData((prevData) => [...prevData, ...response.data.result]);
        setOffset((prevOffset) => prevOffset + 20);
      }

      if (response.data.result.length < 20) {
        // Jika jumlah data kurang dari 30, maka loading tetap true
        setLoading(true);
        setHasMoreData(false); // Tidak ada lagi data yang bisa dimuat
      } else {
        setHasMoreData(true);
      }
    } catch (error) {
      console.error(error);
      handleHttpError(
        error.response?.status,
        error.response?.data?.error || "Terjadi kesalahan saat memuat data."
      );
      setHasMoreData(false);
    } finally {
      setLoading(false);
    }
  };
  const handlePeriodeChange = (e) => {
    const newPeriode = e.target.value;
    setSelectedPeriode(newPeriode);
    // Data akan direset melalui useEffect
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      // Show loading state
      // Notifikasi("Memulai download file...");

      // Call download API
      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_DOWNLOAD_API
        }download/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for file download
        }
      );

      // Create blob URL and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Notifikasi("File berhasil didownload!");
    } catch (error) {
      console.error("Error downloading file:", error);
      const { status, data } = error.response || {};
      if (status === 404) {
        Notifikasi("File tidak ditemukan di server.", "error");
      } else {
        handleHttpError(
          status,
          (data && data.error) || "Gagal mendownload file"
        );
      }
    }
  };

  const getFileInfo = async (fileId) => {
    try {
      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_DOWNLOAD_API
        }file-info/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting file info:", error);
      return null;
    }
  };

  const handleShowDownloadModal = (row) => {
    setSelectedFile(row);
    setShowDownloadModal(true);
  };

  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
    setSelectedFile(null);
  };

  const handleHapusdata = async (id) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";
    //console.log(id);
    Swal.fire({
      title: "Konfirmasi Hapus",
      html: confirmText,
      icon: "warning",
      // showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      position: "top",
      buttonsStyling: true,
      customClass: {
        confirmButton: "btn btn-primary btn-sm",
        cancelButton: "btn btn-secondary btn-sm",
      },
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.delete(
            `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_UPLOADKPPN
            }/delete/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Reset and reload data after deletion
          setData([]);
          setOffset(0);
          setHasMoreData(true);
          fetchData(0, true);
        } catch (error) {
          console.log(error);

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
    <>
      {/* Filter Periode */}
      <div className="mb-2 mt-2 fade-in">
        <Row className="align-items-center">
          <Col md={12}>
            <div className="d-flex justify-content-end align-items-center gap-3">
              {loading && (
                <Spinner
                  animation="border"
                  size="sm"
                  className="ms-2 text-primary"
                />
              )}{" "}
              <Form.Group className="d-flex align-items-center mb-0">
                <Form.Label className="me-2 mb-0 text-nowrap">
                  <strong>Filter Periode:</strong>
                </Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedPeriode}
                  onChange={handlePeriodeChange}
                  style={{ width: "150px" }}
                  disabled={loading}
                  className={loading ? "opacity-50" : ""}
                >
                  {periodeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="text-muted">
                <small>
                  <i className="bi bi-files me-1"></i>
                  Total: <strong>{data.length}</strong> data
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Card className="mt-0" bg="light">
        <div id="scrollableDiv" style={{ height: "50vh", overflow: "auto" }}>
          <InfiniteScroll
            dataLength={data.length}
            next={fetchData}
            hasMore={hasMoreData}
            loader={<p>Loading...</p>}
            //  endMessage={<p>No more data to load.</p>}
            scrollableTarget="scrollableDiv"
          >
            <Table bordered striped className="mt-3">
              <thead className="is-sticky-datauser bg-secondary">
                <tr>
                  <th colSpan="8" className="text-center bg-primary text-white">
                    <i className="bi bi-filter me-1"></i>
                    Filter Aktif:{" "}
                    {
                      periodeOptions.find((p) => p.value === selectedPeriode)
                        ?.label
                    }
                  </th>
                </tr>
                <tr>
                  <th rowSpan="2" className="text-center align-middle">
                    No
                  </th>
                  <th rowSpan="2" className="text-center align-middle">
                    Tahun
                  </th>
                  <th rowSpan="2" className="text-center align-middle">
                    KPPN
                  </th>

                  <th colSpan="1" className="text-center align-middle">
                    Jenis Laporan
                  </th>
                  <th rowSpan="2" className="text-center align-middle">
                    Periode
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center align-middle"
                    style={{ width: "150px" }}
                  >
                    Uraian
                  </th>
                  <th rowSpan="2" className="text-center align-middle">
                    Uploaded
                  </th>

                  <th rowSpan="2" className="text-center align-middle">
                    Opsi
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.map((row, index) => (
                  <tr key={`${row.id}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{row.tahun}</td>
                    <td>{row.nmkppn}</td>
                    <td>{row.nmjenis}</td>
                    <td>
                      {row.nmperiode} ({row.nmsubperiode})
                    </td>
                    <td>
                      <OverlayTrigger
                        key={`tooltip-${row.id}`}
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            <strong>{row.catatan}</strong>
                          </Tooltip>
                        }
                      >
                        <span>
                          {row.catatan ? row.catatan.slice(0, 30) + " ..." : ""}
                        </span>
                      </OverlayTrigger>
                    </td>
                    <td>{moment(row.waktu).format("DD-MM-YYYY HH:mm:ss")}</td>
                    <td>
                      <div
                        className="d-flex justify-content-center gap-2"
                        style={{ verticalAlign: "middle" }}
                      >
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Download File</Tooltip>}
                        >
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleShowDownloadModal(row)}
                          >
                            <i className="bi bi-download"></i>
                          </button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Hapus Data</Tooltip>}
                        >
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleHapusdata(row.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </InfiniteScroll>
          {/* {loading && <Spinner animation="border" />} */}
        </div>{" "}
        <DownloadModal
          show={showDownloadModal}
          onHide={handleCloseDownloadModal}
          fileInfo={selectedFile}
          onDownload={handleDownloadFile}
          onGetInfo={getFileInfo}
        />
      </Card>
    </>
  );
};

export default Monev;
