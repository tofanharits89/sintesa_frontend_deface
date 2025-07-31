import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
import moment from "moment";

export default function Rekam({ show, onHide }) {
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [periode, setPeriode] = useState("");
  const [tahun, setTahun] = useState("");
  const [bulan, setBulan] = useState("");

  const handleJenisChange = (event, setFieldValue) => {
    setPeriode(event.target.value);
    setFieldValue("file", null);
    setBulan("");
  };

  const validationSchema = Yup.object().shape({
    tglawal: Yup.date().when("periode", {
      is: (periode) => periode === "mingguan",
      then: () =>
        Yup.date()
          .required("Tanggal awal harus diisi")
          .max(
            Yup.ref("tglakhir"),
            "Tanggal awal tidak boleh lebih besar dari Tanggal akhir"
          ),
      otherwise: () => Yup.string().nullable(),
    }),
    tglakhir: Yup.date().when("periode", {
      is: (periode) => periode === "mingguan",
      then: () => Yup.date().required("Tanggal akhir harus diisi"),
      otherwise: () => Yup.string().nullable(),
    }),
    bulan: Yup.string().when("periode", {
      is: (periode) => periode === "bulanan",
      then: () => Yup.string().required("bulan harus dipilih"),
      otherwise: () => Yup.string().nullable(),
    }),
    keterangan: Yup.string().required("keterangan harus diisi"),
    periode: Yup.string().required("Periode harus diisi"),
    tahun: Yup.string().required("Tahun harus dipilih"),
    file: Yup.mixed()
      .required("File belum dipilih")
      .test(
        "fileType",
        "Hanya file PPT, ZIP, RAR, atau PDF yang diperbolehkan",
        (value) => {
          const allowedTypes = [
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/pdf",
            "application/x-rar-compressed",
            "application/zip",
            "application/x-zip-compressed",
          ];
          const isValid = value && allowedTypes.includes(value.type);
          if (!isValid) {
            console.error("Invalid file type:", value ? value.type : "none");
          }
          return isValid;
        }
      ),
  });

  const initialValues = {
    tglawal: null,
    tahun: "",
    bulan: "",
    tglakhir: null,
    nomorakhir: null,
    keterangan: "",
    periode: "",
    file: null,
  };

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANWEEKLY,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    onHide();
    setBulan("");
    setPeriode("");
    setTahun("");
  };
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (show) {
      setAnimationClass("modal-body-animation-enter");
    } else {
      setAnimationClass("modal-body-animation-exit");
    }
  }, [show]);

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
          <i className="bi bi-back text-success mx-3"></i>
          Rekam Data Weekly Report
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ overflow: "auto", minHeight: "450px" }}
        className={`text-dark ${animationClass}`}
      >
        <Formik
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmitdata}
          initialValues={initialValues}
        >
          {({
            handleSubmit,
            handleChange,
            setFieldValue,
            values,
            touched,
            errors,
          }) => (
            <Container fluid>
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col sm={12} md={6} lg={6} xl={6}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">Tahun</Form.Label>
                      <Form.Select
                        value={tahun}
                        name="tahun"
                        as="select"
                        onChange={(e) => {
                          setTahun(e.target.value);
                          handleChange(e);
                        }}
                        aria-label="Pilih Tahun"
                        className={`form-control  ${
                          touched.tahun && errors.tahun ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Pilih Tahun</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={6} xl={6}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">
                        Periode Laporan
                      </Form.Label>
                      <Field
                        name="periode"
                        as="select"
                        className={`form-control ${
                          touched.periode && errors.periode ? "is-invalid" : ""
                        }`}
                        onChange={(e) => {
                          handleChange(e);
                          handleJenisChange(e, setFieldValue);
                          setPeriode(e.target.value);
                        }}
                      >
                        <option value="">-- Pilih Periode --</option>
                        <option value="mingguan">Mingguan</option>
                        <option value="bulanan">Bulanan</option>
                      </Field>
                    </Form.Group>
                  </Col>
                </Row>
                {periode === "mingguan" && (
                  <Row>
                    <Col sm={12} md={6} lg={6} xl={6}>
                      <Form.Group className="mb-1 mt-2">
                        <Form.Label className="fw-bold">
                          Tanggal Awal
                        </Form.Label>
                        <br />
                        <DatePicker
                          name="tglawal"
                          selected={
                            values.tglawal
                              ? moment(values.tglawal).toDate()
                              : null
                          }
                          onChange={(date) => {
                            setFieldValue(
                              "tglawal",
                              moment(date).format("YYYY-MM-DD"),
                              true
                            );
                          }}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Tgl awal"
                          autoComplete="off"
                          timeZone="UTC"
                          className={`form-control ${
                            touched.tglawal && errors.tglawal
                              ? "is-invalid"
                              : ""
                          } datepicker-container`}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6} lg={6} xl={6}>
                      <Form.Group className="mb-1 mt-2">
                        <Form.Label className="fw-bold">
                          Tanggal Akhir
                        </Form.Label>
                        <br />
                        <DatePicker
                          name="tglakhir"
                          selected={
                            values.tglakhir
                              ? moment(values.tglakhir).toDate()
                              : null
                          }
                          onChange={(date) => {
                            setFieldValue(
                              "tglakhir",
                              moment(date).format("YYYY-MM-DD"),
                              true
                            );
                          }}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Tgl akhir"
                          autoComplete="off"
                          timeZone="UTC"
                          className={`form-control ${
                            touched.tglakhir && errors.tglakhir
                              ? "is-invalid"
                              : ""
                          }`} // Tambahkan kelas ini
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                {periode === "bulanan" && (
                  <Row>
                    <Col sm={12} md={12} lg={12} xl={12}>
                      <Form.Group className="mb-1 mt-2">
                        <Form.Label className="fw-bold">Pilih Bulan</Form.Label>
                        <Field
                          name="bulan"
                          as="select"
                          className={`form-select form-select-md text-select ${
                            touched.bulan && errors.bulan ? "is-invalid" : ""
                          }`}
                          onChange={(e) => {
                            setBulan(e.target.value);
                            handleChange(e);
                          }}
                        >
                          <option value="">--- Pilih Bulan ---</option>
                          <option value="01">01 - Januari</option>
                          <option value="02">02 - Februari</option>
                          <option value="03">03 - Maret</option>
                          <option value="04">04 - April</option>
                          <option value="05">05 - Mei</option>
                          <option value="06">06 - Juni</option>
                          <option value="07">07 - Juli</option>
                          <option value="08">08 - Agustus</option>
                          <option value="09">09 - September</option>
                          <option value="10">10 - Oktober</option>
                          <option value="11">11 - November</option>
                          <option value="12">12 - Desember</option>
                        </Field>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                {periode !== "" && (
                  <>
                    <Row className="modal-body-animation-enter">
                      <Col sm={12}>
                        <Form.Group className="mb-1">
                          <Form.Label className="fw-bold">
                            Keterangan
                          </Form.Label>
                          <Field
                            type="text"
                            name="keterangan"
                            placeholder="keterangan laporan"
                            className={`form-control  ${
                              touched.keterangan && errors.keterangan
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="modal-body-animation-enter">
                      <Col sm={12} md={12} lg={12} xl={12}>
                        <Form.Group controlId="file">
                          <Form.Label className="fw-bold">File</Form.Label>
                          <input
                            className={`form-control ${
                              touched.file && errors.file ? "is-invalid" : ""
                            }`}
                            type="file"
                            name="file"
                            accept=".pptx,.rar,.pdf,.zip"
                            onChange={(e) =>
                              setFieldValue("file", e.target.files[0])
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
                <Button
                  type="submit"
                  variant="danger"
                  className="mt-3 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      &nbsp; Loading...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </Form>
            </Container>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
