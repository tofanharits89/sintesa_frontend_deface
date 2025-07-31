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

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { handleHttpError } from "../notifikasi/toastError";
import NotifikasiSukses from "../notifikasi/notifsukses";

import Subperiode from "./cek_subperiode";
import CekKanwil from "./cek_Kanwil";

const ModalMonev = ({ show, onHide }) => {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [tahun, setTahun] = useState("2023"); // Use state to manage the value
  const [kanwil, setCekKanwil] = useState("");
  const [periode, setPeriode] = useState("");
  const [subperiode, setsubPeriode] = useState("");
  const [jenis, setJenis] = useState("");

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_UPLOADKANWIL,
        values,
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      NotifikasiSukses("Laporan Berhasil Disimpan");
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
    }
    setSubmitting(false);
  };

  const validationSchema = Yup.object().shape({
    tahun: Yup.string().required("Tahun harus dipilih"),
    kanwil: Yup.string().required("kanwil harus dipilih"),
    jenis: Yup.string().required("Jenis laporan harus dipilih"),
    periode: Yup.string().required("Periode harus dipilih"),

    subperiode: Yup.string().when("jenis", {
      is: (jenis) => jenis === "01",
      then: () => Yup.string().required("Subperiode harus diisi"),
    }),
    file: Yup.mixed()
      .required("File laporan harus dipilih")
      .test("fileSize", "Ukuran file terlalu besar (maks 10MB)", (value) => {
        if (!value) return true;
        return value.size <= 10000000;
      })
      .test(
        "fileType",
        "Tipe file tidak valid (hanya ZIP atau RAR)",
        (value) => {
          if (!value) return true;
          const allowedExtensions = ["zip", "rar"];
          const fileName = value.name.toLowerCase();
          return allowedExtensions.some((ext) => fileName.endsWith(`.${ext}`));
        }
      ),
  });

  const handleCekKanwil = (kanwil) => {
    setCekKanwil(kanwil);
  };

  useEffect(() => {
    if (periode === "") {
      setsubPeriode("");
    }
  }, [periode]);

  useEffect(() => {
    if (subperiode === "") {
      setPeriode("");
    }
  }, [subperiode]);

  useEffect(() => {
    setsubPeriode("");
    setPeriode("");
  }, [jenis]);

  const tutupModal = () => {
    onHide();
    setCekKanwil("");
    setPeriode("");
    setsubPeriode("");
    setJenis("");
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentDateTime(new Date());
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <Container fluid>
      <Modal
        show={show}
        onHide={tutupModal}
        backdrop="static"
        keyboard={false}
        size="xl"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>
            <i className="bi bi-back text-danger mx-3"></i>
            Upload Laporan Monev Kanwil {tahun && `TA. ${tahun}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body className="my-4 mx-4 ">
              <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmitdata}
                enableReinitialize={true}
                initialValues={{
                  tahun: tahun,
                  kanwil: kanwil,
                  periode: periode,
                  subperiode: subperiode,
                  jenis: jenis,
                  file: "",
                  uraian: "",
                  username: username,
                }}
              >
                {({ handleSubmit, handleChange, values, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col sm={12} md={6} lg={6} xl={6} className="mt-2 mb-3">
                        <Form.Group controlId="inputName5">
                          <Form.Label>Tahun</Form.Label>
                          <Form.Select
                            value={tahun}
                            name="tahun"
                            onChange={(e) => {
                              setTahun(e.target.value); // Assuming setTahun is the state updater function
                              handleChange(e);
                            }}
                            aria-label="Pilih Tahun"
                          >
                            <option value="">Pilih Tahun</option>
                            {/* <option value="2023">2023</option> */}
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                          </Form.Select>
                          <ErrorMessage
                            name="tahun"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={6} className={`mt-2 mb-3`}>
                        <Form.Group controlId="kanwil">
                          <Form.Label>Kanwil</Form.Label>
                          <CekKanwil
                            name="kanwil"
                            kanwil={kanwil}
                            as="select" // Mengganti input text dengan elemen select
                            className="form-select form-select-md text-select"
                            onChange={(e) => {
                              handleChange(e);
                              handleCekKanwil(e);
                            }}
                          />
                          <ErrorMessage
                            name="kanwil"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={12} className={`mt-2 mb-3`}>
                        <Form.Group controlId="inputName5">
                          <Form.Label>Jenis Laporan</Form.Label>
                          <Form.Select
                            value={jenis}
                            name="jenis"
                            onChange={(e) => {
                              setJenis(e.target.value); // Assuming setTahun is the state updater function
                              handleChange(e);
                            }}
                            aria-label="Pilih Jenis"
                          >
                            <option value="">Pilih Jenis Laporan</option>
                            <option value="02">Laporan Monev</option>
                          </Form.Select>
                          <ErrorMessage
                            name="jenis"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={12} className={`mt-2 mb-3`}>
                        <Form.Label>Periode Laporan</Form.Label>
                        <Form.Select
                          value={periode}
                          name="periode"
                          onChange={(e) => {
                            handleChange(e);
                            setPeriode(e.target.value);
                          }}
                          aria-label="Periode Laporan"
                        >
                          <option value="">-- Pilih Periode--</option>
                          {jenis === "02" && (
                            <>
                              <option key="0201" value="0201">
                                Semester I
                              </option>
                              <option key="0202" value="0202">
                                Semester II
                              </option>
                            </>
                          )}
                        </Form.Select>
                        <ErrorMessage
                          name="periode"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                        className={`mt-2 mb-3`}
                      >
                        <Form.Label>Uraian</Form.Label>
                        <FloatingLabel
                          controlId="uraian"
                          label="Uraian "
                          className="mt-0"
                        >
                          <Form.Control
                            name="uraian"
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            as="textarea"
                            placeholder="Uraian "
                            style={{ height: "100px" }}
                          />
                        </FloatingLabel>
                        <ErrorMessage
                          name="uraian"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                        className={`mt-2 mb-3`}
                      >
                        <Form.Group controlId="file">
                          <Form.Label>File </Form.Label>
                          <input
                            className="form-control"
                            type="file"
                            name="file"
                            accept=".zip,.rar"
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

                    <div className="d-flex justify-content-between align-items-bottom">
                      <div className="fw-bold">
                        Waktu Server (GMT +7){" "}
                        {currentDateTime.toLocaleTimeString("id-ID")}
                      </div>
                      <div>
                        <Button
                          type="submit"
                          variant="danger"
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
                          onClick={tutupModal}
                        >
                          Tutup
                        </Button>
                      </div>
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

export default ModalMonev;
