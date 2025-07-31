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
import Encrypt from "../../../auth/Random";
import { Toast } from "../notifikasi/Omspan";

export default function RekamAdm({
  isModalVisible2,
  TutupModal2,
  selectedRowData,
  setHighlightedRowIndex,
  updateRow,
  setUlang,
}) {
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  // console.log(isModalVisible2);

  const validationSchema = Yup.object().shape({
    keterangan: Yup.string().required("Keterangan harus diisi"),
  });

  const formik = useFormik({
    initialValues: {
      keterangan: selectedRowData.id.length > 35 ? "" : "salah_akun",
      pagu: selectedRowData.pagu,
      uraian: selectedRowData.uraian,
      kdkanwil: kdkanwil,
    },
    validationSchema,
    onSubmit: async (values) => {
      const isInduk = selectedRowData.id.length === 35;
      const status_simpan = isInduk
        ? "salah_akun"
        : values.keterangan === "salah_satuan"
        ? "salah_satuan"
        : "tidak_informatif";

      const updatedValues = {
        ...values,
        kdindex: selectedRowData.id,
        satkeg: selectedRowData.satkeg,
        volkeg: selectedRowData.volkeg,
        hargasat: selectedRowData.hargasat,
        jenis: 2,
        user: username,
        thang: "2025",
        pagu: selectedRowData.pagu,
        uraian: selectedRowData.uraian,
        status_simpan,
      };

      try {
        setLoading(true);
        await axiosJWT.post(
          import.meta.env.VITE_REACT_APP_LOCAL_SIMPANADM,
          updatedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        Toast.fire({
          icon: "success",
          title: "Data Berhasil Disimpan",
        });

        updateRow({
          ...selectedRowData,
          status_simpan,
          salah_akun: values.keterangan === "salah_akun" ? "TRUE" : null,
          salah_satuan: values.keterangan === "salah_satuan" ? "TRUE" : null,
          tidak_informatif:
            values.keterangan === "tidak_informatif" ? "TRUE" : null,
        });

        setHighlightedRowIndex(selectedRowData.id);
        setUlang(true);
        setTimeout(() => {
          TutupModal2();
        }, 100);
      } catch (error) {
        const { status, data } = error.response || {};
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
  // console.log(selectedRowData.id.length);

  return (
    <Modal
      show={isModalVisible2}
      // onHide={TutupModal2}
      fullscreen={false}
      size="xl"
      animation={false}
      backdrop="static"
      keyboard={false}
      // className="bg-light"
      // style={{ border: "1px solid red" }}
    >
      <Modal.Header>
        <Modal.Title>
          <h5>
            <i className="bi bi-briefcase-fill mx-2 "></i>Rekam Data Kesalahan
            Administrasi
          </h5>
        </Modal.Title>
      </Modal.Header>
      {selectedRowData && (
        <>
          <Modal.Body
            className="rounded bg-light"
            style={{
              minHeight: "400px",
              marginBottom: "0px",
              overflow: "hidden",
            }}
          >
            <Container>
              <Card>
                <Card.Body
                  style={{ border: "2px solid #C4C5C6" }}
                  className="rounded bg-light "
                >
                  <table style={{ width: "100%" }} className="table-spending">
                    <tbody>
                      <tr>
                        <td>Kode</td>
                        <td>:</td>
                        <td>
                          {selectedRowData.id} ({selectedRowData.id.length})
                        </td>
                      </tr>

                      <tr>
                        <td>Uraian</td>
                        <td>:</td>
                        <td>{selectedRowData.uraian}</td>
                      </tr>
                      <tr>
                        <td>Jenis Review</td>
                        <td>:</td>
                        <td>Kesalahan Administrasi (ADM)</td>
                      </tr>
                      <tr>
                        <td>Pagu</td>
                        <td>:</td>
                        <td>{numeral(selectedRowData.pagu).format("0,00")}</td>
                      </tr>
                      <tr>
                        <td>Keterangan</td>
                        <td>:</td>
                        <td colSpan="6">
                          {selectedRowData.id.length > 35 ? (
                            <Form.Select
                              name="keterangan"
                              value={formik.values.keterangan}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">
                                --- Pilih Kesalahan Administrasi ---
                              </option>
                              <option value="salah_satuan">
                                1. Kesalahan Satuan Volume
                              </option>
                              <option value="tidak_informatif">
                                2. Detail Item Tidak Informatif
                              </option>
                            </Form.Select>
                          ) : (
                            "Kesalahan Akun"
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
              <Button
                className="my-2 text-bold text-center text-danger"
                variant="light"
                size="sm"
              >
                {formik.errors.keterangan && (
                  <ul>
                    {formik.touched.keterangan && formik.errors.keterangan && (
                      <li>{formik.errors.keterangan}</li>
                    )}
                  </ul>
                )}
              </Button>
            </Container>
          </Modal.Body>
          <ModalFooter className="bg-light rounded">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="mx-0 button"
              onClick={TutupModal2}
            >
              Tutup
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
                  &nbsp; &nbsp;Loading...
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
