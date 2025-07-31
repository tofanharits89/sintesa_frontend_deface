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
import RefPenundaanCabut from "../../referensi/referensi_dau/ref_penundaan_fromcabut";
import DataKmkCabut from "./dataKmkCabut";
import moment from "moment";

const RekamKMKModalCabut = ({ show, onHide }) => {
  const { axiosJWT, token, kdkanwil, role } = useContext(MyContext);
  const [cek, setCek] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refPenundaan, setRefPenundaan] = useState("");

  const handlePenundaanKMK = (penundaan) => {
    setRefPenundaan(penundaan);
  };

  const handleModalClose = () => {
    onHide();
    setCek(true);
    setRefPenundaan("");
  };
  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);
    setCek(false);
    try {
      //  console.log(values);
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANKMKCABUT,
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
      setCek(true);
    } catch (error) {
      console.log(error);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
      setSubmitting(false);
    }
  };
  const validationSchema = Yup.object().shape({
    tunda: Yup.string().required("KMK Penundaan harus dipilih"),
    thang: Yup.string()
      .required("Tahun harus diisi")
      .matches(
        /^(202[3-9]|20[3-9][0-9])$/,
        "Tahun minimal 2023 dan harus berupa angka"
      ),
    nomorkmk1: Yup.string().required("harus diisi"),
    tglkmk1: Yup.string().required("harus diisi"),
    uraian1: Yup.string().required("harus diisi"),
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
            KMK Pencabutan
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
                  tunda: refPenundaan,
                  thang: "",
                  nomorkmk1: "",
                  tglkmk1: "",
                  uraian1: "",
                }}
              >
                {({ handleSubmit, handleChange, values, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col sm={12} md={12} lg={12} xl={12} className={`mt-2`}>
                        <Form.Group controlId="tunda">
                          <Form.Label>Dasar Penundaan</Form.Label>
                          <RefPenundaanCabut
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
                      <Col sm={12} md={12} lg={2} xl={2} className={`mt-2`}>
                        <Form.Group controlId="thang">
                          <Form.Label>Tahun</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Tahun"
                            name="thang"
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                          <ErrorMessage
                            name="thang"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={12} lg={7} xl={7} className={`mt-2`}>
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
                      </Col>
                      <Col sm={12} md={12} lg={3} xl={3} className={`mt-2`}>
                        <Form.Group controlId="tglkmk1">
                          <Form.Label>Tgl KMK</Form.Label> <br />
                          <DatePicker
                            name="tglkmk1"
                            selected={
                              values.tglkmk1
                                ? moment(values.tglkmk1).toDate()
                                : null
                            }
                            onChange={(date) => {
                              setFieldValue(
                                "tglkmk1",
                                moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                                true
                              );
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Tgl ND/ KMK"
                            autoComplete="off"
                            timeZone="UTC"
                          />
                          <ErrorMessage
                            name="tglkmk1"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={12} lg={12} xl={12} className={`mt-2`}>
                        <Form.Label>Uraian KMK</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Uraian ND/ KMK"
                          name="uraian1"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />
                        <ErrorMessage
                          name="uraian1"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end my-4">
                      <Button
                        type="submit"
                        variant="danger"
                        size="sm"
                        disabled={loading}
                        style={{ width: "100px" }}
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
                        size="sm"
                        onClick={handleModalClose}
                        style={{ width: "100px" }}
                      >
                        Tutup
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <DataKmkCabut cek={cek} />
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RekamKMKModalCabut;
