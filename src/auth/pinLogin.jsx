import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Container, Alert, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyContext from "../auth/Context";
import { handleHttpError } from "../components/aplikasi/notifikasi/toastError";
import { decryptData } from "./Decrypt";
import { jwtDecode } from "jwt-decode";

const PinLogin = ({ show, handleClose, pin }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const {
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
    setVerified,
  } = useContext(MyContext);

  const [locationName, setLocationName] = useState("");
  const [location, setLocation] = useState(null);
  const [showmodal, setShowModal] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // Menambah waktu tunggu hingga 10 detik
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        fetchLocationName(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setShowModal(true);
        }
      },
      geoOptions
    );
  }, []);
  const fetchLocationName = (latitude, longitude) => {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.address) {
          const { suburb, village, city, city_district, county, state } =
            data.address;

          // Menggabungkan bagian-bagian nama lokasi
          const locationParts = [];

          if (village) locationParts.push(village);
          if (suburb) locationParts.push(suburb);
          if (city) locationParts.push(city);
          if (city_district) locationParts.push(city_district);
          if (county) locationParts.push(county);
          if (state) locationParts.push(state);

          const locationName =
            locationParts.join(", ") || "[Lokasi tidak ditemukan]";
          setLocationName(locationName);
        } else {
          setLocationName("[Lokasi tidak ditemukan]");
        }
      })
      .catch((error) => {
        console.error("Error fetching location name:", error);
        setLocationName("[Gagal mendapatkan lokasi]");
      });
  };

  // console.log(locationName);

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
    setTelp("");
    setPersentase([]);

    setNamelogin(null);
    setLoggedInUser2(null);
    setLoggedinUsers([]);
  };
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{6}$/, "PIN harus terdiri dari 6 digit angka.")
      .required("PIN harus diisi."),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_LOCAL_LOGINPIN,
        values
      );
      const data = response.data;
      if (data.success) {
        resetState();
        const decoded = jwtDecode(decryptData(data.tokenSetLogin));
        // console.log(decoded);

        // Update state with decoded token information
        setToken(data.tokenSetLogin);
        setstatusLogin(true);
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
        setTelp(decoded.telp);
        localStorage.setItem("status", true);
        // Navigate to the appropriate page based on the user's role
        if (
          decoded.role === "X" ||
          decoded.role === "0" ||
          decoded.role === "1"
        ) {
          navigate("/v3/landing/profile");
        } else {
          navigate("/v3/data/form/belanja");
        }

        const formatLocalDateTime = (date) => {
          // Format waktu lokal sesuai zona waktu "Asia/Jakarta"
          const localDateTime = new Date(date).toLocaleString("sv-SE", {
            timeZone: "Asia/Jakarta",
          });

          return localDateTime.replace("T", " ");
        };

        function generateToken() {
          return Math.floor(Date.now() / 1000); // Get current time in seconds
        }
        try {
          const token = generateToken();
          const response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_LOCAL_AKTIVASI}`,
            {
              message: `LOGIN_SUCCESS_v3`,
              detailuser: `username : ${decoded.username} (${decoded.name}) pada waktu ${formatLocalDateTime(
                new Date()
              )}${locationName ? `, lokasi ${locationName}` : ", lokasi tidak tersedia"}. Apabila bukan anda segera lakukan perubahan PIN atau password.`,
              to: `62${decoded.telp.slice(1)}@c.us`,
              nama: `${decoded.name}`,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(locationName);
          // console.log(locationName);
        } catch (error) {
          return res.status(500).json({
            status: "Gagal mengirim pesan",
            error: error.message,
          });
        }
      } else {
        setErrorMessage("User tidak ditemukan");
      }
    } catch (error) {
      setErrorMessage(error || "Something went wrong.");
    }
    setLoading(false);
    setSubmitting(false);
    resetForm();
  };

  // Clear messages when modal is closed
  const handleModalClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          <h5 className="text-danger fw-bold m-0" style={{ letterSpacing: 2 }}>
            <i className="bi bi-key-fill mx-3"></i>LOGIN DENGAN PIN
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <Col md={12}>
            <div className="d-flex justify-content-center align-items-center fade-in">
              <Alert
                variant="danger"
                onClose={() => setErrorMessage("")}
                style={{
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                {errorMessage}
              </Alert>
            </div>
          </Col>
        )}

        <Formik
          initialValues={{ otp: "", pin: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <Container>
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="otpInput">
                  <Form.Control
                    type="text"
                    name="otp"
                    value={values.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Masukkan 6-Digit PIN"
                    size="lg"
                    maxLength={6}
                    isInvalid={touched.otp && !!errors.otp}
                    className="otp-input"
                  />
                  {/* <Form.Control.Feedback type="invalid">
                    {errors.otp}
                  </Form.Control.Feedback> */}
                </Form.Group>
                <div style={{ margin: "20px 0 0 0", textAlign: "center" }}>
                  <Button
                    variant="danger"
                    type="submit"
                    size="lg"
                    className="modern-btn-pin-modal"
                    style={{
                      width: "250px", // Set your desired width here
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      letterSpacing: 2,
                      borderWidth: 1.5,
                      padding: "0.85rem 1rem",
                      height: "50px",
                      margin: "0 auto",
                      display: "block",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Loading ..." : "LOG-IN"}
                  </Button>
                </div>
              </Form>
            </Container>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default PinLogin;
