import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Tab,
  Form as BootstrapForm,
  Button,
  Spinner,
  Image,
  Alert,
  InputGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";

const EditProfile = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [preview, setPreview] = useState("");
  const [loadingUbah, setloadingUbah] = useState(false);
  const [dataerror, setError] = useState("");
  const [isNomorValid, setIsNomorValid] = useState(false); // State untuk validasi nomor
  const [loadingCekNomor, setLoadingCekNomor] = useState(false);
  const [cekNomorResult, setCekNomorResult] = useState(null);

  const initialValues = {
    id: props.id,
    name: props.name || "", // Gunakan default value jika name tidak tersedia
    telp: props.telp || "", // Gunakan default value jika telp tidak tersedia
    email: props.email || "", // Gunakan default value jika email tidak tersedia
    file: null, // Inisialisasi file dengan null
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nama Lengkap Harus Diisi"),
    telp: Yup.string()
      .matches(/^\d+$/, "Nomor Telp harus berupa angka")
      .min(8, "Nomor tidak valid")
      .required("Nomor Telp Harus Diisi"),
    email: Yup.string().email("Invalid email").required("Email Harus Diisi"),
    file: Yup.mixed()
      .test("fileSize", "Ukuran gambar terlalu besar (maks 1MB)", (value) => {
        if (!value) return true; // Tidak validasi jika tidak ada file yang dipilih
        return value.size <= 1000000; // Ubah 5000000 ke ukuran maksimum yang diizinkan dalam byte (1MB)
      })
      .test("fileType", "Tipe file tidak valid (hanya *jpg/*png)", (value) => {
        if (!value) return true; // Tidak validasi jika tidak ada file yang dipilih
        return ["image/jpeg", "image/png"].includes(value.type); // Sesuaikan tipe file yang diizinkan di sini
      }),
  });

  const loadImage = (e, setFieldValue) => {
    const image = e.target.files[0];
    setPreview(URL.createObjectURL(image));
    setFieldValue("file", image);
  };

  const saveUser = async (values) => {
    setloadingUbah(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", values.file);
    formData.append("name", values.name);
    formData.append("telp", values.telp);
    formData.append("email", values.email);

    try {
      const response = await axiosJWT.patch(
        `${import.meta.env.VITE_REACT_APP_LOCAL_EDITPROFILE}/${values.id}`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setloadingUbah(false);

      if (response.status === 200) {
        Swal.fire({
          html: `<div className='text-success mt-4'>Profile Berhasil Dirubah</div>`,
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
      } else {
        handleHttpError(response.status, response.data.error);
      }
    } catch (error) {
      const backendError =
        (error.response && error.response.data && error.response.data.status) ||
        "Nomor ini sudah digunakan";
      setError("Nomor ini sudah digunakan");
    } finally {
      setloadingUbah(false);
    }
  };
  useEffect(() => {
    if (dataerror) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer); // Bersihkan timer jika komponen di-unmount
    }
  }, [dataerror]);

  // cek nomor

  const cekNomor = async (telp) => {
    setLoadingCekNomor(true);
    setCekNomorResult(null);
    setIsNomorValid(false); // Reset validasi sebelum pengecekan
    try {
      const response = await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_CEKNOMOR}`,
        { telp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setCekNomorResult("Nomor terdaftar dengan akun WhatsApp");
        setIsNomorValid(true); // Nomor valid
      } else {
        setCekNomorResult("Nomor tidak terdaftar di WhatsApp");
        setIsNomorValid(false); // Nomor tidak valid
      }
    } catch (error) {
      setCekNomorResult("Nomor tidak terdaftar dengan akun WhatsApp");
      setIsNomorValid(false);
    } finally {
      setLoadingCekNomor(false);
    }
  };

  const handleTelpChange = (e, setFieldValue) => {
    setFieldValue("telp", e.target.value); // Update Formik field value
    setIsNomorValid(false); // Reset the nomor valid state
    setCekNomorResult(null);
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
          {loadingUbah && (
            <div className="row my-2">
              <div className="col-sm-12">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">loadingUbah...</span>
                </Spinner>
              </div>
            </div>
          )}

          {dataerror && (
            <div className="row mb-0">
              <div className="col-sm-12">
                <Alert variant="danger">{dataerror} </Alert>
              </div>
            </div>
          )}

          <Tab.Pane eventKey="profile-edit" role="tabpanel">
            <Alert variant="warning" className="p-1">
              <p>
                Pastikan nomor telepon yang digunakan terhubung dengan akun
                WhatsApp.
              </p>
            </Alert>
            <Form enctype="multipart/form-data">
              <div className="row mb-3">
                <label htmlFor="name" className="col-sm-2 col-form-label">
                  Nama
                </label>
                <div className="col-sm-10">
                  <Field
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Nama Lengkap"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="telp" className="col-sm-2 col-form-label">
                  Telepon
                </label>
                <div className="col-sm-10">
                  <InputGroup>
                    <Field
                      type="text"
                      className="form-control"
                      name="telp"
                      placeholder="Nomor Telepon (081345678910)"
                      onChange={(e) => handleTelpChange(e, setFieldValue)}
                    />
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => cekNomor(values.telp)}
                      disabled={loadingCekNomor}
                    >
                      {loadingCekNomor ? (
                        <>
                          <Spinner animation="border" size="sm" /> Loading
                        </>
                      ) : (
                        "Cek Nomor"
                      )}
                    </Button>
                  </InputGroup>
                  <ErrorMessage
                    name="telp"
                    component="div"
                    className="text-danger"
                  />
                  {cekNomorResult && (
                    <Alert
                      variant={isNomorValid ? "info" : "danger"} // Gunakan danger jika gagal
                      className="mt-2 mb-0 p-1"
                    >
                      {cekNomorResult}
                    </Alert>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="email" className="col-sm-2 col-form-label">
                  Email
                </label>
                <div className="col-sm-10">
                  <Field
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="file" className="col-sm-2 col-form-label">
                  File
                </label>
                <div className="col-sm-10">
                  <div className="input-group mt-0">
                    <span className="input-group-text">Pilih File</span>
                    <label tabIndex="0" className="form-control">
                      &nbsp;
                      <input
                        type="file"
                        className="invisible"
                        name="file"
                        accept="image/*"
                        onChange={(e) => loadImage(e, setFieldValue)}
                      />
                    </label>
                  </div>
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="text-danger"
                  />
                </div>
                {preview && (
                  <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                    <Image
                      src={preview}
                      alt="Profile"
                      className="rounded-circle"
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm-10 offset-sm-2">
                  <Button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isNomorValid || loadingUbah} // Disable jika nomor tidak valid
                  >
                    {loadingUbah ? (
                      <>
                        <Spinner animation="border" size="sm" /> Loading...
                      </>
                    ) : (
                      "Ubah Profil"
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          </Tab.Pane>
        </>
      )}
    </Formik>
  );
};

export default EditProfile;
