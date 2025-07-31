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
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import { Toast } from "../notifikasi/Omspan";

export default function EditAdm({
  isModalVisible2,
  TutupModal2,
  selectedRowData,
  setHighlightedRowIndex,
  setStatus2,
  setUlang,
  updateRow,
}) {
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, kdkanwil, username } = useContext(MyContext);

  const validationSchema = Yup.object().shape({
    keterangan: Yup.string(),
  });

  const jenis =
    selectedRowData.salah_satuan === "TRUE"
      ? "salah_satuan"
      : selectedRowData.tidak_informatif === "TRUE"
      ? "tidak_informatif"
      : "salah_akun";

  const formik = useFormik({
    initialValues: {
      kdindex: selectedRowData.id,
      keterangan: jenis,
      kdkanwil,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const isInduk = selectedRowData.id.length === 35;
      const status_hapus = isInduk
        ? "salah_akun"
        : values.keterangan === "salah_satuan"
        ? "salah_satuan"
        : "tidak_informatif";
      const updatedValues = {
        ...values,
        jenis,
        user: username,
        thang: "2025",
        uraian: selectedRowData.uraian,
        status_hapus,
      };
      // console.log(status_hapus);

      try {
        const result = await Swal.fire({
          title: "Konfirmasi Hapus",
          html: "Apakah Anda yakin ingin melakukan perubahan data ini?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, Hapus",
          cancelButtonText: "Batal",
          position: "top",
          customClass: {
            confirmButton: "btn btn-sm btn-primary",
            cancelButton: "btn btn-md btn-danger",
          },
        });

        if (result.isConfirmed) {
          setLoading(true);
          await axiosJWT.post(
            import.meta.env.VITE_REACT_APP_LOCAL_EDITADM,
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
            title: "Data Berhasil Dihapus",
          });
          updateRow({
            ...selectedRowData,
            status_hapus,
            salah_akun: values.keterangan === "salah_akun" && null,
            salah_satuan: values.keterangan === "salah_satuan" && null,
            tidak_informatif: values.keterangan === "tidak_informatif" && null,
          });
          setTimeout(() => {
            TutupModal2();
          }, 100);
          setHighlightedRowIndex(selectedRowData.id);
          // setStatus2(false);
          setUlang(true);
        }
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

  const rekamItem = (item) => {
    setStatus2(false);
    // console.log("diklik");
  };
  // console.log(status2);

  // console.log("selectedRowData", selectedRowData);

  return (
    <Modal
      show={isModalVisible2}
      // onHide={TutupModal2}
      size="xl"
      animation={false}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          <h5>
            <i className="bi bi-cash-coin mx-2 "></i>Hapus Data Kesalahan
            Administrasi
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
              {selectedRowData.id.length !== 36 && (
                <Alert variant="warning" className="mt-1">
                  <Alert.Heading>⚠️ Informasi</Alert.Heading>
                  <p className="mb-0">
                    Semua <strong>data item terkait dengan akun ini</strong>{" "}
                    akan dihapus secara permanen.
                  </p>
                </Alert>
              )}{" "}
              {selectedRowData.id.length === 36 && (
                <div className="mt-1 mb-2 p-3 rounded bg-light border">
                  <h6 className="text-primary fw-bold mb-2">
                    Status Kesalahan Administrasi
                  </h6>
                  <ul className="list-unstyled mb-0">
                    {selectedRowData.salah_akun && (
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Kesalahan Akun :{" "}
                        <span className="fw-semibold">Terindikasi</span>
                        <span className="fw-semibold text-danger mx-2">
                          (Hanya bisa dihapus dari level akun)
                        </span>
                      </li>
                    )}

                    {selectedRowData.salah_satuan && (
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Kesalahan Satuan Volume :{" "}
                        <span className="fw-semibold">Terindikasi</span>
                      </li>
                    )}

                    {selectedRowData.tidak_informatif === "TRUE" && (
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Detail Item Tidak Informatif :{" "}
                        <span className="fw-semibold">Terindikasi</span>
                      </li>
                    )}
                  </ul>

                  {/* Tampilkan pesan jika semua kosong */}
                  {!selectedRowData.salah_akun &&
                    !selectedRowData.salah_satuan &&
                    selectedRowData.tidak_informatif !== "TRUE" && (
                      <div className="text-muted">
                        Tidak ada kesalahan yang terindikasi.
                      </div>
                    )}
                </div>
              )}
              <Card>
                <Card.Body
                  className="rounded bg-light"
                  style={{ border: "2px solid #C4C5C6" }}
                >
                  <table style={{ width: "100%" }} className="table-spending">
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
                          {selectedRowData.id.length === 36 &&
                          (selectedRowData.salah_satuan === "TRUE" ||
                            selectedRowData.tidak_informatif === "TRUE") ? (
                            <Form.Select
                              name="keterangan"
                              value={formik.values.keterangan}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              {selectedRowData.salah_satuan === "TRUE" && (
                                <option value="salah_satuan" selected>
                                  1. Kesalahan Satuan Volume
                                </option>
                              )}
                              {selectedRowData.tidak_informatif === "TRUE" && (
                                <option value="tidak_informatif" selected>
                                  2. Detail Item Tidak Informatif
                                </option>
                              )}
                              {/* {selectedRowData.salah_akun === "TRUE" && (
                                <option value="salah_akun" selected>
                                  3. Salah Akun
                                </option>
                              )} */}
                            </Form.Select>
                          ) : (
                            " Kesalahan Akun hanya bisa dihapus di level Akun"
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>{" "}
            </Container>
          </Modal.Body>
          {/* header: {selectedRowData.id.length}
          <br />
          salah akun: {selectedRowData.salah_akun}
          <br />
          salah satuan: {selectedRowData.salah_satuan}
          <br />
          salah tidak_informatif: {selectedRowData.tidak_informatif} */}
          <ModalFooter className="bg-light rounded">
            <Button
              type="button"
              size="sm"
              className="mx-2 button"
              variant="secondary"
              onClick={TutupModal2}
            >
              Tutup
            </Button>
            {selectedRowData.id.length > 35 &&
              selectedRowData.salah_satuan !== "TRUE" &&
              selectedRowData.tidak_informatif !== "TRUE" && (
                <Button
                  type="button"
                  size="sm"
                  className="mx-2 button"
                  variant="primary"
                  onClick={rekamItem}
                >
                  Rekam Item
                </Button>
              )}
            {selectedRowData.jumlah === 35 && (
              <Button
                type="submit"
                size="sm"
                className="mx-2 button"
                style={{ fontSize: "0.9rem", fontWeight: "bold" }}
                variant="danger"
                disabled={loading}
                onClick={formik.handleSubmit}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    &nbsp;Loading...
                  </>
                ) : (
                  "Hapus"
                )}
              </Button>
            )}{" "}
            {selectedRowData.jumlah > 35 &&
              (selectedRowData.salah_satuan === "TRUE" ||
                selectedRowData.tidak_informatif === "TRUE") && (
                <Button
                  type="submit"
                  size="sm"
                  className="mx-2 button "
                  style={{ fontSize: "0.9rem", fontWeight: "bold" }}
                  variant="warning"
                  disabled={loading}
                  onClick={formik.handleSubmit}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" />{" "}
                      &nbsp;Loading...
                    </>
                  ) : (
                    "Hapus "
                  )}
                </Button>
              )}
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
