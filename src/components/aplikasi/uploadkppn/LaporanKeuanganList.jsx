import React, { useState, useContext, useEffect } from "react";
import {
  Table,
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Modal,
  ModalBody,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import numeral from "numeral";

import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { get } from "lodash";
import DownloadModal from "./DownloadModal";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";

export default function LaporanKeuanganList() {
  const LIMIT = 20;
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPeriode, setSelectedPeriode] = useState("01"); // Default semua periode

  // Referensi periode
  const periodeOptions = [
    { value: "semua", label: "Semua Periode" },
    { value: "01", label: "Bulanan" },
    { value: "02", label: "Semesteran" },
    { value: "03", label: "Tahunan" },
    { value: "04", label: "Triwulan III" },
  ];

  const { axiosJWT, token, kdlokasi, role, kdkanwil, kdkppn } =
    useContext(MyContext);

  const fetchData = async (currentOffset = offset, resetData = false) => {
    let filterKppn = "";
    if (role === "3" && kdkppn) {
      filterKppn = `and a.kdkppn = '${kdkppn}'`;
    }

    // Filter periode - jika "semua" maka tidak ada filter periode
    let filterPeriode = "";
    if (selectedPeriode !== "semua") {
      filterPeriode = `and a.periode='${selectedPeriode}'`;
    }

    const rawQuery = `
      SELECT
        a.id,
        a.kdkppn,
        b.nmkppn,
        c.nmjenis,
        d.kdperiode,
        a.subperiode,
        d.nmperiode,
        a.waktu,
        a.fileasli,
        a.nilai,
        e.nmsubperiode,
        a.catatan,
        a.file,
        a.tahun
      FROM
        tkd.upload_data_kppn a
        LEFT JOIN dbref.t_kppn_2023 b ON a.kdkppn = b.kdkppn
        LEFT JOIN tkd.ref_jenis_laporan c ON a.jenis = c.kdjenis
        LEFT JOIN tkd.ref_periode_kppn d ON a.periode = d.kdperiode
        LEFT JOIN tkd.ref_subperiode_kppn e ON a.periode = e.kdperiode AND a.subperiode = e.subkdperiode
      WHERE
        a.jenis = '01'
        ${filterPeriode}
        ${filterKppn}
      ORDER BY
        a.waktu DESC
      LIMIT ${LIMIT} OFFSET ${currentOffset}
    `;

    try {
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
  useEffect(() => {
    setData([]);
    setOffset(0);
    setHasMoreData(true);
    fetchData(0, true);
  }, [selectedPeriode]);

  const handlePeriodeChange = (e) => {
    const newPeriode = e.target.value;
    setSelectedPeriode(newPeriode);
    // Data akan direset melalui useEffect
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
  return (
    <>
      <div className="mb-4 mt-2 fade-in">
        <Row className="align-items-center">
          <Col md={12}>
            <div className="d-flex justify-content-end align-items-center gap-3">
              {loading && (
                <Spinner
                  animation="border"
                  size="sm"
                  className="ms-2 text-primary"
                />
              )}
              <Form.Group className="d-flex align-items-center mb-0">
                <Form.Label className="me-3 mb-0 text-nowrap">
                  <strong>Filter Periode:</strong>
                </Form.Label>
                <Form.Select
                  value={selectedPeriode}
                  onChange={handlePeriodeChange}
                  style={{ width: "220px", fontSize: "16px" }}
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
              <div className="text-muted ms-auto">
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
        <div
          id="scrollableDiv"
          style={{
            height: "50vh",
            overflow: "auto",
            position: "relative",
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={() => {
              if (!loading) fetchData();
            }}
            hasMore={hasMoreData}
            loader={
              <p className="text-center my-3">
                Loading data Laporan Keuangan...
              </p>
            }
            scrollableTarget="scrollableDiv"
          >
            <Table bordered striped hover className="mt-0 mb-0">
              <thead
                style={{
                  position: "sticky",
                  top: "0px",
                  backgroundColor: "#0d6efd",
                  zIndex: 1030,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <tr>
                  <th
                    className="text-center align-middle"
                    style={{
                      width: "50px",
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #dee2e6",
                      padding: "12px 8px",
                    }}
                  >
                    <i className="bi bi-hash"></i>
                  </th>
                  <th
                    className="text-center align-middle"
                    style={{
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #dee2e6",
                      padding: "12px 8px",
                    }}
                  >
                    <i className="bi bi-calendar2"></i> Tahun
                  </th>
                  <th
                    className="text-center align-middle"
                    style={{
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #dee2e6",
                      padding: "12px 8px",
                    }}
                  >
                    <i className="bi bi-building"></i> KPPN
                  </th>
                  <th
                    className="text-center align-middle"
                    style={{
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #dee2e6",
                      padding: "12px 8px",
                    }}
                  >
                    <i className="bi bi-journals"></i> Jenis
                  </th>
                  <th
                    className="text-center align-middle"
                    style={{
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #dee2e6",
                      padding: "12px 8px",
                    }}
                  >
                    <i className="bi bi-clock-history"></i> Periode
                  </th>
                  <th
                    className="text-center align-middle"
                    style={{
                      width: "200px",
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #dee2e6",
                      padding: "12px 8px",
                    }}
                  >
                    <i className="bi bi-file-earmark-text"></i> Uraian
                  </th>
                  <th
                    className="text-center align-middle"
                    style={{
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #dee2e6",
                      padding: "12px 8px",
                    }}
                  >
                    <i className="bi bi-upload"></i> Uploaded
                  </th>
                  <th
                    className="text-center align-middle"
                    style={{
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #dee2e6",
                      padding: "12px 8px",
                    }}
                  >
                    <i className="bi bi-gear"></i> Opsi
                  </th>
                </tr>
              </thead>

              <tbody className="text-center">
                {data.map((row, index) => (
                  <tr key={`${row.id}-${index}`}>
                    <td>{offset - LIMIT + index + 1}</td>
                    <td>{row.tahun}</td>
                    <td>{row.nmkppn}</td>
                    <td>{row.nmjenis}</td>
                    <td>
                      {row.nmperiode}{" "}
                      {row.nmsubperiode && (
                        <span className="text-muted">({row.nmsubperiode})</span>
                      )}
                    </td>
                    <td>
                      <OverlayTrigger
                        key={`tooltip-${row.id}`}
                        placement="top"
                        overlay={
                          <Tooltip>
                            <strong>
                              {row.catatan || "Tidak ada catatan"}
                            </strong>
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
                      <div className="d-flex justify-content-center gap-2">
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
}
