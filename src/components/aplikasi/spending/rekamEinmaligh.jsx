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

export default function RekamEinmaligh({
  isModalVisible2,
  TutupModal2,
  selectedRowData,
  setHighlightedRowIndex,
  setStatus2,
  setUlang,
}) {
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);

  const validationSchema = Yup.object().shape({
    keterangan: Yup.string().required("Keterangan harus diisi"),
  });

  const formik = useFormik({
    initialValues: {
      keterangan: "",
      pagu: selectedRowData.pagu,
      uraian: selectedRowData.uraian,
      kdkanwil: kdkanwil,
    },
    validationSchema,

    onSubmit: async (values) => {
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
      };
      try {
        setLoading(true);

        await axiosJWT.post(
          import.meta.env.VITE_REACT_APP_LOCAL_SIMPANINEINMALIGH,
          updatedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire({
          html: `<div className='text-success mt-4'>Data Berhasil Disimpan</div>`,
          icon: "success",
          position: "top",
          buttonsStyling: false,
          customClass: {
            popup: "swal2-animation",
            container: "swal2-animation",
            confirmButton: "swal2-confirm",
            icon: "swal2-icon",
          },
          confirmButtonText: "Tutup",
        });

        setHighlightedRowIndex(selectedRowData.id);
        setStatus2(true);
        setUlang(true);
      } catch (error) {
        console.log(error);
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

  return (
    <Modal
      show={isModalVisible2}
      onHide={TutupModal2}
      fullscreen={false}
      size="xl"
      animation={false}
      backdrop="static"
      keyboard={false}
      // className="bg-light"
      // style={{ border: "1px solid red" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5>
            <i className="bi bi-briefcase-fill mx-2 "></i>Rekam Data Einmaligh
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
                        <td>Einmaligh</td>
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
                          <Form.Control
                            className="my-2"
                            as="textarea"
                            placeholder="keterangan"
                            style={{ height: "150px" }}
                            name="keterangan"
                            value={formik.values.keterangan}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
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
