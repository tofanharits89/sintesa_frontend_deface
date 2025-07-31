import React, { useState, useContext } from "react";
import { Modal, Form, Button, Container, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from "sweetalert2";

export default function Rekam({ show, onHide }) {
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // State untuk file

  const validationSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("File belum dipilih")
      .test("fileType", "Hanya file PDF yang diperbolehkan", (value) => {
        const allowedTypes = ["application/pdf"];
        return value && allowedTypes.includes(value.type);
      }),
  });

  const initialValues = { file: null };

  const handleModalClose = () => {
    onHide();
  };

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("data", JSON.stringify(values)); // Menambahkan data form lainnya

      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_TUNING,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
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
          <i className="bi bi-flower2 text-primary"></i>{" "}
          <i className="bi bi-exclude text-success mx-1"></i>
          Tuning Model Dataset
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: "auto", height: "auto" }}>
        <Formik
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmitdata}
          initialValues={initialValues}
        >
          {({ handleSubmit, setFieldValue, touched, errors }) => (
            <Container fluid>
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="file">
                  <Form.Label className="fw-bold">File</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    accept=".pdf"
                    isInvalid={touched.file && errors.file}
                    onChange={(e) => {
                      setFieldValue("file", e.target.files[0]);
                      setFile(e.target.files[0]); // Menyimpan file ke state
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.file}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  type="submit"
                  variant="danger"
                  className="mt-3 mb-3"
                  disabled={loading}
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
                      &nbsp; Loading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </Form>
            </Container>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
