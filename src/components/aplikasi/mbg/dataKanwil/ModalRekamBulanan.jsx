import { Button, Form, Row, Col, Card, CardBody } from "react-bootstrap";
import { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../../auth/Context";
import Kdkanwil from "./KdkanwilMbg";
import { motion } from "framer-motion";

const indikatorList = [
  {
    kategori: "PDRB ADHB",
    opsi: [
      "PDRB ADHB",
      "PDRB ADHB per Kapita",
      "PDRB ADHB, komponen Pengeluaran Pemerintah (G)",
    ],
  },
  {
    kategori: "PDRB ADHB menurut Lapangan Usaha",
    opsi: [
      "Sektor Pertanian, Peternakan, dan Perikanan",
      "Sektor Penyediaan akomodasi, dan makan minum",
      "Sektor Jasa Lainnya",
    ],
  },
];

const validationSchema = Yup.object({
  kdkanwil: Yup.string().required(),
  indikator: Yup.string().required(),
  triwulan: Yup.string().required(),
  tahun: Yup.string().required(),
  keterangan: Yup.string().required(),
});

export const ModalRekamBulanan = ({ onSave, id }) => {
  const { username } = useContext(MyContext);
  const [isCustomIndikator, setIsCustomIndikator] = useState(false);
  const [selectedSatuan, setSelectedSatuan] = useState("");

  const handleIndikatorChange = (e, setFieldValue) => {
    const val = e.target.value;
    setFieldValue("indikator", val);
    setIsCustomIndikator(val === "custom");

    const selected = indikatorList.find((i) => i.indikator === val);
    setSelectedSatuan(selected?.satuan || "");
  };

  const handleClose = (resetForm) => {
    resetForm();
    setIsCustomIndikator(false);
    setSelectedSatuan("");
  };

  return (
    <Card
      className="shadow-sm rounded-4 p-4 border border-secondary text-white"
      bg="secondary"
    >
      <CardBody>
        <Formik
          initialValues={{
            kdkanwil: "",
            indikator: "",
            customIndikator: "",
            customSatuan: "",
            triwulan: "",
            keterangan: "",
            tahun: "2025",
            username: username || "n/a",
            id: id,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onSave(values);
            handleClose(resetForm);
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            errors,
            touched,
            resetForm,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="tahun">
                    <Form.Label>
                      <strong>Tahun</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="tahun"
                      value={values.tahun}
                      onChange={handleChange}
                      isInvalid={touched.tahun && !!errors.tahun}
                    >
                      <option value="">Pilih Tahun</option>
                      {["2025", "2026", "2027", "2028"].map((thn) => (
                        <option key={thn} value={thn} disabled={thn !== "2025"}>
                          {thn}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid" />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="kdkanwil">
                    <Form.Label>
                      <strong>Kanwil</strong>
                    </Form.Label>
                    <Kdkanwil
                      kdkanwil={values.kdkanwil}
                      onChange={(val) => {
                        setFieldValue("kdkanwil", val);
                        setFieldTouched("kdkanwil", true);
                      }}
                      isInvalid={touched.kdkanwil && !!errors.kdkanwil}
                    />
                    {touched.kdkanwil && errors.kdkanwil && (
                      <Form.Control.Feedback type="invalid" />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="indikator">
                    <Form.Label>
                      <strong>Indikator</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="indikator"
                      value={values.indikator}
                      onChange={(e) => handleIndikatorChange(e, setFieldValue)}
                      isInvalid={touched.indikator && !!errors.indikator}
                    >
                      <option value="">Pilih Indikator</option>
                      {indikatorList.map((item, idx) => (
                        <optgroup key={idx} label={item.kategori}>
                          {item.opsi.map((opt, oidx) => (
                            <option key={oidx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid" />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="triwulan">
                    <Form.Label>
                      <strong>Triwulan</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="triwulan"
                      value={values.triwulan}
                      onChange={handleChange}
                      isInvalid={touched.triwulan && !!errors.triwulan}
                    >
                      <option value="">Pilih Triwulan</option>
                      {["I", "II", "III", "IV"].map((tw) => (
                        <option key={tw} value={tw}>
                          {tw}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid" />
                  </Form.Group>
                </Col>
              </Row>

              {isCustomIndikator && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Row className="mb-3">
                    <Col xs={12} md={6}>
                      <Form.Group controlId="customIndikator">
                        <Form.Label>Nama Indikator</Form.Label>
                        <Form.Control
                          type="text"
                          name="customIndikator"
                          value={values.customIndikator}
                          onChange={handleChange}
                          isInvalid={
                            touched.customIndikator && !!errors.customIndikator
                          }
                        />
                        <Form.Control.Feedback type="invalid" />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group controlId="customSatuan">
                        <Form.Label>Satuan</Form.Label>
                        <Form.Control
                          type="text"
                          name="customSatuan"
                          value={values.customSatuan}
                          onChange={handleChange}
                          isInvalid={
                            touched.customSatuan && !!errors.customSatuan
                          }
                        />
                        <Form.Control.Feedback type="invalid" />
                      </Form.Group>
                    </Col>
                  </Row>
                </motion.div>
              )}

              <Row className="mb-3">
                <Col xs={12}>
                  <Form.Group controlId="keterangan">
                    <Form.Label>
                      <strong>Keterangan</strong>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="keterangan"
                      value={values.keterangan}
                      onChange={handleChange}
                      isInvalid={touched.keterangan && !!errors.keterangan}
                    />
                    <Form.Control.Feedback type="invalid" />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4 gap-2">
                <Button
                  variant="warning"
                  type="submit"
                  size="sm"
                  className="border border-light"
                >
                  Simpan
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};
