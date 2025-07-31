import React, { useState, useContext, useEffect } from "react";
import numeral from "numeral";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Modal,
  ModalFooter,
  Spinner,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import Sebab from "./sebab";
import Kategori from "./kategori";
import { Toast } from "../notifikasi/Omspan";

export default function RekamInefisiensi({
  isModalVisible,
  TutupModal,
  selectedRowData,
  setHighlightedRowIndex,
  setStatus,
  setUlang,
  updateRow,
}) {
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, kdkanwil, role, username, gridRef } =
    useContext(MyContext);
  const [jenis_efisiensi, setJenis] = useState("");

  const [selectedValue, setSelectedValue] = useState("");
  const [kategori, setKategori] = useState("");

  const handleSebabChange = (value) => setSelectedValue(value);
  const handleKategoriChange = (value) => setKategori(value);
  console.log(selectedRowData);

  const formatToRibuan = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(
      Number(value.toString().replace(/\D/g, ""))
    );
  };

  const unformatRibuan = (value) =>
    value
      ? value
          .toString()
          .replace(/\./g, "")
          .replace(/[^0-9]/g, "")
      : "";
  // selectedRowData.id.slice(29, 31) === "53"
  const validationSchema = (selectedRowData) => {
    return Yup.object().shape({
      sebab: Yup.string().required("Alasan harus diisi"),
      kategori: Yup.string().when("belanja", {
        is: (belanja) => belanja === "53",
        then: () => Yup.string().required("Kategori harus diisi"),
        otherwise: () => Yup.string().notRequired(),
      }),
      jenis_efisiensi: Yup.string().required("Jenis harus dipilih"),
      persentase: Yup.number().when("jenis_efisiensi", {
        is: (jenis_efisiensi) => jenis_efisiensi === "1",
        then: () =>
          Yup.number()
            .typeError("Persentase harus berupa angka")
            .required("Persentase harus diisi")
            .min(1, "Persentase tidak boleh kurang dari 1%")
            .max(100, "Persentase tidak boleh lebih dari 100%"),
        otherwise: () => Yup.number().notRequired(),
      }),
      volume: Yup.number().when("jenis_efisiensi", {
        is: (jenis_efisiensi) => jenis_efisiensi === "0",
        then: () =>
          Yup.number()
            .typeError("Volume harus berupa angka")
            .required("Volume harus diisi")
            .moreThan(0, "Volume harus lebih dari 0")
            .test(
              "volkeg",
              `Volume tidak boleh melebihi volume kegiatan sebelumnya (${numeral(
                selectedRowData?.volkeg
              ).format("0,00")})`,
              function (value) {
                return value <= selectedRowData.volkeg;
              }
            ),
        otherwise: () => Yup.number().notRequired(),
      }),
      hargaSatuan: Yup.number().when("jenis_efisiensi", {
        is: (jenis_efisiensi) => jenis_efisiensi === "0",
        then: () =>
          Yup.number()
            .typeError("Harga Satuan harus berupa angka")
            .required("Harga Satuan harus diisi")
            .positive("Harga Satuan harus angka")
            .test(
              "pagu",
              `Harga Satuan tidak boleh melebihi harga satuan sebelumnya (Rp.${numeral(
                selectedRowData?.hargasat
              ).format("0,00")})`,
              function (value) {
                return value <= selectedRowData.hargasat;
              }
            ),
        otherwise: () => Yup.number().notRequired(),
      }),
      keterangan: Yup.string(),
    });
  };

  const formik = useFormik({
    initialValues: {
      belanja: selectedRowData?.id?.slice(29, 31) || "",
      volume: "",

      hargaSatuan: "",
      nilai: "",
      nilaipersenakhir: "",
      keterangan: "",
      pagu: selectedRowData?.pagu,
      uraian: selectedRowData?.uraian,
      kdkanwil: kdkanwil,
      sebab: "",
      kategori: "",
      jenis_efisiensi: "",
      persentase: "",
      // hargasatuanPersen: "",
    },
    validationSchema: validationSchema(selectedRowData),
    enableReinitialize: true,
    context: {
      hargasat: selectedRowData.hargasat,
      volkeg: selectedRowData.volkeg,
      pagu: selectedRowData.pagu,
    },

    onSubmit: async (values) => {
      const updatedValues = {
        ...values,
        nilai: values.nilai,
        nilaipersenakhir: values.nilaipersenakhir,
        kdindex: selectedRowData.id,
        satkeg: selectedRowData.satkeg,
        jenis_efisiensi: values.jenis_efisiensi,
        user: username,
        thang: "2025",
        pagu: selectedRowData.pagu,
        uraian: selectedRowData.uraian,
        sebab: values.sebab,
        kategori: values.kategori,
        // hargasatuanPersen: values.hargasatuanPersen,
      };
      // console.log(status_simpan);

      try {
        setLoading(true);
        await axiosJWT.post(
          import.meta.env.VITE_REACT_APP_LOCAL_SIMPANINEFISIENSI,
          updatedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        Toast.fire({ icon: "success", title: "Data Berhasil Disimpan" });
        updateRow({
          ...selectedRowData,
          status_simpan: "simpan_inefisensi",
        });
        setTimeout(() => TutupModal(), 100);
        setHighlightedRowIndex(selectedRowData.id);
        setStatus(true);
        setUlang(true);
      } catch (error) {
        const { status, data } = error.response || {};
        console.log(error);

        handleHttpError(
          status,
          (data && data.error) ||
            "Terjadi Permasalahan Koneksi atau Server Backend"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const jenisAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.3 },
  };

  return (
    <Modal
      show={isModalVisible}
      size="xl"
      animation={false}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          <h5>
            <i className="bi bi-briefcase-fill mx-2 "></i>Rekam Data Inefisiensi
          </h5>
        </Modal.Title>
      </Modal.Header>
      {selectedRowData && (
        <>
          <Modal.Body
            className="rounded bg-light"
            style={{ minHeight: "400px" }}
          >
            <Container>
              {/* Info Card */}
              <Card>
                <Card.Body
                  style={{ border: "2px solid #C4C5C6" }}
                  className="rounded bg-light"
                >
                  <table className="table-spending" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td>Kode</td>
                        <td>:</td>
                        <td>{selectedRowData.id}</td>
                      </tr>
                      <tr>
                        <td>Uraian</td>
                        <td>:</td>
                        <td>{selectedRowData.uraian}</td>
                      </tr>
                      <tr>
                        <td>Jenis Review</td>
                        <td>:</td>
                        <td>Inefisiensi</td>
                      </tr>
                      <tr>
                        <td>Pagu</td>
                        <td>:</td>
                        <td>{numeral(selectedRowData.pagu).format("0,00")}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
              {jenis_efisiensi === "1" ? (
                <AnimatePresence>
                  <motion.div {...jenisAnimation}>
                    <Alert variant="info">
                      *Yang direkam adalah nilai Inefisiensi (misal yang tidak
                      efisien 20 %).
                    </Alert>
                  </motion.div>
                </AnimatePresence>
              ) : jenis_efisiensi === "0" ? (
                <AnimatePresence>
                  <motion.div {...jenisAnimation}>
                    <Alert variant="info" className="text-muted">
                      *Yang direkam adalah nilai Inefisiensi (jumlah volume dan
                      nilai harga satuan yang tidak efisien). Jika volume 0,
                      maka inefisiensi volume dan harga disabled.
                    </Alert>
                  </motion.div>
                </AnimatePresence>
              ) : null}

              <Card bg="light">
                <Card.Body
                  style={{ border: "2px solid #C4C5C6" }}
                  className="rounded bg-light p-4"
                >
                  <table className="table-spending" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td>Volume</td>
                        <td>:</td>
                        <td>
                          {numeral(selectedRowData.volkeg).format("0,00")}
                        </td>
                        <td colSpan={2}>{selectedRowData.satkeg}</td>
                      </tr>
                      <tr>
                        <td>Harga Satuan</td>
                        <td>:</td>
                        <td colSpan="3">
                          {numeral(selectedRowData.hargasat).format("0,00")}
                        </td>
                      </tr>
                      <tr>
                        <td>Nilai</td>
                        <td>:</td>
                        <td colSpan="3">
                          {numeral(selectedRowData.pagu).format("0,00")}
                        </td>
                      </tr>
                      <tr>
                        <td>Alasan</td>
                        <td>:</td>
                        <td colSpan="3">
                          <Sebab
                            value={formik.values.sebab}
                            onChange={(value) => {
                              formik.setFieldValue("sebab", value);
                              handleSebabChange(value);
                            }}
                            className={
                              formik.touched.sebab && formik.errors.sebab
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {formik.touched.sebab && formik.errors.sebab && (
                            <div className="invalid-feedback d-block">
                              {formik.errors.sebab}
                            </div>
                          )}
                        </td>
                      </tr>
                      {selectedRowData.id.slice(29, 31) === "53" && (
                        <tr>
                          <td>Kategori</td>
                          <td>:</td>
                          <td colSpan="3">
                            <Kategori
                              value={formik.values.kategori}
                              onChange={(value) => {
                                formik.setFieldValue("kategori", value);
                                handleKategoriChange(value);
                              }}
                              className={
                                formik.touched.kategori &&
                                formik.errors.kategori
                                  ? "is-invalid"
                                  : ""
                              }
                            />
                            {formik.touched.kategori &&
                              formik.errors.kategori && (
                                <div className="invalid-feedback d-block">
                                  {formik.errors.kategori}
                                </div>
                              )}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td>Jenis Inefisiensi</td>
                        <td>:</td>
                        <td colSpan="6">
                          <Form.Select
                            name="jenis_efisiensi"
                            value={formik.values.jenis_efisiensi}
                            onChange={(e) => {
                              const value = e.target.value;
                              formik.setFieldValue("jenis_efisiensi", value);
                              setJenis(value); // update state lokal juga jika diperlukan

                              // Reset fields persentase dan harga yang terkait
                              formik.setFieldValue("persentase", "");
                              formik.setFieldValue("volume", "");
                              formik.setFieldValue("hargaSatuan", "");
                              formik.setFieldValue("nilai", "");
                              // formik.setFieldValue("hargasatuanPersen", "");
                              formik.setFieldValue("nilaipersenakhir", "");
                            }}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.jenis_efisiensi &&
                              !!formik.errors.jenis_efisiensi
                            }
                          >
                            <option value="">Pilih Jenis Inefisiensi</option>
                            <option value="0">A. Volume/Harga Satuan</option>
                            <option value="1">B. Persentase</option>
                          </Form.Select>
                        </td>
                      </tr>
                      <tr>
                        <td>Keterangan</td>
                        <td>:</td>
                        <td colSpan="6">
                          <Form.Control
                            as="textarea"
                            placeholder="keterangan"
                            style={{ height: "100px" }}
                            name="keterangan"
                            value={formik.values.keterangan}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {jenis_efisiensi === "0" && (
                    <AnimatePresence>
                      <motion.div {...jenisAnimation}>
                        <Form className="row g-3 mt-3">
                          <Form.Group className="col-md-4" controlId="volume">
                            <Form.Label>Volume</Form.Label>
                            <Form.Control
                              type="text"
                              name="volume"
                              placeholder="Masukkan Volume"
                              value={formatToRibuan(formik.values.volume)}
                              disabled={
                                selectedRowData.volkeg === 0 ||
                                selectedRowData.volkeg === "0"
                              }
                              onChange={(e) => {
                                const raw = unformatRibuan(e.target.value);
                                formik.setFieldValue("volume", raw);

                                const harga = Number(
                                  unformatRibuan(formik.values.hargaSatuan)
                                );
                                const nilai = Math.round(Number(raw) * harga);
                                formik.setFieldValue("nilai", nilai);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                formik.touched.volume && !!formik.errors.volume
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.volume}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group
                            className="col-md-4"
                            controlId="hargaSatuan"
                          >
                            <Form.Label>Harga Satuan</Form.Label>
                            <Form.Control
                              type="text"
                              name="hargaSatuan"
                              placeholder="Masukkan Harga Satuan"
                              value={formatToRibuan(formik.values.hargaSatuan)}
                              disabled={
                                selectedRowData.volkeg === 0 ||
                                selectedRowData.volkeg === "0"
                              }
                              onChange={(e) => {
                                const raw = unformatRibuan(e.target.value);
                                formik.setFieldValue("hargaSatuan", raw);

                                const volume = Number(
                                  unformatRibuan(formik.values.volume)
                                );
                                const nilai = Math.round(volume * Number(raw));
                                formik.setFieldValue("nilai", nilai);
                                formik.setFieldValue("volume", volume);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                formik.touched.hargaSatuan &&
                                !!formik.errors.hargaSatuan
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.hargaSatuan}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="col-md-4" controlId="nilai">
                            <Form.Label>Nilai</Form.Label>
                            <Form.Control
                              type="text"
                              name="nilai"
                              value={formatToRibuan(formik.values.nilai)}
                              readOnly
                            />
                          </Form.Group>
                        </Form>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {jenis_efisiensi === "1" && (
                    <AnimatePresence>
                      <motion.div {...jenisAnimation}>
                        <Form className="row g-3 mt-3">
                          <Form.Group
                            className="col-md-4"
                            controlId="persentase"
                          >
                            <Form.Label>Persentase (%)</Form.Label>
                            <Form.Control
                              type="number"
                              name="persentase"
                              placeholder="Masukkan Persentase"
                              value={formik.values.persentase}
                              onChange={(e) => {
                                const value = e.target.value;
                                const pagu = Number(selectedRowData.pagu);
                                const hargasat = Number(
                                  selectedRowData.hargasat
                                );
                                // const volkeg = Number(selectedRowData.volkeg);

                                formik.setFieldValue("persentase", value);

                                // const nilaiPersenAwal = Math.round(
                                //   (Number(value) / 100) * hargasat
                                // );
                                // const hasil = Math.round(
                                //   selectedRowData.volkeg * nilaiPersenAwal
                                // );
                                // const nilaiPersenAwal = Math.round((Number(value) / 100) * hargasat);

                                // const hasil = volkeg === 0
                                //   ? Math.round((Number(value) / 100) * pagu)
                                //   : Math.round(volkeg * nilaiPersenAwal);

                                const hasil = Math.round(
                                  (Number(value) / 100) * pagu
                                );

                                // const hasil = volkeg === 0
                                //   ? Math.round((Number(value) / 100) * pagu)
                                //   : Math.round(volkeg * nilaiPersenAwal);

                                // console.log(hasil);

                                // formik.setFieldValue(
                                //   "hargasatuanPersen",
                                //   nilaiPersenAwal
                                // );
                                formik.setFieldValue("nilaipersenakhir", hasil);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                formik.touched.persentase &&
                                !!formik.errors.persentase
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              {formik.errors.persentase}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            className="col-md-4"
                            controlId="nilaipersenakhir"
                          >
                            <Form.Label>Nilai</Form.Label>
                            <Form.Control
                              type="text"
                              name="nilaipersenakhir"
                              value={formatToRibuan(
                                formik.values.nilaipersenakhir
                              )}
                              readOnly
                            />
                          </Form.Group>
                          {/* <Form.Group
                            className="col-md-4"
                            controlId="hargasatuanPersen"
                          >
                            <Form.Label>Harga Satuan</Form.Label>
                            <Form.Control
                              type="hidden"
                              name="hargasatuanPersen"
                              value={formatToRibuan(
                                formik.values.hargasatuanPersen
                              )}
                              readOnly
                            />
                          </Form.Group> */}
                        </Form>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </Card.Body>
              </Card>
            </Container>
          </Modal.Body>
          <ModalFooter className="bg-light rounded">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="mx-0 button"
              onClick={TutupModal}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              className="mx-4 button"
              disabled={loading}
              onClick={formik.handleSubmit}
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
                  &nbsp;Loading...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
