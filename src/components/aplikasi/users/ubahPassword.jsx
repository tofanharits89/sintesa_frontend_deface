import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Tab,
  Row,
  Col,
  Form as BootstrapForm,
  Button,
  Spinner,
  Modal,
  Image,
  Alert,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";

const UbahPassword = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [preview, setPreview] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataerror, setError] = useState("");
  const [initialValues, setInitialValues] = useState({
    id: "",
    password: "",
  });

  useEffect(() => {
    setInitialValues({
      id: props.id,
      password: "",
    });
  }, [props]);
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password minimal 6 karakter")
      .required("Password Harus Diisi"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords tidak cocok")
      .required("Konfirmasi Password Harus Diisi"),
  });

  const saveUser = async (values) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("password", values.password);

    try {
      await axiosJWT.patch(
        `${import.meta.env.VITE_REACT_APP_LOCAL_EDITPASSWORD}/${initialValues.id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      Swal.fire({
        html: `<div className='text-success mt-4'>Password Berhasil Dirubah</div>`,
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={saveUser}
      enableReinitialize={true}
    >
      {({ values, setFieldValue }) => (
        <>
          {loading && (
            <div className="row mb-3">
              <div className="col-sm-2"></div>
              <div className="col-sm-10">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </div>
          )}

          {dataerror && (
            <div className="row mb-3">
              <div className="col-sm-2"></div>
              <div className="col-sm-10">
                <Alert variant="danger">{dataerror}</Alert>
              </div>
            </div>
          )}

          <Tab.Pane eventKey="ubahpassword" role="tabpanel">
            <>
              <Form>
                <div className="row mb-3">
                  <label
                    htmlFor="inputText"
                    className="col-sm-3 col-form-label"
                  >
                    Password
                  </label>
                  <div className="col-sm-9">
                    <Field
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="inputText"
                    className="col-sm-3 col-form-label"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="col-sm-9">
                    <Field
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="Konfirmasi Password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3"></div>
                  <div className="col-sm-9 d-flex justify-content-end">
                    <Button variant="danger" type="submit" className="mx-2">
                      Edit Password
                    </Button>
                  </div>
                </div>
              </Form>
            </>
          </Tab.Pane>
        </>
      )}
    </Formik>
  );
};

export default UbahPassword;
