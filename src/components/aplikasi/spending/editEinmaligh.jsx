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
import Notifikasi from "../notifikasi/notif";

export default function EditEinmaligh({
  isModalVisible2,
  TutupModal2,
  selectedRowData,
  setHighlightedRowIndex,
  setStatus2,
  setUlang,
}) {
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [data, setData] = useState([]);
  const tigaenam = selectedRowData.id.length;
  useEffect(() => {
    getData();
  }, [selectedRowData]);

  const validationSchema = Yup.object().shape({
    keterangan: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      kdindex: selectedRowData.id,
      keterangan: data.length > 0 ? data[0].keterangan : "",
      kdkanwil: kdkanwil,
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values) => {
      const updatedValues = {
        ...values,
        jenis: 2,
        user: username,
        thang: "2025",
        uraian: selectedRowData.uraian,
      };

      try {
        setLoading(true);
        const confirmText =
          "Apakah Anda yakin ingin melakukan perubahan data ini?"; // Ganti dengan teks konfirmasi yang sesuai

        const result = await Swal.fire({
          title: "Konfirmasi Ubah",
          html: confirmText,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, Ubah",
          cancelButtonText: "Batal",
          position: "top",
        });

        if (result.isConfirmed) {
          // Lakukan aksi penghapusan di sini
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
            html: `<div className='text-success mt-4'>Data Berhasil Diubah</div>`,
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
          setStatus2(false);
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

  const getData = async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);

      const encryptedQuery = Encrypt(
        `SELECT posisi,volkeg,hargasat,keterangan FROM spending_review.dt_review_2025 where kdreview='2' and left(posisi,${tigaenam})='${selectedRowData.id}' limit 1`
      );

      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
    } catch (error) {
      console.log(error);
      handleHttpError(
        error.response?.status,
        (error.response?.data && error.response.data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async (posisi) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";

    Swal.fire({
      title: "Konfirmasi Hapus",
      html: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      position: "top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let id = data.length > 0 && data[0].posisi;
        try {
          await axiosJWT.delete(
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC}spending/einmaligh/${
              selectedRowData.id
            }/${2}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Notifikasi("Data telah dihapus.");
          setStatus2(false);
          setUlang(true);
        } catch (error) {
          console.log(error);
          const { status, data } = error.response || {};
          handleHttpError(
            status,
            (data && data.error) ||
              "Terjadi Permasalahan Koneksi atau Server Backend"
          );
        }
      }
    });
  };

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
            {" "}
            <i className="bi bi-cash-coin mx-2 "></i>Edit Data Einmaligh
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
                        <td>Einmaligh</td>
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
              <Card bg="light">
                <Card.Body
                  style={{ border: "2px solid #C4C5C6" }}
                  className="rounded bg-light"
                >
                  <table style={{ width: "100%" }} className="table-spending">
                    <tbody>
                      <tr className="mt-2">&nbsp;</tr>

                      <tr>
                        <td>Keterangan</td>
                        <td>:</td>
                        <td colSpan="6">
                          <Form.Control
                            as="textarea"
                            placeholder="keterangan"
                            style={{ height: "100px" }}
                            name="keterangan"
                            value={formik.values.keterangan.toString()}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                  />{" "}
                  &nbsp; &nbsp;Loading...
                </>
              ) : (
                "Edit"
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="danger"
              className="mx-0 button"
              onClick={handleHapus}
            >
              Hapus
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
