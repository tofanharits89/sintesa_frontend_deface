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
import CekKppn from "../uploadkppn/cek_Kppn";

const Modal_proyeksi = ({ show, onHide, setRefresh }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [tahun, setTahun] = useState("");
  const [kppn, setCekKppn] = useState("");
  const [jenis, setJenis] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [periode, setPeriode] = useState("");
  const [januari, setJanuari] = useState("");
  const [februari, setFebruari] = useState("");
  const [maret, setMaret] = useState("");
  const [april, setApril] = useState("");
  const [mei, setMei] = useState("");
  const [juni, setJuni] = useState("");
  const [juli, setJuli] = useState("");
  const [agustus, setAgustus] = useState("");
  const [september, setSeptember] = useState("");
  const [oktober, setOktober] = useState("");
  const [november, setNovember] = useState("");
  const [desember, setDesember] = useState("");

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);
    // console.log(values);
    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANPROYEKSI,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      NotifikasiSukses("Data Berhasil Disimpan");
      setRefresh(true);
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
    tahun: Yup.string().required("harus dipilih"),
    kppn: Yup.string().required("harus dipilih"),
    jenis: Yup.string().required(" harus dipilih"),
    keperluan: Yup.string().required("harus dipilih"),
    periode: Yup.string().required("harus dipilih"),

    januari: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    februari: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    maret: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    april: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    mei: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    juni: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    juli: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    agustus: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    september: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    oktober: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    november: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
    desember: Yup.number()
      .nullable()
      .typeError("Harus berupa angka")
      .min(0, "Harus berupa angka non-negatif atau nol")
      .integer("Harus berupa angka bulat")
      .required("Harus diisi"),
  });

  const handleCekKppn = (kppn) => {
    setCekKppn(kppn);
  };

  const tutupModal = () => {
    onHide();
    setCekKppn("");

    setJenis("");
  };

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
            <i className="bi bi-back text-success mx-3"></i>
            Rekam Data Proyeksi
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
                  kppn: kppn,

                  jenis: jenis,
                  keperluan: keperluan,
                  periode: periode,
                  januari: januari,
                  februari: februari,
                  maret: maret,
                  april: april,
                  mei: mei,
                  juni: juni,
                  juli: juli,
                  agustus: agustus,
                  september: september,
                  oktober: oktober,
                  november: november,
                  desember: desember,

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
                        <Form.Group controlId="kppn">
                          <Form.Label>KPPN/ Satker</Form.Label>
                          <CekKppn
                            name="kppn"
                            kppn={kppn}
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
                      <Col sm={12} md={4} lg={4} xl={4} className={`mt-2 mb-3`}>
                        <Form.Group controlId="inputPeriode">
                          <Form.Label>Periode Bulan</Form.Label>
                          <Form.Select
                            value={periode}
                            name="periode"
                            onChange={(e) => {
                              setPeriode(e.target.value);
                              handleChange(e);
                            }}
                            aria-label="Pilih Jenis"
                          >
                            <option value="">Pilih Periode</option>
                            <option value="01">Januari</option>
                            <option value="02">Februari</option>
                            <option value="03">Maret</option>
                            <option value="04">April</option>
                            <option value="05">Mei</option>
                            <option value="06">Juni</option>
                            <option value="07">Juli</option>
                            <option value="08">Agustus</option>
                            <option value="09">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                          </Form.Select>
                          <ErrorMessage
                            name="periode"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={4} lg={4} xl={4} className={`mt-2 mb-3`}>
                        <Form.Group controlId="inputKeperluan">
                          <Form.Label>Keperluan</Form.Label>
                          <Form.Select
                            value={keperluan}
                            name="keperluan"
                            onChange={(e) => {
                              setKeperluan(e.target.value);
                              handleChange(e);
                            }}
                            aria-label="Pilih Jenis"
                          >
                            <option value="">Pilih Jenis Keperluan</option>
                            <option value="ALCO">ALCO</option>
                            <option value="IKU">IKU</option>
                          </Form.Select>
                          <ErrorMessage
                            name="keperluan"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={4} lg={4} xl={4} className={`mt-2 mb-3`}>
                        <Form.Group controlId="inputJenis">
                          <Form.Label>Jenis Laporan</Form.Label>
                          <Form.Select
                            value={jenis}
                            name="jenis"
                            onChange={(e) => {
                              setJenis(e.target.value);
                              handleChange(e);
                            }}
                            aria-label="Pilih Jenis"
                          >
                            <option value="">Pilih Jenis Laporan</option>
                            <option value="01">01 - DAU</option>
                            <option value="02">02 - DBH</option>
                            <option value="03">03 - DAK Fisik</option>
                            <option value="04">04 - Dana Desa</option>
                            <option value="05">05 - DAK Non Fisik</option>
                            <option value="06">06 - Hibah</option>
                            <option value="07">07 - Otsus</option>
                            <option value="08">08 - Dana Istimewa DIY</option>
                            <option value="09">09 - Insentif Fiskal</option>
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
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Januari</Form.Label>
                        <Form.Control
                          type="number"
                          value={januari}
                          name="januari"
                          onChange={(e) => {
                            handleChange(e);
                            setJanuari(e.target.value);
                          }}
                          placeholder="nilai januari"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="januari"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Februari</Form.Label>
                        <Form.Control
                          type="number"
                          value={februari}
                          name="februari"
                          onChange={(e) => {
                            setFebruari(e.target.value);
                          }}
                          placeholder="nilai februari"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="februari"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Maret</Form.Label>
                        <Form.Control
                          type="number"
                          value={maret}
                          name="maret"
                          onChange={(e) => {
                            setMaret(e.target.value);
                          }}
                          placeholder="nilai maret"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="maret"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>April</Form.Label>
                        <Form.Control
                          type="number"
                          value={april}
                          name="april"
                          onChange={(e) => {
                            setApril(e.target.value);
                          }}
                          placeholder="nilai april"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="april"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Mei</Form.Label>
                        <Form.Control
                          type="number"
                          value={mei}
                          name="mei"
                          onChange={(e) => {
                            setMei(e.target.value);
                          }}
                          placeholder="nilai mei"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="mei"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Juni</Form.Label>
                        <Form.Control
                          type="number"
                          value={juni}
                          name="juni"
                          onChange={(e) => {
                            setJuni(e.target.value);
                          }}
                          placeholder="nilai juni"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="juni"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Juli</Form.Label>
                        <Form.Control
                          type="number"
                          value={juli}
                          name="juli"
                          onChange={(e) => {
                            setJuli(e.target.value);
                          }}
                          placeholder="nilai juli"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="juli"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Agustus</Form.Label>
                        <Form.Control
                          type="number"
                          value={agustus}
                          name="agustus"
                          onChange={(e) => {
                            setAgustus(e.target.value);
                          }}
                          placeholder="nilai agustus"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="agustus"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>September</Form.Label>
                        <Form.Control
                          type="number"
                          value={september}
                          name="september"
                          onChange={(e) => {
                            setSeptember(e.target.value);
                          }}
                          placeholder="nilai september"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="september"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Oktober</Form.Label>
                        <Form.Control
                          type="number"
                          value={oktober}
                          name="oktober"
                          onChange={(e) => {
                            setOktober(e.target.value);
                          }}
                          placeholder="nilai oktober"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="oktober"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>November</Form.Label>
                        <Form.Control
                          type="number"
                          value={november}
                          name="november"
                          onChange={(e) => {
                            setNovember(e.target.value);
                          }}
                          placeholder="nilai november"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="november"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col sm={12} md={6} lg={3} xl={3} className={`mt-2 mb-3`}>
                        <Form.Label>Desember</Form.Label>
                        <Form.Control
                          type="number"
                          value={desember}
                          name="desember"
                          onChange={(e) => {
                            setDesember(e.target.value);
                          }}
                          placeholder="nilai desember"
                          aria-label="Periode Laporan"
                        />
                        <ErrorMessage
                          name="desember"
                          component="div"
                          className="text-danger"
                        />
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
                        <Form.Label>Keterangan</Form.Label>
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
                            placeholder="Keterangan "
                            style={{ height: "100px" }}
                          />
                        </FloatingLabel>
                        <ErrorMessage
                          name="uraian"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                    </Row>
                    <Row>
                      {" "}
                      <Col
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                        className={`mt-2 mb-3`}
                      >
                        {" "}
                        <div>
                          <p className="mt-2" style={{ fontSize: "20px" }}>
                            {currentDateTime.toLocaleTimeString("id-ID")}{" "}
                          </p>
                          <p style={{ fontSize: "15px" }}>
                            Waktu Server (GMT +7)
                          </p>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-between my-4 align-items-bottom">
                      <hr />
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

export default Modal_proyeksi;
