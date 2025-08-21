import React, { useState, useContext, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Button, Spinner, Container, Alert, Card } from "react-bootstrap";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import * as yup from "yup";

import { Formik } from "formik";
import MyContext from "../auth/Context";
import "../auth/Login.css";
import { handleHttpError } from "../components/aplikasi/notifikasi/toastError";
import ReCAPTCHA from "react-google-recaptcha";
import { decryptData } from "./Decrypt";
import { jwtDecode } from "jwt-decode";
import PinLogin from "./pinLogin";
import sintesaLogo from "../assets/sintesa_logotype_sapphire_blue.svg";
import Offline from "../components/layout/Offline";
// import PopupnotifLogin from "../components/layout/Login/Components/Pages/Auth/Popup_notif";

const LoginNew = () => {
  // const SSO_DIGIT_CLIENT_ID = import.meta.env.VITE_SSO_DIGIT_CLIENT_ID;
  // const SSO_DIGIT_CLIENT_SECRET = import.meta.env.VITE_SSO_DIGIT_CLIENT_SECRET;
  // const SSO_DIGIT_URL = import.meta.env.VITE_SSO_DIGIT_URL;
  // const SSO_DIGIT_REDIRECT_URI = import.meta.env.VITE_SSO_DIGIT_REDIRECT_URI;
  // const SSO_DIGIT_CLIENT_STATE = import.meta.env.VITE_SSO_DIGIT_CLIENT_STATE;
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
  const [showEmptyFormAlert, setShowEmptyFormAlert] = useState(false);
  // const [showPopup, setShowPopup] = useState(false);

  // Show popup when component mounts
  // useEffect(() => {
  //   setShowPopup(true);
  // }, []);

  // const handleClosePopup = () => {
  //   setShowPopup(false);
  // };

  const handleOpenModal = () => setShowOtpModal(true);
  const handleCloseModal = () => setShowOtpModal(false);

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    //setChap(value);
  };

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
    // Check for empty username or password before proceeding
    if (!values.username || !values.password) {
      setShowEmptyFormAlert(true);
      return;
    }

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
        if (data.blocked) {
          window.location.replace("/v3/landing-logout");
          return;
        }
        if (data.msg === "Password Anda Tidak Sesuai") {
          setError("Password Anda Tidak Sesuai");
        } else if (data.msg === "User tidak ditemukan") {
          setError("User tidak ditemukan");
        } else {
          setError("Terjadi kesalahan saat login");
        }
        setLoading(false);
      } else {
        resetState();
        const decoded = jwtDecode(decryptData(data.tokenSetLogin));
        // console.log(decoded);
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
        // Debug: Log user data
        // Redirect khusus user MBG
        if (decoded.username === "djsef") {
          navigate("/v3/landing/mbg");
          return;
        }
        // Periksa user terblokir SETELAH semua context dan localStorage di-set
        if (decoded.username === "" || decoded.userId === "") {
          // Hard redirect ke halaman logout tanpa mengganggu context
          window.location.replace("/v3/landing-logout");
          return;
        }
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

      error && navigate("/v3/offline");
      setOffline(true);
      setOfflinest(error);
      const { status, data } = error.response || {};
      handleHttpError(status, (data && data.error) || " Mode Offline");
    }
  };
  useEffect(() => {
    cekMode();
  }, []);

  // console.log("tes");
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
        <div className="modern-login-bg">
          {/* Removed .bg-bubbles for a clean background */}
          <Container
            fluid
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Row className="w-100 justify-content-center align-items-center">
              <Col xs={12} sm={10} md={8} lg={5} xl={4}>
                <Card className="modern-login-card shadow-lg border-0 p-4">
                  <Card.Body>
                    <div className="text-center mb-4">
                      <img
                        src={sintesaLogo}
                        alt="Logo"
                        style={{ width: 200, marginBottom: 24, paddingTop: 24 }}
                      />
                      {/* <div
                        className="text-muted mb-3"
                        style={{ fontSize: "1.0rem", paddingTop: "1.2rem" }}
                      >
                        Silakan login ke akun Anda
                      </div> */}
                    </div>
                    {!offline && (
                      <Form
                        noValidate
                        onSubmit={(e) => {
                          e.preventDefault();
                          setShowEmptyFormAlert(false);
                          if (!values.username || !values.password) {
                            setShowEmptyFormAlert(true);
                            return;
                          }
                          handleSubmit(e);
                        }}
                        autoComplete="off"
                      >
                        {showEmptyFormAlert && (
                          <Alert
                            variant="warning"
                            onClose={() => setShowEmptyFormAlert(false)}
                            dismissible
                            className="modern-alert text-center"
                            style={{
                              fontWeight: 500,
                              fontSize: "1rem",
                              letterSpacing: 0.5,
                            }}
                          >
                            Pastikan User dan Password telah terisi
                          </Alert>
                        )}

                        <Form.Group className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            isInvalid={touched.username && !!errors.username}
                            className="modern-input"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={touched.password && !!errors.password}
                            className="modern-input"
                          />
                        </Form.Group>
                        {chap === "0" && (
                          <Row>
                            <Col xs={7} className="mb-3">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  name="captcha"
                                  value={values.captcha}
                                  placeholder="Masukkan Angka"
                                  onChange={handleChange}
                                  isInvalid={
                                    touched.captcha && !!errors.captcha
                                  }
                                  className="captcha-input"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={5} className="mb-3">
                              <Form.Group>
                                <Form.Control
                                  value={captcha}
                                  disabled
                                  className="modern-captcha-box"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        )}
                        {loading ? (
                          <Button
                            variant="secondary w-100 modern-btn"
                            size="md"
                            disabled
                          >
                            <Spinner
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            &nbsp;Loading...
                          </Button>
                        ) : (
                          <>
                            {chap === "1" && (
                              <div className="mb-3 d-flex justify-content-center">
                                <ReCAPTCHA
                                  sitekey="6LcdMpEoAAAAAHbPB2H8_jma_7c4CvGGH0F9KlXg"
                                  onChange={handleRecaptchaChange}
                                />
                              </div>
                            )}
                            <Button
                              variant="primary"
                              size="lg"
                              type="submit"
                              className="w-100 modern-btn mt-2"
                              style={{
                                fontWeight: 600,
                                fontSize: "1.1rem",
                                letterSpacing: 3,
                              }}
                            >
                              <i className="bi bi-box-arrow-in-right me-2"></i>
                              LOG-IN
                            </Button>
                            {/* Modern separator */}
                            <div className="modern-separator my-3 d-flex align-items-center">
                              <div
                                className="flex-grow-1 border-top"
                                style={{ borderColor: "#e5e7eb" }}
                              ></div>
                              <span
                                className="mx-3 text-muted"
                                style={{
                                  fontSize: "0.95rem",
                                  letterSpacing: 1,
                                }}
                              >
                                atau
                              </span>
                              <div
                                className="flex-grow-1 border-top"
                                style={{ borderColor: "#e5e7eb" }}
                              ></div>
                            </div>
                            <Button
                              variant="danger"
                              size="lg"
                              onClick={handleOpenModal}
                              className="w-100 modern-btn-pin"
                              style={{
                                fontWeight: 600,
                                fontSize: "1.1rem",
                                letterSpacing: 2,
                              }}
                            >
                              <i className="bi bi-key-fill me-2"></i>LOGIN
                              DENGAN PIN
                            </Button>
                            {/* <Button
                              variant="danger"
                              size="lg"
                              href={`${SSO_DIGIT_URL}?response_type=code&client_id=${SSO_DIGIT_CLIENT_ID}&redirect_uri=${SSO_DIGIT_REDIRECT_URI}&state=${SSO_DIGIT_CLIENT_STATE}`}
                              className="mt-2 w-100 modern-btn-pin"
                              style={{
                                fontWeight: 600,
                                fontSize: "1.1rem",
                                letterSpacing: 2,
                              }}
                            >
                              <i className="bi bi-key-fill me-2"></i>Login
                              SSO-DIGIT
                            </Button> */}

                            <div
                              className="text-center mt-4"
                              style={{
                                fontSize: "1rem",
                                color: "#b0b3b8",
                                letterSpacing: 2,
                              }}
                            >
                              <span>&copy; 2025 DIREKTORAT PA | PDPSIPA</span>
                            </div>
                          </>
                        )}
                        {error && (
                          <Alert variant="danger mt-3 modern-alert">
                            <div className="d-grid fade-in text-center text-danger">
                              {error}
                            </div>
                          </Alert>
                        )}
                      </Form>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <PinLogin show={showOtpModal} handleClose={handleCloseModal} />
            {/* <PopupnotifLogin show={showPopup} onClose={handleClosePopup} /> */}
          </Container>
        </div>
      )}
    </Formik>
  );
};

export default LoginNew;
