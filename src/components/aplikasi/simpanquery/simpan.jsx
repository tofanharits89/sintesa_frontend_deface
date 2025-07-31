import React, { useState, useContext, useEffect } from "react";
import { Modal, Spinner, Alert, Button } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import { Loading2 } from "../../layout/LoadingTable";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";

export const Simpan = (props) => {
  const { showModalsimpan, closeModalsimpan } = props;
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, name } = useContext(MyContext);
  const [dataerror, setError] = useState("");
  const [initialValues, setInitialValues] = useState({
    nama: "",
    tipe: props.jenis,
    name: name,
    query: props.query2,
    thang: props.thang,
  });

  const tutupModalsimpan = () => {
    closeModalsimpan();
  };
  const validationSchema = Yup.object().shape({
    tipe: Yup.string().required("tipe Harus Diisi"),
    nama: Yup.string().required("Nama Query Harus Diisi"),
  });

  const saveUser = async (values) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("tipe", values.tipe);
    formData.append("nama", values.nama);
    formData.append("name", values.name);
    formData.append("query", values.query);
    formData.append("thang", values.thang);

    try {
      await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_SIMPANQUERY}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      Swal.fire({
        html: `<div className='text-success mt-4'>Query Berhasil Disimpan</div>`,
        icon: "success", // Tambahkan ikon error
        position: "top",
        buttonsStyling: false,
        customClass: {
          popup: "swal2-animation",
          container: "swal2-animation",
          confirmButton: "swal2-confirm ", // Gunakan kelas CSS kustom untuk tombol
          icon: "swal2-icon", // Gunakan kelas CSS kustom untuk ikon
        },
        confirmButtonText: "Tutup",
      });
      closeModalsimpan();
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        onHide={tutupModalsimpan}
        show={showModalsimpan}
        backdrop="static"
        keyboard={false}
        size="md"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px" }} className="text-dark">
            {" "}
            <i className="bi bi-sd-card-fill mx-2 text-primary"></i>Simpan Query
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "auto" }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={saveUser}
            enableReinitialize={true}
          >
            {({ values, setFieldValue }) =>
              loading ? (
                <div className="text-center">
                  <Loading2 />
                  <br /> <Loading2 /> <br /> <Loading2 />
                </div>
              ) : (
                <>
                  <Form>
                    <div className="row mb-3">
                      <label
                        htmlFor="inputText"
                        className="col-sm-3 col-form-label text-dark"
                      >
                        TA
                      </label>
                      <div className="col-sm-9">
                        <Field
                          type="thang"
                          className="form-control"
                          name="thang"
                          placeholder="thang"
                          disabled
                        />
                        <ErrorMessage
                          name="thang"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label
                        htmlFor="inputText"
                        className="col-sm-3 col-form-label text-dark"
                      >
                        Tipe
                      </label>
                      <div className="col-sm-9">
                        <Field
                          type="tipe"
                          className="form-control"
                          name="tipe"
                          placeholder="tipe"
                          disabled
                        />
                        <ErrorMessage
                          name="tipe"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label
                        htmlFor="inputText"
                        className="col-sm-3 col-form-label text-dark"
                      >
                        Nama Query
                      </label>
                      <div className="col-sm-9">
                        <Field
                          type="nama"
                          className="form-control"
                          name="nama"
                          placeholder="nama singkat query..."
                        />
                        <ErrorMessage
                          name="nama"
                          component="div"
                          className="text-danger"
                        />
                        <div className="fst-italic my-2 text-secondary">
                          {" "}
                          <small>
                            *) query yang tersimpan bisa diakses di menu
                            profile, pilih tab Query Data
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3"></div>
                      <div className="col-sm-9 d-flex justify-content-end">
                        <Button
                          variant="danger"
                          type="submit"
                          className="mx-2"
                          size="xs"
                        >
                          Simpan
                        </Button>
                      </div>
                    </div>
                    <hr />
                  </Form>
                </>
              )
            }
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};
