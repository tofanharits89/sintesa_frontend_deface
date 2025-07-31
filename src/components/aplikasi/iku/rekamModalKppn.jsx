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

export default function RekamModalKppn({ show, onHide, kirim }) {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    sahlengkap: Yup.number()
      .required(" harus diisi")
      .min(0, "Nilai harus lebih besar atau sama dengan 0")
      .max(10, "Nilai harus kurang dari atau sama dengan 10"),
    sahsesuai: Yup.number()
      .required(" harus diisi")
      .min(0, "Nilai harus lebih besar atau sama dengan 0")
      .max(10, "Nilai harus kurang dari atau sama dengan 10"),
    jelaslengkap: Yup.number()
      .required(" harus diisi")
      .min(0, "Nilai harus lebih besar atau sama dengan 0")
      .max(10, "Nilai harus kurang dari atau sama dengan 10"),
    jelassesuai: Yup.number()
      .required(" harus diisi")
      .min(0, "Nilai harus lebih besar atau sama dengan 0")
      .max(10, "Nilai harus kurang dari atau sama dengan 10"),
    calklengkap: Yup.number()
      .required(" harus diisi")
      .typeError(" harus berupa angka")
      .min(0, "Nilai CAL harus lebih besar atau sama dengan 0")
      .max(10, "Nilai CAL harus kurang dari atau sama dengan 10"),
    calksesuai: Yup.number()
      .required(" harus diisi")
      .typeError(" harus berupa angka")
      .min(0, "Nilai CAL harus lebih besar atau sama dengan 0")
      .max(30, "Nilai CAL harus kurang dari atau sama dengan 30"),
    tabellengkap: Yup.number()
      .required(" harus diisi")
      .typeError(" harus berupa angka")
      .min(0, "Nilai Tabel harus lebih besar atau sama dengan 0")
      .max(5, "Nilai Tabel harus kurang dari atau sama dengan 5"),
    tabelsesuai: Yup.number()
      .required(" harus diisi")
      .typeError(" harus berupa angka")
      .min(0, "Nilai Tabel harus lebih besar atau sama dengan 0")
      .max(10, "Nilai Tabel harus kurang dari atau sama dengan 10"),
    lamplengkap: Yup.number()
      .required(" harus diisi")
      .typeError(" harus berupa angka")
      .min(0, "Nilai Lampiran harus lebih besar atau sama dengan 0")
      .max(7, "Nilai Lampiran harus kurang dari atau sama dengan 7"),
    lampsesuai: Yup.number()
      .required(" harus diisi")
      .typeError(" berupa angka")
      .min(0, "Nilai Lampiran harus lebih besar atau sama dengan 0")
      .max(8, "Nilai Lampiran harus kurang dari atau sama dengan 8"),
    username: Yup.string().required("Username harus diisi"),
    kdkppn: Yup.string().required("KPPN harus diisi"),
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
            Input Nilai Analisa Laporan Keuangan Jenis {kirim[0].periode} TA.{" "}
            {kirim[0].thang}
          </h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <span className="my-1 text-success">KPPN {kirim[0].nmkppn}</span>

          <Formik
            initialValues={{
              jelaslengkap: "",
              jelassesuai: "",
              sahlengkap: "",
              sahsesuai: "",
              calklengkap: "",
              calksesuai: "",
              tabellengkap: "",
              tabelsesuai: "",
              lamplengkap: "",
              lampsesuai: "",
              username: username,
              kdkppn: kirim && kirim[0].kdkppn,
              thang: kirim && kirim[0].thang,
              periode: kirim && kirim[0].periode,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setLoading(true);
              try {
                const response = await axiosJWT.post(
                  import.meta.env.VITE_REACT_APP_LOCAL_SIMPANIKU_KPPN,
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
                <div className="form-group row">
                  <div className="col-sm-6 my-2">
                    <label htmlFor="sahlengkap" className="text-primary my-2">
                      <i className="fas fa-arrow-circle-right text-danger"></i>{" "}
                      Pengesahan
                    </label>

                    <select
                      className="form-control "
                      name="sahlengkap"
                      id="sahlengkap"
                      value={values.sahlengkap}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" disabled selected>
                        -- Pilih --
                      </option>
                      {[...Array(6)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.sahlengkap && touched.sahlengkap && (
                      <div className="text-danger">{errors.sahlengkap}</div>
                    )}
                  </div>
                  <div className="col-sm-6 my-2">
                    <label className="my-2">&nbsp;</label>
                    <select
                      className="form-control"
                      name="sahsesuai"
                      id="sahsesuai"
                      value={values.sahsesuai}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" disabled selected>
                        -- Pilih --
                      </option>
                      {[...Array(11)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.sahsesuai && touched.sahsesuai && (
                      <div className="text-danger">{errors.sahsesuai}</div>
                    )}
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-6 my-2">
                    <label htmlFor="jelaslengkap" className="text-primary my-2">
                      <i className="fas fa-arrow-circle-right text-danger"></i>{" "}
                      Penjelasan
                    </label>
                    <select
                      className={`form-control ${
                        errors.jelaslengkap && touched.jelaslengkap
                          ? "is-invalid"
                          : ""
                      }`}
                      name="jelaslengkap"
                      id="jelaslengkap"
                      value={values.jelaslengkap}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" selected>
                        -- Pilih --
                      </option>
                      {[...Array(6)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.jelaslengkap && touched.jelaslengkap && (
                      <div className="invalid-feedback">
                        {errors.jelaslengkap}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 my-2">
                    <label className="my-2">&nbsp;</label>
                    <select
                      className={`form-control ${
                        errors.jelassesuai && touched.jelassesuai
                          ? "is-invalid"
                          : ""
                      }`}
                      name="jelassesuai"
                      id="jelassesuai"
                      value={values.jelassesuai}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" selected>
                        -- Pilih --
                      </option>
                      {[...Array(11)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.jelassesuai && touched.jelassesuai && (
                      <div className="invalid-feedback">
                        {errors.jelassesuai}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-sm-6 my-2">
                    <label htmlFor="tabellengkap" className="text-primary my-2">
                      <i className="fas fa-arrow-circle-right text-danger"></i>{" "}
                      Tabel
                    </label>
                    <select
                      className={`form-control ${
                        errors.tabellengkap && touched.tabellengkap
                          ? "is-invalid"
                          : ""
                      }`}
                      name="tabellengkap"
                      id="tabellengkap"
                      value={values.tabellengkap}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" selected>
                        -- Pilih --
                      </option>
                      {[...Array(6)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.tabellengkap && touched.tabellengkap && (
                      <div className="invalid-feedback">
                        {errors.tabellengkap}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 my-2">
                    <label className="my-2">&nbsp;</label>
                    <select
                      className={`form-control ${
                        errors.tabelsesuai && touched.tabelsesuai
                          ? "is-invalid"
                          : ""
                      }`}
                      name="tabelsesuai"
                      id="tabelsesuai"
                      value={values.tabelsesuai}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" selected>
                        -- Pilih --
                      </option>
                      {[...Array(11)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.tabelsesuai && touched.tabelsesuai && (
                      <div className="invalid-feedback">
                        {errors.tabelsesuai}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-sm-6 my-2">
                    <label htmlFor="calklengkap" className="text-primary my-2">
                      <i className="fas fa-arrow-circle-right text-danger"></i>{" "}
                      CALK
                    </label>
                    <select
                      className={`form-control ${
                        errors.calklengkap && touched.calklengkap
                          ? "is-invalid"
                          : ""
                      }`}
                      name="calklengkap"
                      id="calklengkap"
                      value={values.calklengkap}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" selected>
                        -- Pilih --
                      </option>
                      {[...Array(11)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.calklengkap && touched.calklengkap && (
                      <div className="invalid-feedback">
                        {errors.calklengkap}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 my-2">
                    <label className="my-2">&nbsp;</label>
                    <select
                      className={`form-control ${
                        errors.calksesuai && touched.calksesuai
                          ? "is-invalid"
                          : ""
                      }`}
                      name="calksesuai"
                      id="calksesuai"
                      value={values.calksesuai}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" selected>
                        -- Pilih --
                      </option>
                      {[...Array(31)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.calksesuai && touched.calksesuai && (
                      <div className="invalid-feedback">
                        {errors.calksesuai}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-sm-6 my-2">
                    <label htmlFor="lamplengkap" className="text-primary my-2">
                      <i className="fas fa-arrow-circle-right text-danger"></i>{" "}
                      Lampiran
                    </label>
                    <select
                      className={`form-control ${
                        errors.lamplengkap && touched.lamplengkap
                          ? "is-invalid"
                          : ""
                      }`}
                      name="lamplengkap"
                      id="lamplengkap"
                      value={values.lamplengkap}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" selected>
                        -- Pilih --
                      </option>
                      {[...Array(8)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.lamplengkap && touched.lamplengkap && (
                      <div className="invalid-feedback">
                        {errors.lamplengkap}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 my-2">
                    <label className="my-2">&nbsp;</label>
                    <select
                      className={`form-control ${
                        errors.lampsesuai && touched.lampsesuai
                          ? "is-invalid"
                          : ""
                      }`}
                      name="lampsesuai"
                      id="lampsesuai"
                      value={values.lampsesuai}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" selected>
                        -- Pilih --
                      </option>
                      {[...Array(9)].map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                    {errors.lampsesuai && touched.lampsesuai && (
                      <div className="invalid-feedback">
                        {errors.lampsesuai}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="danger"
                  className="px-4 float-right my-4"
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
