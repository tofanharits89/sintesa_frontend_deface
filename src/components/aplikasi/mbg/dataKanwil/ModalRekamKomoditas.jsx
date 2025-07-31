import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../../auth/Context";

import Kdkabkota from "./KdkabkotaMbg";
import Kdkanwil from "./KdkanwilMbg";
import KdlokasiMbg from "./KdlokasiMbg";
import Komoditas from "./RefKomoditas";

// Validasi schema menggunakan Yup
const validationSchema = Yup.object({
  kdkanwil: Yup.string().required("Kanwil tidak boleh kosong"),
  kabkota: Yup.string().required("Kabupaten/Kota tidak boleh kosong"),
  komoditas: Yup.string().required("Komoditas tidak boleh kosong"),
  kdlokasi: Yup.string().required("Kode Lokasi tidak boleh kosong"),
  volume: Yup.number()
    .required("Volume tidak boleh kosong")
    .positive("Volume harus positif"),
  sppg: Yup.number()
    .required("SPPG tidak boleh kosong")
    .positive("SPPG harus positif"),
});
// console.log(validationSchema);

export const ModalRekamKomoditas = ({ show, onHide, onSave }) => {
  const { username } = useContext(MyContext);
  const [kabkota, setKabkota] = useState("");
  const [kdlokasi, setKdlokasi] = useState("");
  const [kdkanwil, setkdkanwil] = useState("");
  const [komoditas, setKomoditas] = useState("");
  const [resetFormik, setResetFormik] = useState(null);

  const handleClose = () => {
    setKabkota("");
    setKdlokasi("");
    setkdkanwil("");
    setKomoditas("");

    if (resetFormik) {
      resetFormik({
        values: {
          kdkanwil: "",
          kdlokasi: "",
          kabkota: "",
          komoditas: "",
          volume: "",
          sppg: "",
          username: username || "",
        },
      });
    }

    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="xl"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Rekam Komoditas MBG</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            kdkanwil: kdkanwil.kdkanwil,
            kabkota: kabkota,
            kdlokasi: kdkanwil.kdlokasi,
            komoditas: komoditas || "",
            volume: "",
            sppg: "",
            username: username || "n/a",
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values, { resetForm }) => {
            if (onSave) {
              onSave(values);
              handleClose();
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            resetForm,
          }) => {
            useEffect(() => {
              setResetFormik(() => resetForm); // simpan resetForm ke state
            }, [resetForm]);

            return (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="my-2">
                  <Form.Label>
                    <strong>KANWIL</strong>
                  </Form.Label>
                  <Kdkanwil
                    kdkanwil={kdkanwil.kdkanwil}
                    onChange={(val) => {
                      setkdkanwil(val); // val = { kdkanwil: ..., kdlokasi: ... }
                    }}
                  />

                  {errors.kdkanwil && touched.kdkanwil && (
                    <div className="text-danger">{errors.kdkanwil}</div>
                  )}
                </Form.Group>

                <Row>
                  <Col md={6} className="my-2">
                    <Form.Group>
                      <Form.Label>
                        <strong>LOKASI</strong>
                      </Form.Label>
                      <KdlokasiMbg
                        kdlokasi={kdkanwil.kdlokasi}
                        onChange={(val) => setKdlokasi(val)}
                      />
                      {errors.kdlokasi && touched.kdlokasi && (
                        <div className="text-danger">{errors.kdlokasi}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6} className="my-2">
                    <Form.Group>
                      <Form.Label>
                        <strong>KABUPATEN / KOTA</strong>
                      </Form.Label>
                      <Kdkabkota
                        kdlokasi={kdkanwil.kdlokasi}
                        kabkota={kabkota}
                        onChange={setKabkota}
                      />
                      {errors.kabkota && touched.kabkota && (
                        <div className="text-danger">{errors.kabkota}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="my-2">
                  <Form.Label>
                    <strong>KOMODITAS</strong>
                  </Form.Label>
                  <Komoditas komoditas={komoditas} onChange={setKomoditas} />
                  {errors.komoditas && touched.komoditas && (
                    <div className="text-danger">{errors.komoditas}</div>
                  )}
                </Form.Group>

                <Row className="my-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        <strong>VOLUME</strong>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="volume"
                        value={values.volume}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Masukkan Volume"
                      />
                      {errors.volume && touched.volume && (
                        <div className="text-danger">{errors.volume}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        <strong>SPPG</strong>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="sppg"
                        value={values.sppg}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Masukkan SPPG"
                      />
                      {errors.sppg && touched.sppg && (
                        <div className="text-danger">{errors.sppg}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-3">
                  <Button variant="primary" type="submit" className="ms-2">
                    Simpan
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
