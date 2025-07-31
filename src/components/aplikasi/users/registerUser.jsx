import React, { useState, useContext } from "react";
import MyContext from "../../../auth/Context";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Row,
  Col,
  Form as BootstrapForm,
  Button,
  Spinner,
  Modal,
  Image,
  Alert,
} from "react-bootstrap";
import data1 from "../../../data/Kdkanwil.json";
import data2 from "../../../data/Kdkppn.json";
import NotifikasiSukses from "../notifikasi/notifsukses";
import Notifikasi from "../notifikasi/notif";
import { handleHttpError } from "../notifikasi/toastError";

const AddUser = ({ show, handleClose }) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataerror, setError] = useState("");

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nama Lengkap Harus Diisi"),
    username: Yup.string()
      .min(3, "Username minimal 3 karakter")
      .required("Username Harus Diisi"),
    password: Yup.string()
      .min(6, "Password minimal 6 karakter")
      .required("Password Harus Diisi"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords tidak cocok")
      .required("Konfirmasi Password Harus Diisi"),
    role: Yup.string().required("Role Harus Diisi"),
    deptlimit: Yup.string().required(
      "Limit Departemen Harus Diisi contoh format (001,015)"
    ),
    // telp: Yup.string().required("Phone number Harus Diisi"),
    // email: Yup.string().email("Invalid email").required("Email Harus Diisi"),
    file: Yup.mixed()
      .test("fileSize", "Ukuran gambar terlalu besar (maks 1MB)", (value) => {
        if (!value) return true; // Tidak validasi jika tidak ada file yang dipilih
        return value.size <= 1000000; // Ubah 5000000 ke ukuran maksimum yang diizinkan dalam byte (5MB)
      })
      .test("fileType", "Tipe file tidak valid (hanya *jpg/*png)", (value) => {
        if (!value) return true; // Tidak validasi jika tidak ada file yang dipilih
        return ["image/jpeg", "image/png"].includes(value.type); // Sesuaikan tipe file yang diizinkan di sini
      })
      .required("Foto Belum Dipilih"),
    kdkppn: Yup.string().when("role", {
      is: (role) => role === "3", // Cek jika peran adalah "KPPN"
      then: () => Yup.string().required("KPPN Harus Diisi"), // Validasi jika peran adalah "KPPN"
      otherwise: () => Yup.string(), // Tidak ada validasi jika peran bukan "KPPN"
    }),
    kdkanwil: Yup.string().when("role", {
      is: (role) => role === "2", // Cek jika peran adalah "Kanwil"
      then: () => Yup.string().required("Kanwil Harus Diisi"), // Validasi jika peran adalah "Kanwil"
      otherwise: () => Yup.string(), // Tidak ada validasi jika peran bukan "Kanwil"
    }),
  });

  const loadImage = (e, setFieldValue) => {
    const image = e.target.files[0];
    setPreview(URL.createObjectURL(image));
    setFieldValue("file", image);
  };
  const tutupModal = () => {
    handleClose();
    navigate("/v3/admin/users");
  };
  const saveUser = async (values) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", values.file);
    formData.append("name", values.name);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("role", values.role);
    formData.append("deptlimit", values.deptlimit);
    formData.append("telp", values.telp);
    formData.append("email", values.email);
    formData.append("kdkppn", values.kdkppn);
    formData.append("kdkanwil", values.kdkanwil);
    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_REGISTER,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      NotifikasiSukses("Rekam User Berhasil");
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
    <Modal
      show={show}
      onHide={tutupModal}
      backdrop="static"
      keyboard={false}
      size="xl"
      animation={false}
      fullscreen={false}
      dialogClassName="custom-modal"
      contentClassName="modal-content"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="text-dark">Perekaman User</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="rekam-user">
        <Row className="justify-content-center">
          <Col md={12}>
            <Formik
              initialValues={{
                name: "",
                username: "",
                password: "",
                confirmPassword: "",
                role: "",
                deptlimit: "",
                telp: "",
                email: "",
                file: "",
                kdkppn: "",
                kdkanwil: "",
              }}
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
                    <div className="col-sm-12 text-center">
                      <Alert variant="danger">{dataerror}</Alert>
                    </div>
                  )}
                  <Form>
                    <div className="row mb-3">
                      <label
                        htmlFor="inputText"
                        className="col-sm-2 col-form-label"
                      >
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
                      <label
                        htmlFor="inputText"
                        className="col-sm-2 col-form-label"
                      >
                        User Name
                      </label>
                      <div className="col-sm-10">
                        <Field
                          type="text"
                          className="form-control"
                          name="username"
                          placeholder="User Name"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="inputText"
                        className="col-sm-2 col-form-label"
                      >
                        Password
                      </label>
                      <div className="col-sm-10">
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
                        className="col-sm-2 col-form-label"
                      >
                        Konfirmasi Password
                      </label>
                      <div className="col-sm-10">
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
                      <label
                        htmlFor="inputText"
                        className="col-sm-2 col-form-label"
                      >
                        Role
                      </label>
                      <div className="col-sm-10">
                        <Field
                          as="select"
                          className="form-control"
                          name="role"
                          onChange={(e) => {
                            const selectedRole = e.target.value;
                            // Ubah nilai deptlimit berdasarkan role yang dipilih
                            const deptlimit = selectedRole === "0" ? "000" : "";
                            setFieldValue("role", selectedRole); // Set nilai role
                            setFieldValue("deptlimit", deptlimit); // Set nilai deptlimit sesuai dengan role
                          }}
                        >
                          <option value="">Pilih Role</option>
                          <option value="0">Admin Pusat</option>
                          <option value="1">Kantor Pusat</option>
                          <option value="2">Kanwil DJPBN</option>
                          <option value="3">KPPN</option>
                          <option value="4">Lainnya</option>
                        </Field>

                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    {values.role === "2" && (
                      <div className="row mb-3">
                        <label
                          htmlFor="inputText"
                          className="col-sm-2 col-form-label"
                        >
                          Kanwil
                        </label>
                        <div className="col-sm-10">
                          <Field
                            as="select"
                            className="form-control"
                            name="kdkanwil"
                          >
                            <option value="" disabled>
                              Pilih Kanwil
                            </option>
                            {data1.map((item) => (
                              <option value={item.kdkanwil} key={item.kdkanwil}>
                                {item.kdkanwil} - {item.nmkanwil}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="kdkanwil"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                    )}
                    {values.role === "3" && (
                      <div className="row mb-3">
                        <label
                          htmlFor="inputText"
                          className="col-sm-2 col-form-label"
                        >
                          KPPN
                        </label>
                        <div className="col-sm-10">
                          <Field
                            as="select"
                            className="form-control"
                            name="kdkppn"
                          >
                            <option value="" disabled>
                              Pilih KPPN
                            </option>

                            {data2
                              .filter((item) => item.kdkppn !== "000")
                              .map((item, index) => (
                                <option value={item.kdkppn} option key={index}>
                                  {item.kdkppn} - {item.nmkppn}
                                </option>
                              ))}
                          </Field>
                          <ErrorMessage
                            name="kdkppn"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                    )}

                    <div className="row mb-3">
                      <label
                        htmlFor="inputText"
                        className="col-sm-2 col-form-label"
                      >
                        Department Limit
                      </label>
                      <div className="col-sm-10">
                        <Field
                          type="text"
                          className="form-control"
                          name="deptlimit"
                          placeholder="Department Limit (format Kode KL, koma => 015,001)"
                        />
                        <ErrorMessage
                          name="deptlimit"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    {/* <div className="row mb-3">
                      <label
                        htmlFor="inputText"
                        className="col-sm-2 col-form-label"
                      >
                        Telepon
                      </label>
                      <div className="col-sm-10">
                        <Field
                          type="text"
                          className="form-control"
                          name="telp"
                          placeholder="Nomor Telepon"
                        />
                        <ErrorMessage
                          name="telp"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div> */}

                    <div className="row mb-3">
                      <label
                        htmlFor="inputText"
                        className="col-sm-2 col-form-label"
                      >
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
                      <label
                        htmlFor="inputText"
                        className="col-sm-2 col-form-label"
                      >
                        Foto Profile
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
                        </div>{" "}
                        <ErrorMessage
                          name="file"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    {preview ? (
                      <div className="row mb-3">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-10">
                          <Image
                            src={preview ? preview : "/public/images/null.png"}
                            alt="Preview Image"
                            style={{ width: "100px", height: "100px" }}
                            className="rounded-circle"
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = "/public/images/null.png"; // Path to fallback image
                            }}
                          />
                        </div>
                      </div>
                    ) : null}

                    <div className="row mb-3">
                      <div className="col-sm-2"></div>
                      <div className="col-sm-10 d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose}>
                          Tutup
                        </Button>{" "}
                        <Button variant="danger" type="submit" className="mx-2">
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AddUser;
