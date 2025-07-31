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
import { Formik, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from "sweetalert2";
import Encrypt from "../../../auth/Random";
import moment from "moment";
import CekKppn from "./cek_Kppn";

export default function Rekam({ show, onHide }) {
  const { axiosJWT, token, kdkppn, role } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [selectedSatker, setSelectedSatker] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");
  const [jeniskontrak, setJenisKontrak] = useState("");
  const [tahun, setTahun] = useState("");
  const [kppn, setCekKppn] = useState("");
  const [isAlasan2Visible, setIsAlasan2Visible] = useState(false);
  const [isAlasan7Visible, setIsAlasan7Visible] = useState(false);

  const handleJenisChange = (event) => {
    const selectedJenis = event.target.value;

    setJenisKontrak(selectedJenis);
  };

  const handleAlasanChange = (event) => {
    const selectedAlasan = event.target.value;
    setIsAlasan7Visible(selectedAlasan === "07");
  };
  const handleTahunChange = (event) => {
    setTahun(event.target.value);
  };

  const validationSchema = Yup.object().shape({
    tanggalPermohonan: Yup.date()
      .required("Tanggal Permohonan harus diisi")
      .max(
        Yup.ref("tanggalPersetujuan"),
        "Tanggal Permohonan tidak boleh lebih besar dari Tanggal Persetujuan"
      ),
    tanggalPersetujuan: Yup.date().required("Tanggal Persetujuan harus diisi"),
    nomorPermohonan: Yup.string().required("Nomor Permohonan harus diisi"),
    satker: Yup.string().required("Satker harus diisi"),
    alasan: Yup.string().required("Alasan harus dipilih"),
    nomorPersetujuan: Yup.string().required("Nomor Persetujuan harus diisi"),
    kppn: Yup.string().required("harus dipilih"),
    tahun: Yup.string().required("harus dipilih"),
    jeniskontrak: Yup.string().required("harus dipilih"),
    alasanLainnya: Yup.string().when("alasan", {
      is: (alasan) => alasan === "07",
      then: () => Yup.string().required("Keterangan harus diisi"),
    }),
  });

  const initialValues = {
    tanggalPermohonan: null,
    nomorPermohonan: "",
    satker: "",
    kppn: kppn,
    alasan: "",
    tanggalPersetujuan: null,
    nomorPersetujuan: "",
    jeniskontrak: jeniskontrak,
    alasanLainnya: "",
    tahun: tahun,
  };

  const handleCekKppn = (kppn) => {
    setCekKppn(kppn);
  };

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANKONTRAKKPPN,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
      // setCekKppn("");
      setSearchResults([]);
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

  const getData = async () => {
    let query = "SELECT kdsatker,nmsatker,kdkppn FROM dbref.t_satker_kppn_2025";

    if (kppn !== "000" && kppn !== "") {
      query += ` WHERE kdkppn='${kppn}'`;
    }

    const encodedQuery = encodeURIComponent(query);

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setSql(cleanedQuery);
    // console.log(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_CARISATKER
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_CARISATKER
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setIsSearching(true);

    const results = data.filter((item) => {
      const kdsatkerLowerCase = item.kdsatker.toLowerCase();
      const nmsatkerLowerCase = item.nmsatker.toLowerCase();
      // const kppnLowerCase = item.kdkppn;
      // console.log(nmsatkerLowerCase);
      if (role === "3") {
        if (item.kdkppn === kdkppn) {
          return (
            kdsatkerLowerCase.includes(value.toLowerCase()) ||
            nmsatkerLowerCase.includes(value.toLowerCase())
          );
        }
      } else {
        return (
          kdsatkerLowerCase.includes(value.toLowerCase()) ||
          nmsatkerLowerCase.includes(value.toLowerCase())
        );
      }

      return false;
    });

    const limitedResults = results.slice(0, 100);

    setSearchResults(limitedResults);
    setIsSearching(false);
  };
  // console.log(kppn);
  useEffect(() => {
    getData();
    // setSearchResults([]);
    // setSearchTerm(""); // Reset kata kunci pencarian
  }, [kppn]);

  const handleModalClose = () => {
    setSelectedSatker(null); // Reset pilihan satker
    setSearchResults([]); // Reset hasil pencarian
    setSearchTerm(""); // Reset kata kunci pencarian
    setCekKppn("");
    setIsAlasan7Visible(false);
    onHide();
    setJenisKontrak("");
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
          Rekam Dispensasi Kontrak KPPN
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ overflow: "auto", height: "auto" }}
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
                  <Col sm={3} md={3} lg={3} xl={3}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">
                        Tahun Anggaran
                      </Form.Label>
                      <Field
                        name="tahun"
                        as="select"
                        className={`form-select form-select-md text-select ${
                          touched.tahun && errors.tahun ? "is-invalid" : ""
                        }`}
                        onChange={(e) => {
                          handleChange(e);
                          handleTahunChange(e);
                        }}
                      >
                        <option value="">-- Pilih Tahun --</option>
                        <option value="2024">TA 2024</option>
                        <option value="2025">TA 2025</option>
                      </Field>
                    </Form.Group>
                  </Col>
                  <Col sm={3} md={3} lg={3} xl={3}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">
                        Jenis Dispensasi
                      </Form.Label>
                      <Field
                        name="jeniskontrak"
                        as="select"
                        className={`form-select form-select-md text-select ${
                          touched.jeniskontrak && errors.jeniskontrak
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={(e) => {
                          handleChange(e);
                          handleJenisChange(e);
                        }}
                      >
                        <option value="">-- Pilih Jenis Kontrak --</option>
                        <option value="01">Kontrak</option>
                        <option value="02">Adendum Kontrak</option>
                      </Field>
                    </Form.Group>
                  </Col>
                  <Col sm={3} md={3} lg={6} xl={6}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">KPPN</Form.Label>

                      <CekKppn
                        name="kppn"
                        as="select"
                        className={`form-control ${
                          touched.kppn && errors.kppn ? "is-invalid" : ""
                        }`}
                        onChange={(e) => {
                          handleChange(e);
                          handleCekKppn(e);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3} md={3} lg={3} xl={3}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">
                        Tanggal Permohonan
                      </Form.Label>
                      <br />
                      <DatePicker
                        name="tanggalPermohonan"
                        selected={
                          values.tanggalPermohonan
                            ? moment(values.tanggalPermohonan).toDate()
                            : null
                        }
                        onChange={(date) => {
                          setFieldValue(
                            "tanggalPermohonan",
                            moment(date).format("YYYY-MM-DD"),
                            true
                          );
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Tgl Permohonan"
                        autoComplete="off"
                        timeZone="UTC"
                        className={`form-control ${
                          touched.tanggalPermohonan && errors.tanggalPermohonan
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3} md={3} lg={9} xl={9}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">
                        Nomor Permohonan
                      </Form.Label>
                      <Field
                        name="nomorPermohonan"
                        type="text"
                        placeholder="Nomor Permohonan"
                        as={Form.Control}
                        className={`${
                          touched.nomorPermohonan && errors.nomorPermohonan
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={6} md={6} lg={12} xl={12}>
                    <Form.Group className="mb-1">
                      <Form.Label className="fw-bold">Satker</Form.Label>
                      <Select
                        name="satker"
                        style={{ cursor: "pointer" }} // Add inline style
                        value={selectedSatker}
                        onChange={(selectedOption) => {
                          setFieldValue(
                            "satker",
                            selectedOption ? selectedOption.kdsatker : ""
                          );
                          setSelectedSatker(selectedOption);
                        }}
                        options={isSearching ? [] : searchResults}
                        onInputChange={(value) => handleSearch(value)}
                        isSearchable={true}
                        getOptionValue={(option) => option.kdsatker}
                        getOptionLabel={(option) =>
                          `${option.kdsatker} - ${option.nmsatker}`
                        }
                        placeholder="Ketik Kode atau Nama Satker..."
                      />
                      <ErrorMessage
                        name="satker"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={3} md={3} lg={3} xl={3}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">
                        Tanggal Persetujuan
                      </Form.Label>
                      <br />
                      <DatePicker
                        name="tanggalPersetujuan"
                        selected={
                          values.tanggalPersetujuan
                            ? moment(values.tanggalPersetujuan).toDate()
                            : null
                        }
                        onChange={(date) => {
                          setFieldValue(
                            "tanggalPersetujuan",
                            moment(date).format("YYYY-MM-DD"),
                            true
                          );
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Tgl Persetujuan "
                        autoComplete="off"
                        timeZone="UTC"
                        className={`form-control ${
                          touched.tanggalPersetujuan &&
                          errors.tanggalPersetujuan
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </Form.Group>
                  </Col>

                  <Col sm={3} md={3} lg={9} xl={9}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">
                        Nomor Persetujuan
                      </Form.Label>
                      <Field
                        name="nomorPersetujuan"
                        onChange={handleChange}
                        type="text"
                        placeholder="Nomor Persetujuan Dispensasi"
                        as={Form.Control}
                        className={`${
                          touched.nomorPersetujuan && errors.nomorPersetujuan
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6} md={6} lg={12} xl={12}>
                    <Form.Group className="mb-1">
                      <Form.Label className="fw-bold">
                        Alasan Dispensasi
                      </Form.Label>
                      {!isAlasan2Visible && (
                        <Field
                          name="alasan"
                          as="select"
                          className={`form-select form-select-md text-select ${
                            touched.alasan && errors.alasan ? "is-invalid" : ""
                          }`}
                          onChange={(e) => {
                            handleChange(e);
                            handleAlasanChange(e);
                          }}
                        >
                          <option value="">
                            --- Pilih Alasan Dispensasi ---
                          </option>
                          <option value="01">01 - Kendala pada aplikasi</option>
                          <option value="02">
                            02 - Kendala pada pejabat perbendaharaan
                          </option>
                          <option value="03">
                            03 - Kendala pada penyedia barang/jasa
                          </option>
                          <option value="04">
                            04 - Kendala administrasi (dokumen kurang lengkap)
                          </option>
                          <option value="05">
                            05 - Kendala pada revisi DIPA/MP PNBP
                          </option>
                          <option value="06">
                            06 - Kendala jaringan dan listrik
                          </option>
                          <option value="07">07 - Lainnya</option>
                        </Field>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                {isAlasan7Visible && (
                  <Row className="modal-body-animation-enter">
                    <Col sm={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Keterangan</Form.Label>
                        <Field
                          as="textarea"
                          name="alasanLainnya"
                          placeholder="Harus diisi ketika dipilih alasan dispensasi lainnya"
                          rows="3"
                          className={`form-control  ${
                            touched.alasanLainnya && errors.alasanLainnya
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
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
