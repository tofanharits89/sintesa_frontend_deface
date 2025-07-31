import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  ModalFooter,
  FloatingLabel,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import jsonData from "../../../data/Kdsatker.json";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from "sweetalert2";
import Encrypt from "../../../auth/Random";
import moment from "moment";

export default function Rekam({ show, onHide }) {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [selectedSatker, setSelectedSatker] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");
  const [jenisspm, setJenisspm] = useState("");
  const [tahun, setTahun] = useState("");
  const [jenisdispensasi, setjenisdispensasi] = useState(false);
  const [uraian, setUraian] = useState(false);
  const [dispen, setDispen] = useState("");

  useEffect(() => {
    if (show) {
      setAnimationClass("modal-body-animation-enter");
    } else {
      setAnimationClass("modal-body-animation-exit");
    }
  }, [show]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setTahun(currentYear);
  }, []);

  const handleTahunChange = (event) => {
    const selectedTahun = event.target.value;
    setTahun(selectedTahun);
  };
  const handleAlasanChange = (event, setFieldValue) => {
    const selectedDispen = event.target.value;
    setDispen(selectedDispen);
    // Reset `alasan2` jika `dispen` bukan "07"
    if (selectedDispen !== "07") {
      setFieldValue("alasan2", ""); // Kosongkan alasan2 saat dispen bukan 07
      // setUraian(""); // Kosongkan uraian juga
    }
  };
  const handleJenisChange = (event, setFieldValue) => {
    const selectedJenis = event.target.value;
    setjenisdispensasi(selectedJenis === "" ? false : true); // Menampilkan input alasan2 jika jenis adalah "02"
    setJenisspm(selectedJenis);
    // setFieldValue("jenis", selectedJenis);
    // Jika jenis yang dipilih adalah "04", set dispen langsung ke "07" dalam Formik
    if (selectedJenis === "04" || jenisspm === "04") {
      setFieldValue("dispen", "07"); // Memastikan Formik mengenali dispen sebagai "07"
      setjenisdispensasi(true); // Menampilkan alasan jika dispen adalah "07"
    } else {
      setFieldValue("dispen", ""); // Reset dispen jika jenis bukan "04"
      // setjenisdispensasi(false);
    }
  };
  useEffect(() => {
    if (jenisspm === "04") {
      setDispen("07");
      setjenisdispensasi(true);
    } else {
      setDispen("");
      // setjenisdispensasi(false);
    }
  }, [jenisspm]);

  // console.log(dispen);
  // console.log(jenisdispensasi, jenisspm, uraian, username, kdkanwil);

  const validationSchema = Yup.object().shape({
    tahun: Yup.string().required("Tahun harus diisi"),
    jenis: Yup.string().required("Jenis harus diisi"),
    tanggalPermohonan: Yup.date().required("Tanggal Permohonan harus diisi"),
    nomorPermohonan: Yup.string().required("Nomor Permohonan harus diisi"),
    // dispen: Yup.string().required("Perihal harus diisi"),
    satker: Yup.string().required("Satker harus diisi"),
    dispen: Yup.string().required("Jenis harus dipilih"),
    alasan2: Yup.string().when("dispen", {
      is: (dispen) => dispen === "07",
      then: () => Yup.string().required("Alasan harus diisi"),
    }),
    tanggalPersetujuan: Yup.date().required("Tanggal Persetujuan harus diisi"),
    nomorPersetujuan: Yup.string().required("Nomor Persetujuan harus diisi"),
    file: Yup.mixed()
      .required("File belum dipilih")
      .test("fileSize", "Ukuran file terlalu besar (maks 2MB)", (value) => {
        if (!value) return true;
        return value.size <= 2 * 1024 * 1024;
      })
      .test(
        "fileType",
        "Hanya file berekstensi PDF yang diperbolehkan",
        (value) => {
          const allowedTypes = ["application/pdf"];
          const isValid = value && allowedTypes.includes(value.type);
          if (!isValid) {
            console.error("Invalid file type:", value ? value.type : "none");
          }
          return isValid;
        }
      ),
  });

  const initialValues = {
    tahun: tahun,
    tanggalPermohonan: null,
    nomorPermohonan: "",
    // perihal: "",
    satker: "",
    dispen: dispen,
    alasan2: "",
    jenis: jenisspm,
    tanggalPersetujuan: null,
    nomorPersetujuan: "",
    // jenisspm: jenisspm,
    cara_upload: "normal",
    file: null,
    username: username,
    kdkanwil: kdkanwil,
  };

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      if (values.jenis === "01" || values.jenis === "03") {
        await axiosJWT.post(
          import.meta.env.VITE_REACT_APP_LOCAL_SIMPANDISPENSASI,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (values.jenis === "02") {
        await axiosJWT.post(
          import.meta.env.VITE_REACT_APP_LOCAL_SIMPANKONTRAK,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (values.jenis === "04") {
        await axiosJWT.post(
          import.meta.env.VITE_REACT_APP_LOCAL_SIMPANTUP,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
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
      setLoading(false); // Move setLoading(false) here to ensure it's always set to false
      setSubmitting(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const encodedQuery = encodeURIComponent(
      `SELECT kdsatker,nmsatker,kdkanwil FROM dbref.t_satker_kppn_2025`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    //console.log(cleanedQuery);
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
  // console.log(data);
  const handleSearch = (value) => {
    setSearchTerm(value);
    setIsSearching(true);

    const results = data.filter((item) => {
      const kdsatkerLowerCase = item.kdsatker.toLowerCase();
      const nmsatkerLowerCase = item.nmsatker.toLowerCase();

      if (role === "2") {
        if (item.kdkanwil === kdkanwil) {
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
    // console.log(limitedResults);

    setIsSearching(false);
  };

  const handleModalClose = () => {
    setSelectedSatker(null); // Reset pilihan satker
    setSearchResults([]); // Reset hasil pencarian
    setSearchTerm(""); // Reset kata kunci pencarian
    setUraian(false);
    setjenisdispensasi(false);
    setJenisspm("");
    setDispen("");
    onHide();
  };
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
          Rekam Data Dispensasi TA. {tahun}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ overflow: "auto", height: "auto" }}
        className={`text-dark ${animationClass}`}
      >
        <Formik
          validationSchema={validationSchema}
          onSubmit={handleSubmitdata} // Make sure this is correct
          initialValues={initialValues}
          enableReinitialize={false}
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
                  <Col sm={6} md={6} lg={4} xl={4}>
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
                        <option value="">--- Pilih Tahun ---</option>
                        <option value="2024">TA 2024</option>
                        <option value="2025">TA 2025</option>
                      </Field>
                    </Form.Group>
                  </Col>

                  <Col sm={6} md={6} lg={8} xl={8}>
                    <Form.Group className="mb-1 mt-1">
                      <Form.Label className="fw-bold">
                        Jenis Dispensasi
                      </Form.Label>
                      <Field
                        name="jenis"
                        as="select"
                        onChange={(e) => {
                          handleChange(e);
                          handleJenisChange(e, setFieldValue);
                        }}
                        className={`form-control  ${
                          touched.jenis && errors.jenis ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">--- Pilih Jenis Dispensasi ---</option>
                        <option value="01" selected>
                          SPM BIASA
                        </option>
                        <option value="03">SPM RPATA</option>
                        <option value="02">Kontrak</option>
                        <option value="04">TUP Tunai</option>
                      </Field>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6} md={6} lg={4} xl={4}>
                    <Form.Group className="mb-1">
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
                        className="form-control"
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
                      />
                      <ErrorMessage
                        name="tanggalPermohonan"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={6} lg={8} xl={8}>
                    <Form.Group className="mb-1">
                      <Form.Label className="fw-bold">
                        Nomor Permohonan
                      </Form.Label>
                      <Field
                        name="nomorPermohonan"
                        type="text"
                        placeholder="Nomor Permohonan"
                        as={Form.Control}
                        onChange={handleChange}
                      />
                      <ErrorMessage
                        name="nomorPermohonan"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={6} md={6} lg={12} xl={12}>
                    <Form.Group className="mb-1">
                      <Form.Label className="fw-bold">Satker </Form.Label>
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
                  <Col sm={6} md={6} lg={4} xl={4}>
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
                        className="form-control"
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
                      />

                      <ErrorMessage
                        name="tanggalPersetujuan"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>

                  <Col sm={6} md={6} lg={8} xl={8}>
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
                      />
                      <ErrorMessage
                        name="nomorPersetujuan"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {jenisdispensasi &&
                  (jenisspm === "01" || jenisspm === "03") && (
                    <Row className="modal-body-animation-enter mt-3">
                      <Col sm={6} md={6} lg={12} xl={12}>
                        <Form.Group className="mb-1">
                          <Form.Label className="fw-bold">
                            Alasan Dispensasi SPM
                          </Form.Label>

                          <Field
                            name="dispen"
                            value={dispen}
                            as="select"
                            className={`form-select form-select-md text-select ${
                              touched.dispen && errors.dispen
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={(e) => {
                              handleChange(e);
                              handleAlasanChange(e);
                            }}
                          >
                            <option value="">
                              --- Pilih Alasan Dispensasi ---
                            </option>
                            <option value="01">
                              01 - Pekerjaan dalam Rangka Penanganan Bencana
                              Alam
                            </option>
                            <option value="02">
                              02 - Kondisi Kahar/Force Majeure
                            </option>
                            <option value="03">
                              03 - Pemilu/Pilkada Serentak
                            </option>
                            <option value="04">
                              04 - Kondisi Lain dibuktikan Surat Pernyatan KPA
                            </option>
                            <option value="05">
                              05 - Keterlambatan Pengajuan Tagihan atau Kurang
                              Lengkap Dokumen Tagihan oleh Penyedia
                            </option>
                            <option value="06">
                              06 - Permasalahan Pengelolaan Perbendaharaan
                            </option>
                            <option value="07">07 - Lainnya</option>
                            <option value="08">
                              08 - Proses Revisi Penghematan Belanja Perjalanan
                              Dinas
                            </option>
                          </Field>
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                {jenisdispensasi && jenisspm === "02" && (
                  <Row className="modal-body-animation-enter mt-3">
                    <Col sm={6} md={6} lg={12} xl={12}>
                      <Form.Group className="mb-1">
                        <Form.Label className="fw-bold">
                          Alasan Dispensasi Kontrak
                        </Form.Label>
                        <Field
                          name="dispen"
                          value={dispen}
                          as="select"
                          className={`form-select form-select-md text-select ${
                            touched.dispen && errors.dispen ? "is-invalid" : ""
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
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {jenisdispensasi && jenisspm === "04" && (
                  <Row className="modal-body-animation-enter mt-3">
                    <Col sm={6} md={6} lg={12} xl={12}>
                      <Form.Group className="mb-1">
                        <Field
                          name="dispen"
                          value={values.jenis === "04" ? "07" : values.dispen}
                          as="select"
                          className={`form-select form-select-md text-select ${touched.dispen && errors.dispen ? "is-invalid" : ""}`}
                          onChange={(e) => {
                            handleChange(e);
                            handleAlasanChange(e);
                          }}
                        >
                          <option value="07">
                            Isikan Alasan Dispensasi TUP
                          </option>
                        </Field>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                {dispen === "07" && jenisdispensasi && (
                  <Row className="modal-body-animation-enter mt-3">
                    <Col sm={6} md={6} lg={12} xl={12}>
                      <FloatingLabel
                        controlId="alasan2"
                        label="Isikan alasan di sini "
                        className="mt-0 "
                      >
                        <Form.Control
                          name="alasan2"
                          as="textarea"
                          placeholder="Isikan alasan di sini "
                          style={{ height: "100px" }}
                          // onChange={handleChange}
                          onChange={(alasan2) => {
                            handleChange(alasan2, setFieldValue);
                            // handleAlasanChange(e);
                          }}
                          className={`form-control  ${
                            touched.alasan2 && errors.alasan2
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                )}
                <Row className="modal-body-animation-enter mt-3">
                  <Col sm={12} md={12} lg={12} xl={12}>
                    <Form.Group controlId="file">
                      <Form.Label className="fw-bold">
                        File Surat Persetujuan (File PDF Maks. 2MB)
                      </Form.Label>
                      <input
                        className={`form-control ${
                          touched.file && errors.file ? "is-invalid" : ""
                        }`}
                        type="file"
                        name="file"
                        accept=".pdf"
                        onChange={(e) =>
                          setFieldValue("file", e.target.files[0])
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="danger"
                  className="mt-3 mb-3"
                  disabled={loading} // Disable the button when loading is true
                >
                  {loading ? ( // Change button text based on the loading state
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
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
