import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  Button as Btn,
  Col,
  Form,
  Container,
  Row,
  Button,
  Image,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logoWhite from "../../../assets/images/logo/logo_white.png";
import logoDark from "../../../assets/images/logo/logo_dark.png";
import captchaImg from "../../../assets/images/login/captcha_sample.png";
import "../../../assets/scss/pages/_login.scss";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import * as yup from "yup";

import { Formik } from "formik";

import ReCAPTCHA from "react-google-recaptcha";

import { jwtDecode } from "jwt-decode";
import MyContext from "../../../../../../auth/Context";
import { handleHttpError } from "../../../../../aplikasi/notifikasi/toastError";
import { decryptData } from "../../../../../../auth/Decrypt";

import Sintesa from "../../../../Sintesa";
import SintesaLogin from "../../../../SintesaLogin";

// import "./style.css"

const LoginForm = ({ logoClassMain }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  const {
    setVerified,
    setNmrole,
    setRole,
    setName,
    setActive,
    setKdlokasi,
    setKdkanwil,
    setKdprov,
    setDeptlimit,
    setKdkppn,
    setExpire,
    setToken,
    setIduser,
    setUrl,
    setstatusLogin,
    setUsername,
    setMode,
    setTampil,
    setTampilverify,
    setStatus,
    setPersentase,
    setSession,
    setNamelogin,
    setLoggedInUser2,
    setLoggedinUsers,
    telp,
    setTelp,
    offline,
    setOffline,
    offlinest,
    setOfflinest,
  } = useContext(MyContext);
  const [error, setError] = useState("");
  const [chap, setChap] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleOpenModal = () => setShowOtpModal(true);
  const handleCloseModal = () => setShowOtpModal(false);

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    //setChap(value);
  };
  // console.log(captcha);

  const resetState = () => {
    setName("");
    setRole("");
    setNmrole("");
    setActive("");
    setKdlokasi("");
    setKdkanwil("");
    setVerified("");
    setDeptlimit("");
    setKdkppn("");
    setToken("");
    setExpire("");
    setIduser("");
    setUrl("");
    setstatusLogin(false);
    setUsername("");
    setMode("");
    setTampil("");
    setTampilverify("");
    setStatus("");
    setPersentase([]);
    setCaptcha("");
    setNamelogin(null);
    setLoggedInUser2(null);
    setLoggedinUsers([]);
    setTelp("");
  };

  const schema = yup.object().shape({
    password: yup.string().required("Password Harus Diisi"),
    username: yup.string().required("Username Harus Diisi"),
    captcha: yup.string().when("chap", {
      is: "1",
      then: yup.string().required("Captcha Harus Diisi"),
    }),
  });
  // console.log(import.meta.env.REACT_APP_LOCAL_LOGIN);

  const getUser = async (values) => {
    if (chap === "1" && recaptchaValue === "") {
      setError("Captcha belum Diverifikasi");
      return false;
    } else if (chap === "0") {
      const cleanedCaptcha = values.captcha.replace(/\s/g, "");
      if (cleanedCaptcha !== captcha.replace(/\s/g, "")) {
        setError("Angka Tidak Sesuai");
        return false;
      }
    } else if (chap === "") {
      setError("Captcha Error");
      return false;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_LOCAL_LOGIN,
        values
      );
      const data = response.data;

      if (!data.success) {
        if (data.msg === "Password Anda Tidak Sesuai") {
          setError("Password Anda Tidak Sesuai");
        } else if (data.msg === "User tidak ditemukan") {
          setError("User tidak ditemukan");
        } else {
          setError("Terjadi kesalahan saat login");
        }
        setLoading(false);
      } else {
        const decoded = jwtDecode(decryptData(data.tokenSetLogin));
        console.log("decoded", decoded); // Debug: cek field user
        // Filter user: redirect ke landing logout jika userId atau username termasuk daftar berikut
        const filteredUsers = [""];
        if (filteredUsers.includes(decoded.username)) {
          resetState();
          localStorage.clear();
          setLoading(false);
          window.location.replace("/v3/landing-logout");
          return null;
        }
        // Jika bukan user terfilter, baru set context dan localStorage
        setTelp(decoded.telp);
        setToken(data.tokenSetLogin);
        setstatusLogin(true);
        setLoading(false);
        setName(decoded.name);
        setExpire(decoded.exp);
        setRole(decoded.role);
        setKdkanwil(decoded.kdkanwil);
        setKdkppn(decoded.kdkppn);
        setKdlokasi(decoded.kdlokasi);
        setActive(decoded.active);
        setDeptlimit(decoded.dept_limit);
        setNmrole(decoded.namarole);
        setIduser(decoded.userId);
        setUrl(decoded.url);
        setUsername(decoded.username);
        setMode(decoded.mode);
        setTampil(decoded.tampil);
        setTampilverify(decoded.tampilverify);
        setSession(decoded.session);
        setVerified(decoded.verified);
        localStorage.setItem("status", true);
        // setOffline(true);
        if (
          decoded.role === "X" ||
          decoded.role === "0" ||
          decoded.role === "1"
        ) {
          navigate("/v3/landing/profile");
        } else {
          navigate("/v3/data/form/belanja");
        }
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
      // console.log(error);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend "
      );

      setError(
        <>
          Terjadi kesalahan saat melakukan permintaan login <br />
          {error.request.statusText ? `(${error.request.statusText})` : ""}
        </>
      );
    }
  };

  const generateCaptcha = () => {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const captchaString = randomNum.toString();
    const formattedCaptcha = insertRandomSpaces(captchaString);
    setCaptcha(formattedCaptcha);
  };

  const insertRandomSpaces = (input) => {
    const numberOfSpaces = Math.floor(Math.random() * (input.length - 1)) + 1;
    let output = "";
    for (let i = 0; i < input.length; i++) {
      output += input[i];
      if (i < input.length - 1 && i < numberOfSpaces) {
        output += " ";
      }
    }
    return output;
  };

  useEffect(() => {
    if (chap === "0") {
      generateCaptcha();

      const interval = setInterval(() => {
        generateCaptcha();
      }, 20000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [chap]);

  const cekMode = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_LOCAL_CEKMODE
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_CEKMODE}`
          : ""
      );
      setChap(response.data.capcay);
      // console.log(`${import.meta.env.VITE_REACT_APP_LOCAL_CEKMODE}`);
    } catch (error) {
      console.log(error);

      // error && navigate("/v3/offline");
      setOffline(true);
      setOfflinest(error);
      const { status, data } = error.response || {};
      handleHttpError(status, (data && data.error) || " Mode Offline");
    }
  };
  useEffect(() => {
    cekMode();
  }, []);

  return (
    <Formik
      autoComplete="off"
      validationSchema={schema}
      onSubmit={getUser}
      initialValues={{
        password: "",
        username: "",
        captcha: chap,
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Fragment>
          <div className="login-card login-dark">
            <div>
              <div className="d-flex justify-content-center align-items-center">
                <SintesaLogin />
              </div>

              <div className="login-main">
                {" "}
                {error && (
                  <Alert variant="danger p-1">
                    <div className="d-grid fade-in text-center text-danger">
                      {error}
                    </div>
                  </Alert>
                )}
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  className="theme-form login-form"
                >
                  {/* <h4>Sign in to account</h4>
              <p>Enter your username & password to login</p> */}
                  <Form.Group className="mb-3">
                    <Form.Label className="my-2">Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      isInvalid={touched.username && !!errors.username}
                      className="rounded-left"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="my-2">Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={togglePassword ? "text" : "password"}
                        placeholder=" Masukkan Password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={touched.password && !!errors.password}
                        className="rounded-left"
                      />
                      <div
                        className="show-hide"
                        onClick={() => setTogglePassword(!togglePassword)}
                      >
                        {togglePassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    </div>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="my-2">Masukkan Angka</Form.Label>
                        <Form.Control
                          type="text"
                          name="captcha"
                          maxLength={4}
                          value={values.captcha}
                          placeholder="Masukkan Angka"
                          onChange={handleChange}
                          isInvalid={touched.captcha && !!errors.captcha}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="my-2">&nbsp;</Form.Label>
                        <div
                          className="d-flex align-items-center justify-content-center border rounded p-2"
                          style={{
                            height: "38px",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            letterSpacing: "3px",
                          }}
                        >
                          {captcha}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Btn
                      className="d-block w-100 mt-2"
                      variant="primary"
                      type="submit"
                    >
                      Login
                    </Btn>
                  </Form.Group>

                  <Form.Group className="mb-3 text-center">
                    <Form.Label className="m-0 d-block">atau</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Btn
                      className="d-block w-100 mt-2"
                      variant="danger"
                      type="submit"
                    >
                      Login Dengan PIN
                    </Btn>
                  </Form.Group>

                  <p className="text-center mb-0">
                    Tidak Punya Akun?
                    <Link
                      className="ms-2"
                      to="/pages/authentication/register-simple"
                    >
                      Hubungi Admin
                    </Link>
                  </p>
                </Form>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Formik>
  );
};

export default LoginForm;
