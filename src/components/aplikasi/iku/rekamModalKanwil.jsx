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
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import { Formik } from "formik";
import NotifikasiSukses from "../notifikasi/notifsukses";
import { handleHttpError } from "../notifikasi/toastError";

export default function RekamModalKanwil({ show, onHide, kirim }) {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    ringkasan2: Yup.number()
      .required("Ringkasan Eksekutif harus diisi")
      .max(100, "Nilai maksimal 100")
      .typeError("Ringkasan Eksekutif harus berupa angka"),
    penyusunan2: Yup.number()
      .required("Kesesuaian harus diisi")
      .max(100, "Nilai maksimal 100")
      .typeError("Kesesuaian harus berupa angka"),
    metode2: Yup.number()
      .required("Metode harus diisi")
      .max(100, "Nilai maksimal 100")
      .typeError("Metode harus berupa angka"),
    kesimpulan2: Yup.number()
      .required("Nilai Kesimpulan harus diisi")
      .typeError("Nilai Kesimpulan harus berupa angka")
      .min(50, "Nilai Kesimpulan harus lebih besar atau sama dengan 50")
      .max(98, "Nilai Kesimpulan harus kurang dari atau sama dengan 98"),
    kualitasdf2: Yup.number()
      .required("DAK Fisik harus diisi")
      .typeError("DAK Fisik harus berupa angka")
      .min(50, "Nilai DAK Fisik harus lebih besar atau sama dengan 50")
      .max(98, "Nilai DAK Fisik harus kurang dari atau sama dengan 98"),

    kualitasbos2: Yup.number()
      .required("Dana BOS harus diisi")
      .typeError("Dana BOS harus berupa angka")
      .min(50, "Nilai Dana BOS harus lebih besar atau sama dengan 50")
      .max(98, "Nilai Dana BOS harus kurang dari atau sama dengan 98"),
    kualitasdd2: Yup.number()
      .required("Dana Desa harus diisi")
      .typeError("Dana Desa harus berupa angka")
      .min(50, "Nilai Dana Desa harus lebih besar atau sama dengan 50")
      .max(98, "Nilai Dana Desa harus kurang dari atau sama dengan 98"),
  });
  // console.log(kirim);
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      size="xl"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h6 className="text-success">
            Input Nilai Analisa Laporan Monev Kanwil Semester {kirim[0].periode}{" "}
            TA. {kirim[0].thang} [Analisa {kirim[0].analisa}]
          </h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <span className="my-1 text-success">KANWIL {kirim[0].nmkanwil}</span>

          <Formik
            initialValues={{
              ringkasan2:
                kirim[0].analisa === "I"
                  ? kirim[1].ringkasan
                  : kirim[2].ringkasan,
              penyusunan2:
                kirim[0].analisa === "I"
                  ? kirim[1].penyusunan
                  : kirim[2].penyusunan,
              metode2:
                kirim[0].analisa === "I" ? kirim[1].metode : kirim[2].metode,
              kualitasdf2:
                kirim[0].analisa === "I"
                  ? kirim[1].kualitasdf
                  : kirim[2].kualitasdf,
              kualitasbos2:
                kirim[0].analisa === "I"
                  ? kirim[1].kualitasbos
                  : kirim[2].kualitasbos,
              kualitasdd2:
                kirim[0].analisa === "I"
                  ? kirim[1].kualitasdd
                  : kirim[2].kualitasdd,
              kesimpulan2:
                kirim[0].analisa === "I"
                  ? kirim[1].kesimpulan
                  : kirim[2].kesimpulan,
              ket: kirim[0].analisa === "I" ? kirim[1].ket : kirim[2].ket,
              periode: kirim[0].periode,
              thang: kirim[0].thang,
              kdkanwil: kirim[0].kdkanwil,
              analisa: kirim[0].analisa,
              username: username,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setLoading(true);
              try {
                const response = await axiosJWT.post(
                  import.meta.env.VITE_REACT_APP_LOCAL_SIMPANIKU,
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
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRingkasan">
                  <FloatingLabel
                    controlId="floatingRingkasan"
                    label="Penyajian Ringkasan Eksekutif"
                    className="mt-2 text-bold"
                  >
                    <Form.Control
                      type="number"
                      name="ringkasan2"
                      autoComplete="off"
                      placeholder="Nilai Penyajian Ringkasan Eksekutif"
                      className="my-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.ringkasan2}
                      isInvalid={touched.ringkasan2 && !!errors.ringkasan2}
                    />
                    {touched.ringkasan2 && errors.ringkasan2 && (
                      <div className="text-danger">{errors.ringkasan2}</div>
                    )}
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formPenyusunan">
                  <FloatingLabel
                    controlId="floatingPenyusunan"
                    label="Kesesuaian Latar Belakang, Tujuan dan Manfaat Pemantauan ..."
                    className="text-bold"
                  >
                    <Form.Control
                      type="number"
                      name="penyusunan2"
                      autoComplete="off"
                      className="my-2"
                      placeholder="Kesesuaian Latar Belakang, Tujuan dan Manfaat Pemantauan ..."
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.penyusunan2}
                      isInvalid={touched.penyusunan2 && !!errors.penyusunan2}
                    />
                    {touched.penyusunan2 && errors.penyusunan2 && (
                      <div className="text-danger">{errors.penyusunan2}</div>
                    )}
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formMetode">
                  <FloatingLabel
                    controlId="floatingMetode"
                    label="Metode Analisis dan Sistematika Penyajian"
                    className="text-bold"
                  >
                    <Form.Control
                      type="number"
                      name="metode2"
                      autoComplete="off"
                      placeholder="Nilai Metode Analisis dan Sistematika Penyajian"
                      className="my-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.metode2}
                      isInvalid={touched.metode2 && !!errors.metode2}
                    />
                    {touched.metode2 && errors.metode2 && (
                      <div className="text-danger">{errors.metode2}</div>
                    )}
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formKualitas">
                  <Form.Label className="text-bold">
                    &nbsp; Kualitas Pemaparan Objek Analisis dan Kendala
                  </Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        name="kualitasdf2"
                        min="50"
                        max="98"
                        autoComplete="off"
                        placeholder="DAK Fisik"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.kualitasdf2}
                      />
                    </Col>

                    <Col>
                      <Form.Control
                        type="number"
                        name="kualitasbos2"
                        min="50"
                        max="98"
                        autoComplete="off"
                        placeholder="Dana BOS"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.kualitasbos2}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        name="kualitasdd2"
                        min="50"
                        max="98"
                        autoComplete="off"
                        placeholder="Dana Desa"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.kualitasdd2}
                      />
                    </Col>
                  </Row>
                  {touched.kualitasdf2 && errors.kualitasdf2 && (
                    <div className="text-danger my-2">{errors.kualitasdf2}</div>
                  )}
                  {touched.kualitasdd2 && errors.kualitasdd2 && (
                    <div className="text-danger my-2">{errors.kualitasdd2}</div>
                  )}
                  {touched.kualitasbos2 && errors.kualitasbos2 && (
                    <div className="text-danger my-2">
                      {errors.kualitasbos2}
                    </div>
                  )}
                </Form.Group>

                <Form.Group controlId="formKesimpulan">
                  <FloatingLabel
                    controlId="floatingKesimpulan"
                    label="Kesimpulan dan Rekomendasi"
                    className="text-bold my-2"
                  >
                    <Form.Control
                      type="number"
                      name="kesimpulan2"
                      min="50"
                      max="98"
                      className="my-2"
                      placeholder="Nilai Kesimpulan dan Rekomendasi"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.kesimpulan2}
                      isInvalid={touched.kesimpulan2 && !!errors.kesimpulan2}
                    />
                    {touched.kesimpulan2 && errors.kesimpulan2 && (
                      <div className="text-danger">{errors.kesimpulan2}</div>
                    )}
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formKet">
                  <FloatingLabel
                    controlId="floatingKet"
                    label="Keterangan Penilaian"
                    className="text-bold"
                  >
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="ket"
                      placeholder="Keterangan Penilaian"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.ket}
                      isInvalid={touched.ket && !!errors.ket}
                    />
                    {touched.ket && errors.ket && (
                      <div className="text-danger">{errors.ket}</div>
                    )}
                  </FloatingLabel>
                </Form.Group>

                <Button
                  variant="danger"
                  type="submit"
                  className="my-4 float-right"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
