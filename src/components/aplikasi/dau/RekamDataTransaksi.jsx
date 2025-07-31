import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Card,
  Container,
  Button,
  Row,
  Form,
  Spinner,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import numeral from "numeral";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";
import moment from "moment";

import { Formik, Field, ErrorMessage } from "formik";

import Kdkriteria from "../../referensi/referensi_dau/ref_kriteria";
import RefPemotongan from "../../referensi/referensi_dau/ref_pemotongan";
import RefAkun from "../../referensi/referensi_dau/ref_akun";
import KdkmkTransaksi from "../../referensi/referensi_dau/ref_kmktransaksi";

import RefPenundaanTransaksi from "../../referensi/referensi_dau/ref_penundaan_transaksi";

const RekamDataTransaksi = ({ show, onHide, id, thang }) => {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [potong, setPotong] = useState("");
  const [akun, setAkun] = useState("");

  const [sql, setSql] = useState("");
  const [showCabutPenundaan, setShowCabutPenundaan] = useState(false);

  const [kriteria, setKriteria] = useState("");
  const [kmk, setKmk] = useState("");
  const [kdsatker, setKdsatker] = useState("");
  const [kdlokasi, setKdlokasi] = useState("");
  const [refPenundaan, setRefPenundaan] = useState("");
  const [allValues, setAllValues] = useState({});

  const handleReceiveValues = (values) => {
    setAllValues(values);
  };

  const handleAkun = (akun) => {
    setAkun(akun);
    if (
      akun === "715211" ||
      akun === "425713" ||
      akun === "425762" ||
      akun === "425823"
    ) {
      setKdsatker("977386"); // Atur nilai langsung tanpa menambahkan dengan nilai sebelumnya
      setKdlokasi("0100"); // Atur nilai langsung tanpa menambahkan dengan nilai sebelumnya
    } else if (akun === "717121" || akun === "425719") {
      setKdsatker("999302"); // Atur nilai langsung tanpa menambahkan dengan nilai sebelumnya
      setKdlokasi("0100"); // Atur nilai langsung tanpa menambahkan dengan nilai sebelumnya
    } else {
      setKdsatker("000000"); // Atur nilai langsung tanpa menambahkan dengan nilai sebelumnya
      setKdlokasi("0000"); // Atur nilai langsung tanpa menambahkan dengan nilai sebelumnya
    }
  };

  useEffect(() => {
    // Panggil fungsi handleAkun setiap kali nilai akun berubah
    handleAkun(akun);
  }, [akun]);

  useEffect(() => {
    id && getData();
    handleReceiveValues();
  }, [id]);

  const handleKMK = (kmk) => {
    setKmk(kmk);
    setAllValues({});
  };

  useEffect(() => {
    if (kmk === "1" || kmk === "4") {
      setShowCabutPenundaan(true);
    } else {
      setShowCabutPenundaan(false);
    }
    handlePenundaanKMK();
  }, [kmk]);

  useEffect(() => {
    if (kriteria === "") {
      setAllValues({});
    }
  }, [kriteria]);

  const handleKriteria = (kriteria) => {
    setKriteria(kriteria);
    setKdsatker("");
    setKdlokasi("");
    setAllValues({});
  };
  const handlePenundaanKMK = (penundaan) => {
    setRefPenundaan(penundaan);
  };

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT A.id,
      A.bulan,
      A.kdkppn,
      A.nmkppn,
      A.nmpemda,
      A.kdpemda,
      B.jenis_kmk,
      B.kriteria,
      B.kdkabkota,
      B.kdakun,
      B.nilai
      FROM 
          tkd.m_transaksi A
      left JOIN 
          tkd.detail_kmk_dau B ON A.bulan = B.bulan AND A.kdkppn = B.kdkppn
      WHERE a.id = '${id}' LIMIT 1`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);
      setLoading(false);
    }
  };
  const handleModalClose = () => {
    onHide();
    setAllValues({});
    getData();
  };

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANPENCABUTAN,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      Swal.fire({
        html: `<div className='text-success mt-4'>Data Berhasil Disimpan</div>`,
        icon: "success", // Tambahkan ikon error
        position: "top",
        buttonsStyling: false,
        customClass: {
          popup: "swal2-animation",
          container: "swal2-animation",
          confirmButton: "swal2-confirm ", // Gunakan kelas CSS kustom untuk tombol
          icon: "swal2-icon", // Gunakan kelas CSS kustom untuk ikon
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
    }

    setSubmitting(false); // Atur kembali nilai setSubmitting menjadi false
    setLoading(false);
  };

  const validationSchema = Yup.object().shape({
    jenis: Yup.string().required("Jenis KMK harus dipilih"),
    thang: Yup.string().required("thang harus terisi"),
    kriteria: Yup.string().required("kriteria harus terisi"),
    kppn: Yup.string().required("kppn harus terisi"),
    bulan: Yup.string().required("bulan harus terisi"),
    kdpemda: Yup.string().required("kdpemda harus terisi"),

    potong: Yup.string().when("jenis", {
      is: (value) => value === "1",
      then: () => Yup.string().required("kmk pemotongan harus dipilih"),
      otherwise: () => Yup.string(),
    }),

    akun: Yup.string().when("jenis", {
      is: (value) => value === "1",
      then: () => Yup.string().required("akun harus terisi"),
      otherwise: () => Yup.string(),
    }),
    nilai: Yup.number().when("jenis", {
      is: (value) => value === "1",
      then: () =>
        Yup.number()
          .required("nilai harus terisi")
          .positive("nilai harus bernilai positif")
          .integer("nilai harus merupakan bilangan bulat"),
    }),
    kdlokasi: Yup.string().when("jenis", {
      is: (value) => value === "1",
      then: () => Yup.string().required("kdlokasi harus terisi"),
    }),
    kdsatker: Yup.string().when("jenis", {
      is: (value) => value === "1",
      then: () => Yup.string().required("kdsatker harus terisi"),
    }),
    IDDATA: Yup.string().when("jenis", {
      is: (value) => value === "3",
      then: () => Yup.string().required("KMK harus dipilih"),
    }),
    BULANCABUT: Yup.string().when("jenis", {
      is: (value) => value === "3",
      then: () => Yup.number().required("Ada kendala dalam perekaman"),
    }),
  });

  const handlePotong = (potong) => {
    setPotong(potong);
  };
  const allMonthsData = [
    { databulan: "01", name: "Januari " },
    { databulan: "02", name: "Pebruari " },
    { databulan: "03", name: "Maret " },
    { databulan: "04", name: "April " },
    { databulan: "05", name: "Mei " },
    { databulan: "06", name: "Juni " },
    { databulan: "07", name: "Juli " },
    { databulan: "08", name: "Agustus " },
    { databulan: "09", name: "September " },
    { databulan: "10", name: "Oktober " },
    { databulan: "11", name: "November " },
    { databulan: "12", name: "Desember " },
  ];

  return (
    <Container>
      <Modal
        show={show}
        onHide={handleModalClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        animation={false}
        fullscreen={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>
            <i className="bi bi-box-arrow-in-up-right text-success mx-2"></i>
            Rekam Data Transaksi ID {id}
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
                  kdpemda: data[0] && data[0].kdpemda,
                  kppn: data[0] && data[0].kdkppn,
                  bulan: data[0] && data[0].bulan,
                  potong: potong,
                  akun: akun,
                  nilai: "",
                  thang: thang,
                  jenis: kmk,
                  kriteria: kriteria,
                  kdsatker: kdsatker,
                  kdlokasi: kdlokasi,
                  IDDATA: allValues && allValues.IDDATA,
                  JAN: allValues && allValues.JAN,
                  PEB: allValues && allValues.PEB,
                  MAR: allValues && allValues.MAR,
                  APR: allValues && allValues.APR,
                  MEI: allValues && allValues.MEI,
                  JUN: allValues && allValues.JUN,
                  JUL: allValues && allValues.JUL,
                  AGS: allValues && allValues.AGS,
                  SEP: allValues && allValues.SEP,
                  OKT: allValues && allValues.OKT,
                  NOV: allValues && allValues.NOV,
                  DES: allValues && allValues.DES,
                  NO_KMK: allValues && allValues.NO_KMK,
                  KMK_CABUT: allValues && allValues.KMK_CABUT,
                  BULANCABUT: allValues && allValues.BULANCABUT,
                }}
              >
                {({ handleSubmit, handleChange, values, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12} sm={12}>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip>
                              {" "}
                              KPPN {data[0] && data[0].nmkppn} PEMDA{" "}
                              {data[0] && data[0].nmpemda}
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="danger"
                            size="sm"
                            style={{ fontSize: "15px" }}
                            className="my-2 btn-block mx-2 fw-bold text-white"
                          >
                            <i className="bi bi-list-ul  mx-2 "></i>{" "}
                            {data[0] && "KPPN : " + data[0].nmkppn},{" "}
                            {data[0] && "KABKOTA : " + data[0].nmpemda}{" "}
                          </Button>
                        </OverlayTrigger>
                        <br />
                        <OverlayTrigger>
                          <Button
                            variant="success"
                            size="sm"
                            style={{ fontSize: "15px" }}
                            className="my-2 btn-block mx-2 fw-bold text-white"
                          >
                            <i className="bi bi-list-ul  mx-2 "></i>{" "}
                            {data[0] && (
                              <span>
                                Bulan:{" "}
                                {
                                  allMonthsData.find(
                                    (month) => month.databulan === data[0].bulan
                                  )?.name
                                }
                              </span>
                            )}
                          </Button>
                        </OverlayTrigger>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col sm={12} md={6} lg={6} xl={6} className="my-2">
                        <Form.Group controlId="jenis">
                          <Form.Label>Jenis KMK</Form.Label>

                          <KdkmkTransaksi
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

                      <Col sm={12} md={6} lg={6} xl={6} className={`my-2`}>
                        <Form.Group controlId="kriteria">
                          <Form.Label>Kriteria</Form.Label>
                          <Kdkriteria
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
                    {(kmk === "1" || kmk === "4") && (
                      <div
                        className={`cabut_penundaan ${
                          showCabutPenundaan ? "active" : "non-active"
                        }`}
                      >
                        <Row>
                          <Col
                            sm={12}
                            md={6}
                            lg={6}
                            xl={6}
                            className={`mt-2 mb-3`}
                          >
                            <Form.Group controlId="potong">
                              <Form.Label>Dasar KMK Potongan</Form.Label>
                              <RefPemotongan
                                kmk={kmk}
                                kriteria={kriteria}
                                name="potong"
                                onChange={(e) => {
                                  handleChange(e);
                                  handlePotong(e);
                                }}
                              />
                              <ErrorMessage
                                name="potong"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>

                          <Col sm={12} md={6} lg={6} xl={6} className={`my-2`}>
                            <Form.Group controlId="akun">
                              <Form.Label>Kode Akun</Form.Label>
                              <RefAkun
                                kmk={kmk}
                                kriteria={kriteria}
                                name="akun"
                                onChange={(e) => {
                                  handleChange(e);
                                  handleAkun(e);
                                }}
                              />
                              <ErrorMessage
                                name="akun"
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
                            className={`mt-2 mb-3`}
                          >
                            <Form.Group className="mb-1 mt-1">
                              <Form.Label className="fw-bold">
                                Nilai Potongan
                              </Form.Label>
                              <Field
                                name="nilai"
                                onChange={handleChange}
                                type="number"
                                placeholder="Nilai Potongan Harus Diisi"
                                as={Form.Control}
                              />
                              <ErrorMessage
                                name="nilai"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12} md={6} lg={6} xl={6} className={`my-2`}>
                            <Form.Group className="mb-1 mt-1">
                              <Form.Label>KDSATKER</Form.Label>
                              <Field
                                name="kdsatker"
                                value={values.kdsatker}
                                onChange={handleChange}
                                type="text"
                                as={Form.Control}
                                disabled
                              />
                              <ErrorMessage
                                name="kdsatker"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={12} md={6} lg={6} xl={6} className={`my-2`}>
                            <Form.Group className="mb-1 mt-1">
                              <Form.Label>KDLOKASI</Form.Label>
                              <Field
                                name="kdlokasi"
                                value={values.kdlokasi}
                                onChange={handleChange}
                                type="text"
                                as={Form.Control}
                                disabled
                              />
                              <ErrorMessage
                                name="kdlokasi"
                                component="div"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}
                    {kmk === "3" && (
                      <div
                        className={`cabut_penundaan2 ${
                          showCabutPenundaan ? "non-active" : ""
                        }`}
                      >
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className={`my-2`}
                          >
                            <Form.Label className="fw-bold">
                              Dasar KMK Penundaan
                            </Form.Label>
                            <RefPenundaanTransaksi
                              name="kmktunda"
                              kmk={kmk}
                              kppn={data[0] && data[0].kdkppn}
                              kdpemda={data[0] && data[0].kdpemda}
                              kriteria={kriteria}
                              setKriteria={setKriteria}
                              refPenundaan={refPenundaan}
                              sendValues={handleReceiveValues}
                              onChange={(e) => {
                                handleChange(e);
                                handlePenundaanKMK(e);
                              }}
                            />

                            <ErrorMessage
                              name="IDDATA"
                              component="div"
                              className="text-danger"
                            />
                          </Col>
                          {/* <Col
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className={`my-2`}
                          >
                            <ErrorMessage
                              name="BULANCABUT"
                              component="div"
                              className="text-danger"
                            />
                          </Col> */}
                        </Row>
                      </div>
                    )}

                    <div className="d-flex justify-content-end my-2">
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

export default RekamDataTransaksi;
