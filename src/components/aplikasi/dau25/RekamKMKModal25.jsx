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
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import DatePicker from "react-datepicker";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from "sweetalert2";
import NotifikasiSukses from "../notifikasi/notifsukses";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import Kdkmk25 from "../../referensi/referensi_dau25/ref_kmk";
import Kdkriteria25 from "../../referensi/referensi_dau25/ref_kriteria";
import RefPenundaan25 from "../../referensi/referensi_dau25/ref_penundaan";
import RefPencabutan25 from "../../referensi/referensi_dau25/ref_pencabutan";
import CekKppn25 from "../../referensi/referensi_dau25/cek_Kppn";
import CekKdpemda25 from "../../referensi/referensi_dau25/cek_Kdpemda";

const RekamKMKModal25 = ({ show, onHide }) => {
  const { axiosJWT, token, kdkanwil, role } = useContext(MyContext);
  const [kmk, setKmk] = useState("");
  const [kriteria, setKriteria] = useState("");
  const [kppn, setCekKppn] = useState("");
  const [kdpemda, setKdpemda] = useState("");
  const [refPenundaan, setRefPenundaan] = useState("");
  const [refPencabutan, setRefPencabutan] = useState("");
  const [tahun, setTahun] = useState("");
  const [kmktunda, setKMKtunda] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [uraian, setUraian] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCabutPenundaan, setShowCabutPenundaan] = useState(false);

  useEffect(() => {
    const [kmkValue, tanggalValue, uraianValue, tahunValue] =
      refPencabutan.split("*");
    setTahun(tahunValue);
    setKMKtunda(kmkValue);
    setTanggal(tanggalValue);
    setUraian(uraianValue);
  }, [refPenundaan, refPencabutan]);

  useEffect(() => {
    setTahun("");
    setKMKtunda("");
    setTanggal("");
    setUraian("");
  }, [refPenundaan]);

  const handleKMK = (kmk) => {
    setKmk(kmk);
  };
  const handleKriteria = (kriteria) => {
    setKriteria(kriteria);
  };

  useEffect(() => {
    if (kmk === "3") {
      setShowCabutPenundaan(true);
    } else {
      setShowCabutPenundaan(false);
    }
    setTahun("");
    setKMKtunda("");
    setTanggal("");
    setUraian("");
    setRefPenundaan("");
    setRefPencabutan("");
    setKriteria("");
  }, [kmk]);

  const handleCekKppn = (kppn) => {
    setCekKppn(kppn);
  };
  const handleCekKdpemda = (kdpemda) => {
    setKdpemda(kdpemda);
  };

  const handlePenundaanKMK = (penundaan) => {
    setRefPenundaan(penundaan);
  };

  const handlePencabutanKMK = (pencabutan) => {
    setRefPencabutan(pencabutan);
  };

  const handleModalClose = () => {
    setKriteria("");
    setRefPencabutan("");
    setRefPenundaan("");
    setTahun("");
    setTanggal("");
    setKMKtunda("");
    setUraian("");
    setKmk("");
    onHide();
  };

  useEffect(() => {
    setRefPenundaan("");
    setRefPencabutan("");
    setTahun("");
    setKMKtunda("");
    setTanggal("");
    setUraian("");
    setCekKppn("");
    setKdpemda("");
  }, [kriteria]);

  useEffect(() => {
    setCekKppn("");
    setKdpemda("");
    setRefPencabutan("");
  }, [refPenundaan]);

  useEffect(() => {
    setCekKppn("");
    setKdpemda("");
  }, [refPencabutan]);

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);

    const apiUrl =
      values.jenis === "3"
        ? import.meta.env.VITE_REACT_APP_SIMPANKMKJENIS3_25
        : import.meta.env.VITE_REACT_APP_SIMPANKMK_25;

    let headers = {
      Authorization: `Bearer ${token}`,
    };

    // Set different Content-type based on values.jenis
    if (values.jenis !== "3") {
      headers["Content-type"] = "multipart/form-data";
    } else {
      headers["Content-type"] = "application/json";
    }
    try {
      const response = await axiosJWT.post(apiUrl, values, {
        headers: headers,
      });

      NotifikasiSukses("User Berhasil Disimpan");

      Swal.fire({
        html: `<div className='text-success mt-4'>Data Berhasil Disimpan</div>`,
        icon: "success",
        position: "top",
        buttonsStyling: false,
        customClass: {
          popup: "swal2-animation",
          container: "swal2-animation",
          confirmButton: "swal2-confirm",
          icon: "swal2-icon",
        },
        confirmButtonText: "Tutup",
      });
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    jenis: Yup.string().required("Jenis KMK harus dipilih"),
    kriteria: Yup.string().required("Kriteria KMK harus dipilih"),
    nomorkmk1: Yup.string().when("jenis", {
      is: (value) => value !== "3",
      then: () => Yup.string().required("Nomor KMK harus diisi"),
      otherwise: () => Yup.string(),
    }),
    tglkmk1: Yup.string().when("jenis", {
      is: (value) => value !== "3",
      then: () => Yup.string().required("Tgl KMK harus diisi"),
      otherwise: () => Yup.string(),
    }),
    uraian1: Yup.string().when("jenis", {
      is: (value) => value !== "3",
      then: () => Yup.string().required("Uraian KMK harus diisi"),
      otherwise: () => Yup.string(),
    }),
    file: Yup.mixed().when("jenis", {
      is: (value) => value !== "3",
      then: () =>
        Yup.mixed()
          .required("File KMK harus dipilih") // Require a file
          .test(
            "fileSize",
            "Ukuran file terlalu besar (maks 10MB)",
            (value) => {
              if (!value) return true; // Tidak validasi jika tidak ada file yang dipilih
              return value.size <= 10000000; // Ubah 1000000 ke ukuran maksimum yang diizinkan dalam byte (1MB)
            }
          )
          .test("fileType", "Tipe file tidak valid (hanya PDF)", (value) => {
            if (!value) return true; // Tidak validasi jika tidak ada file yang dipilih
            return value.type === "application/pdf"; // Check if the selected file is a PDF
          }),
      otherwise: () => Yup.mixed(),
    }),
    kppn: Yup.string().when("jenis", {
      is: (value) => value === "3",
      then: () => Yup.mixed().required("KPPN harus dipilih"),
    }),
    tunda: Yup.string().when("jenis", {
      is: (value) => value === "3",
      then: () => Yup.mixed().required("Penundaan harus dipilih"),
    }),
    cabut: Yup.string().when("jenis", {
      is: (value) => value === "3",
      then: () => Yup.mixed().required("Pencabutan harus dipilih"),
    }),
    kdpemda: Yup.string().when("jenis", {
      is: (value) => value === "3",
      then: () => Yup.mixed().required("Kabupaten/ Kota harus dipilih"),
    }),
  });

  return (
    <Container fluid>
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
            <i className="bi bi-back text-success mx-3"></i>
            Referensi KMK DAU
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmitdata}
                enableReinitialize={true}
                initialValues={{
                  jenis: kmk,
                  kriteria: kriteria,
                  nomorkmk1: "",
                  tglkmk1: "",
                  uraian1: "",
                  file: "",
                  kppn: kppn,
                  tunda: refPenundaan,
                  cabut: tanggal,
                  kdpemda: kdpemda,
                  kmkcabut: kmktunda,
                  tgcabut: tanggal,
                  uraiancabut: uraian,
                }}
              >
                {({ handleSubmit, handleChange, values, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col sm={12} md={6} lg={6} xl={6} className="mt-2 mb-3">
                        <Form.Group controlId="jenis">
                          <Form.Label>Jenis KMK</Form.Label>

                          <Kdkmk25
                            name="jenis"
                            as="select" // Mengganti input text dengan elemen select
                            className="form-select form-select-md text-select"
                            onChange={(e) => {
                              handleChange(e);
                              handleKMK(e);
                            }}
                          />

                          <ErrorMessage
                            name="jenis"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={6} className={`mt-2 mb-3`}>
                        <Form.Group controlId="kriteria">
                          <Form.Label>Kriteria</Form.Label>
                          <Kdkriteria25
                            kmk={kmk}
                            kriteria={kriteria}
                            name="kriteria"
                            onChange={(e) => {
                              handleChange(e);
                              handleKriteria(e);
                            }}
                          />
                          <ErrorMessage
                            name="kriteria"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {kmk === "3" && (
                      <div
                        className={`cabut_penundaan ${
                          showCabutPenundaan ? "active" : "non-active"
                        }`}
                      >
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className={`mt-2`}
                          >
                            <Form.Group controlId="tunda">
                              <Form.Label>Dasar Penundaan</Form.Label>
                              <RefPenundaan25
                                refPenundaan={refPenundaan}
                                kriteria={kriteria}
                                onChange={(e) => {
                                  handleChange(e);
                                  handlePenundaanKMK(e);
                                }}
                              />
                              <ErrorMessage
                                name="tunda"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className={`mt-2`}
                          >
                            <Form.Group controlId="cabut">
                              <Form.Label>Dasar Pencabutan</Form.Label>
                              <RefPencabutan25
                                refPencabutan={refPenundaan}
                                refPenundaan={refPencabutan}
                                onChange={(e) => {
                                  handleChange(e);
                                  handlePencabutanKMK(e);
                                }}
                              />
                              <ErrorMessage
                                name="cabut"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12} md={6} lg={4} xl={4} className={`mt-2`}>
                            <Form.Group controlId="tahun">
                              <Form.Label>Tahun</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                                disabled
                              />
                            </Form.Group>
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={4} className={`mt-2`}>
                            <Form.Group controlId="kmk">
                              <Form.Label>Nomor ND/ KMK</Form.Label>
                              <Form.Control
                                type="text"
                                name="nomorkmk"
                                placeholder=""
                                value={kmktunda}
                                onChange={(e) => setKMKtunda(e.target.value)}
                                disabled
                              />
                              <ErrorMessage
                                name="nomorkmk"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={4} className={`mt-2`}>
                            <Form.Group controlId="tanggal">
                              <Form.Label>Tanggal</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                name="cabut"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                disabled
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className={`mt-2`}
                          >
                            <Form.Group controlId="inputName5">
                              <Form.Label>Uraian</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={uraian}
                                onChange={(e) => setTahun(e.target.value)}
                                disabled
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className={`mt-2`}
                          >
                            <Form.Group controlId="kppn">
                              <Form.Label>KPPN</Form.Label>
                              <CekKppn25
                                name="kppn"
                                kppn={kppn}
                                no_kmk={refPenundaan}
                                as="select" // Mengganti input text dengan elemen select
                                className="form-select form-select-md text-select"
                                onChange={(e) => {
                                  handleChange(e);
                                  handleCekKppn(e);
                                }}
                              />
                              <ErrorMessage
                                name="kppn"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className={`mt-2`}
                          >
                            <Form.Group controlId="kdpemda">
                              <Form.Label>Kabupaten/ Kota</Form.Label>
                              <CekKdpemda25
                                name="kdpemda"
                                kppn={kppn}
                                kdpemda={kdpemda}
                                as="select" // Mengganti input text dengan elemen select
                                className="form-select form-select-md text-select"
                                onChange={(e) => {
                                  handleChange(e);
                                  handleCekKdpemda(e);
                                }}
                              />
                              <ErrorMessage
                                name="kdpemda"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}
                    {kmk !== "3" ? (
                      <div
                        className={`cabut_penundaan2 ${
                          showCabutPenundaan ? "non-active" : ""
                        }`}
                      >
                        <Row>
                          <Form.Group controlId="inputName5">
                            <Form.Label>Nomor ND/ KMK</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Nomor ND/ KMK"
                              name="nomorkmk1"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                            />
                            <ErrorMessage
                              name="nomorkmk1"
                              component="div"
                              className="text-danger"
                            />
                          </Form.Group>
                          <Col sm={12} md={12} lg={6} xl={6} className={`mt-2`}>
                            <Form.Group controlId="tglkmk1">
                              <Form.Label>Tgl KMK</Form.Label> <br />
                              {/* <DateTime
                                selected={values.tglkmk1}
                                onChange={(date) => {
                                  setFieldValue('tglkmk1', date);
                                }}
                                dateFormat="DD/MM/YYYY"
                                timeFormat={false}
                                name="tglkmk1"
                                placeholderText="Tgl ND/ KMK"
                                autoComplete="off"

                              /> */}
                              <DatePicker
                                selected={
                                  values.tglkmk1
                                    ? moment(values.tglkmk1).toDate()
                                    : null
                                }
                                onChange={(date) => {
                                  setFieldValue(
                                    "tglkmk1",
                                    moment(date).format(
                                      "YYYY-MM-DDTHH:mm:ss.SSSZ"
                                    ),
                                    true
                                  );
                                }}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Tgl ND/ KMK"
                                autoComplete="off"
                                timeZone="UTC"
                                className="form-control"
                              />
                              {/* <DatePicker
                                name="tglkmk1"
                                selected={values.tglkmk1 ? moment(values.tglkmk1).toDate() : null}
                                onChange={(date) => {
                                  setFieldValue('tglkmk1', moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ'), true);
                                }}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Tgl ND/ KMK"
                                autoComplete="off"
                                timeZone="UTC"
                              /> */}
                              <ErrorMessage
                                name="tglkmk1"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>

                          <Col sm={12} md={12} lg={6} xl={6} className={`mt-2`}>
                            <Form.Label>Uraian KMK</Form.Label>
                            <FloatingLabel
                              controlId="uraian1"
                              label="Uraian KMK"
                              className="mt-0"
                            >
                              <Form.Control
                                name="uraian1"
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                as="textarea"
                                placeholder="Uraian KMK"
                                style={{ height: "100px" }}
                              />
                            </FloatingLabel>
                            <ErrorMessage
                              name="uraian1"
                              component="div"
                              className="text-danger"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12} md={6} lg={6} xl={6} className={`my-3`}>
                            <Form.Group controlId="file">
                              <Form.Label>File KMK</Form.Label>
                              <input
                                className="form-control"
                                type="file"
                                name="file"
                                id="file" // Use "file" as the id to match the name attribute
                                onChange={(e) =>
                                  setFieldValue("file", e.target.files[0])
                                }
                              />
                              <ErrorMessage
                                name="file"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <div className="d-flex justify-content-end my-4">
                      <Button type="submit" variant="danger" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="mx-2"
                            />
                            Loading...
                          </>
                        ) : (
                          "Simpan"
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        className="mx-2"
                        onClick={handleModalClose}
                      >
                        Tutup
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RekamKMKModal25;
