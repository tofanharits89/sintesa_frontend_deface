import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  ModalFooter,
  Nav,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
// import { BsFillPlusSquareFill, BsTrash } from "react-icons/bs"; // Import plus and trash icons
import { Tab } from "react-bootstrap";
import moment from "moment";
import "./rekam_koordinasi.css";

export default function Rekam2({
  show,
  onHide,
  id,
  tahun,
  triwulan,
  kdsatker,
  nmsatker,
  nmmppnbp,
  ringkasanpilih,
  nosuratpilih,
  tglsuratpilih,
  laporanpilih,
  filesuratpilih,
  onSaveSuccess,
}) {
  const { axiosJWT, token, kdlokasi } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [ringkasan, setRingkasan] = useState("");
  const [no_surat, setNosurat] = useState("");
  const [tgl_surat, setTglsurat] = useState("");
  const [laporan, setLaporan] = useState("");
  const [file_surat, setFilesurat] = useState("");

  // Update waktu setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Konversi waktu ke GMT+7
  const getGMT7Time = () => {
    const utcTime =
      currentDateTime.getTime() + currentDateTime.getTimezoneOffset() * 60000;
    const gmt7Time = new Date(utcTime + 7 * 3600000);
    return gmt7Time.toLocaleTimeString("id-ID");
  };

  useEffect(() => {
    if (show) {
      setRingkasan(ringkasanpilih || "");
      setNosurat(nosuratpilih || "");
      setTglsurat(tglsuratpilih || "");
      setLaporan(laporanpilih || "");
      setFilesurat(filesuratpilih || "");
    }
  }, [
    show,
    ringkasanpilih,
    nosuratpilih,
    tglsuratpilih,
    laporanpilih,
    filesuratpilih,
  ]);

  const initialValues = {
    id,
    tahun,
    triwulan,
    kdsatker,
    no_surat: "",
    tgl_surat: "",
    ringkasan: ringkasanpilih || "",
    no_surat: nosuratpilih || "",
    tgl_surat: tglsuratpilih || "",
    file_surat: filesuratpilih || "",
    laporan: laporanpilih || "",
    file_surat: null,
    laporan: null,
  };

  const validationSchema = Yup.object().shape({
    no_surat: Yup.string().required("harus diisi"),
    tgl_surat: Yup.date().nullable().required("harus diisi"),
    ringkasan: Yup.string().required("harus diisi"),
    file_surat: Yup.mixed()
      .required("File belum dipilih")
      .test("fileSize", "Ukuran file terlalu besar (maks 2MB)", (value) => {
        return !value || (value && value.size <= 2 * 1024 * 1024);
      })
      .test("fileType", "Hanya file PDF yang diperbolehkan", (value) => {
        return !value || (value && value.type === "application/pdf");
      }),
    laporan: Yup.mixed()
      .required("File belum dipilih")
      .test("fileSize", "Ukuran file terlalu besar (maks 2MB)", (value) => {
        return !value || (value && value.size <= 2 * 1024 * 1024);
      })
      .test("fileType", "Hanya file PDF yang diperbolehkan", (value) => {
        return !value || (value && value.type === "application/pdf");
      }),
  });

  const handleRingkasanChange = (event, setFieldValue) => {
    const value = event.target.value;
    setRingkasan(value);
    setFieldValue("ringkasan", value);
  };

  const handleNosuratChange = (event, setFieldValue) => {
    const value = event.target.value;
    setNosurat(value);
    setFieldValue("no_surat", value);
  };

  const handleTglSuratChange = (date, setFieldValue) => {
    const formattedDate = date ? moment(date).format("YYYY-MM-DD") : "";
    setTglsurat(formattedDate);
    setFieldValue("tgl_surat", formattedDate);
  };

  // Fungsi untuk menangani perubahan file laporan
  const handleLaporanChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setLaporan(file); // Update state
      setFieldValue("laporan", file); // Update Formik
    }
  };

  // Fungsi untuk menangani perubahan file surat
  const handleFilesuratChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFilesurat(file); // Update state
      setFieldValue("file_surat", file); // Update Formik
    }
  };

  const handleSubmitdata = async (values, { setSubmitting }) => {
    if (!token) {
      Swal.fire("Error", "Token tidak ditemukan, silakan login ulang", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("id", values.id);
    formData.append("no_surat", values.no_surat || ""); // Pastikan tidak undefined
    formData.append(
      "tgl_surat",
      values.tgl_surat ? moment(values.tgl_surat).format("YYYY-MM-DD") : ""
    ); // Format tanggal
    formData.append("ringkasan", values.ringkasan || ""); // Pastikan ringkasan tidak undefined
    if (values.file_surat) formData.append("file_surat", values.file_surat);
    if (values.laporan) formData.append("laporan", values.laporan);

    try {
      await axiosJWT.patch(
        `${import.meta.env.VITE_REACT_APP_LOCAL_SIMPANMONEVPNBP}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      Swal.fire({
        html: `<div className='text-success mt-4'>Hasil Monev Berhasil Disimpan</div>`,
        icon: "success",
        confirmButtonText: "Tutup",
      })
        // onSaveSuccess(values.ringkasan, values.no_surat, values.tgl_surat, values.laporan, values.file_surat);
        .then(() => {
          onSaveSuccess(
            values.ringkasan,
            values.no_surat,
            values.tgl_surat,
            values.laporan,
            values.file_surat
          );
          onHide(); // **Menutup modal setelah sukses**
        });
    } catch (error) {
      const { status, data } = error.response || {};

      // Debugging error
      console.error("Error Response:", error.response);

      // Perbaikan handling error
      const errorMessage = data?.error || "Terjadi kesalahan pada server";
      handleHttpError(status, errorMessage);

      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    onHide();
  };
  // console.log("nmkanwil:", nmkanwil);

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
      size="xl"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>
          <i className="bi bi-box-arrow-in-right text-success mx-3"></i>
          Hasil Koordinasi dengan Satker
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: "auto", height: "600px" }}>
        <Tab.Container defaultActiveKey="monev-overview">
          <Nav
            variant="tabs"
            className="nav-tabs-bordered sticky-user is-sticky-user mb-0 mt-2"
            role="tablist"
          >
            <Nav.Item className="monev-tab">
              <Nav.Link eventKey="monev-overview" role="tab">
                Rekam Koordinasi
              </Nav.Link>
            </Nav.Item>{" "}
          </Nav>
          <Tab.Content className="pt-2">
            <Tab.Pane eventKey="monev-overview" role="tabpanel">
              <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmitdata}
                initialValues={initialValues}
                enableReinitialize
              >
                {({ handleSubmit, setFieldValue, values }) => {
                  useEffect(() => {
                    setFieldValue("ringkasan", ringkasanpilih || "");
                    setFieldValue("no_surat", nosuratpilih || "");
                    setFieldValue(
                      "tgl_surat",
                      tglsuratpilih
                        ? moment(tglsuratpilih).format("YYYY-MM-DD")
                        : ""
                    );
                    setFieldValue("laporan", laporanpilih || "");
                    setFieldValue("file_surat", filesuratpilih || "");
                  }, [
                    show,
                    ringkasanpilih,
                    nosuratpilih,
                    tglsuratpilih,
                    laporanpilih,
                    filesuratpilih,
                    setFieldValue,
                  ]);
                  return (
                    <Container className="mt-2">
                      <Form noValidate onSubmit={handleSubmit}>
                        <div className="d-flex flex-column align-items-start">
                          <span className="fw-bold text-success">
                            SATKER : {nmsatker} ({kdsatker})
                          </span>
                          <span className="fw-bold text-success">
                            JENIS PNBP : {nmmppnbp}
                          </span>
                        </div>
                        <hr />
                        <Row className="align-items-center">
                          <Col sm={6} md={6} lg={3} xl={3}>
                            <Form.Group className="fw-normal my-1">
                              <Form.Label className="fw-bold">
                                Nomor Surat
                              </Form.Label>
                              <Field
                                name="no_surat"
                                type="text"
                                placeholder="Nomor Surat"
                                as={Form.Control}
                                className="form-control"
                                onChange={(e) =>
                                  handleNosuratChange(e, setFieldValue)
                                }
                                value={no_surat}
                              />
                              <ErrorMessage
                                name="no_surat"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={6} lg={4} xl={4}>
                            <Form.Group className="fw-normal my-1">
                              <Form.Label className="fw-bold">
                                File Surat (Maks. 2 MB)
                              </Form.Label>

                              <div className="d-flex align-items-center gap-2">
                                {/* Input File */}
                                <input
                                  className="form-control flex-grow-1"
                                  type="file"
                                  name="file_surat"
                                  accept=".pdf"
                                  onChange={(e) =>
                                    handleFilesuratChange(e, setFieldValue)
                                  }
                                />

                                {/* Link jika surat sudah ada */}
                                {file_surat && (
                                  <a
                                    href={`https://sintesa.kemenkeu.go.id:88/monev_pnbp/${file_surat}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                  >
                                    <i className="bi bi-file-earmark-text"></i>{" "}
                                    Surat
                                  </a>
                                )}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="align-items-center">
                          <Col sm={6} md={6} lg={3} xl={3}>
                            <Form.Group className="fw-normal my-1">
                              <Form.Label className="fw-bold">
                                Tanggal Surat
                              </Form.Label>
                              <DatePicker
                                name="tgl_surat"
                                className="form-control"
                                selected={
                                  values.tgl_surat
                                    ? moment(values.tgl_surat).toDate()
                                    : null
                                }
                                onChange={(date) =>
                                  handleTglSuratChange(date, setFieldValue)
                                }
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Tanggal Surat"
                                autoComplete="off"
                                timeZone="UTC"
                                value={tgl_surat}
                              />
                              <ErrorMessage
                                name="tgl_surat"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={6} lg={4} xl={4}>
                            <Form.Group className="fw-normal my-1">
                              <Form.Label className="fw-bold">
                                Upload Laporan (Maks. 2 MB)
                              </Form.Label>

                              <div className="d-flex align-items-center gap-2">
                                {/* Input File */}
                                <input
                                  className="form-control flex-grow-1"
                                  type="file"
                                  name="laporan"
                                  accept=".pdf"
                                  onChange={(e) =>
                                    handleLaporanChange(e, setFieldValue)
                                  }
                                />

                                {/* Link jika laporan sudah ada */}
                                {laporan && (
                                  <a
                                    href={`https://sintesa.kemenkeu.go.id:88/monev_pnbp/${laporan}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                  >
                                    <i className="bi bi-file-earmark-text"></i>{" "}
                                    Laporan
                                  </a>
                                )}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="align-items-center">
                          <Col sm={12}>
                            <Form.Group className="fw-normal my-1">
                              <Form.Label className="fw-bold">
                                Ringkasan Pelaksanaan Koordinasi dengan Satker
                              </Form.Label>
                              <Field
                                name="ringkasan"
                                as="textarea"
                                placeholder="Masukkan Ringkasan"
                                className="form-control"
                                rows={4}
                                onChange={(e) =>
                                  handleRingkasanChange(e, setFieldValue)
                                }
                                value={ringkasan}
                              />
                              <ErrorMessage
                                name="ringkasan"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>{" "}
                        <div>
                          <p className="mt-2" style={{ fontSize: "20px" }}>
                            {getGMT7Time()}{" "}
                          </p>
                          <p style={{ fontSize: "15px" }}>
                            Waktu Server (GMT +7)
                          </p>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <Button
                            type="submit"
                            variant="danger"
                            disabled={loading}
                          >
                            {loading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Simpan Data"
                            )}
                          </Button>
                          <Button
                            variant="secondary"
                            className="ms-2"
                            onClick={onHide}
                          >
                            Tutup
                          </Button>
                        </div>
                        <hr />
                      </Form>
                    </Container>
                  );
                }}
              </Formik>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}
