import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { QRCode } from "react-qrcode-logo";
import {
  Button,
  Spinner,
  Alert,
  Container,
  InputGroup,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Col,
} from "react-bootstrap";

import OtpModal from "./otpModal";
import { io } from "socket.io-client";

const VerifikasiAkun = (props) => {
  const { axiosJWT, username, name } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [dataerror, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [initialValues, setInitialValues] = useState({
    id: "",
    pin: "",
    telp: "",
    nomor: "",
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [pin2, setPin2] = useState("");
  const [ubahdata, setUbahData] = useState(false);

  const handleButtonClick = () => {
    setUbahData(!ubahdata); // Toggles the state
  };

  const socketUrl = import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_AKTIVASI;
  const socket = io(socketUrl, {
    transports: ["websocket"], // Ensure using WebSocket transport
    secure: true, // Use secure WebSocket
  });

  const handleOpenModal = () => setShowOtpModal(true);
  const handleCloseModal = () => setShowOtpModal(false);

  useEffect(() => {
    socket.on("messageSent", (data) => {
      if (data.status === "sent") {
        handleOpenModal();
      } else {
        setAlertMessage(`Error : OTP dismiss pada tabel v3_bot`);
      }
    });
    return () => {
      socket.off("messageSent");
      socket.off("messageFailed");
    };
  }, []);

  function isComplexPIN(pin) {
    if (!pin || pin.length !== 6) {
      return false;
    }

    // Cek jika semua digit sama
    if (/^(\d)\1+$/.test(pin)) {
      return false;
    }

    // Cek jika PIN adalah angka berurutan naik atau turun
    const ascending = "0123456789";
    const descending = "9876543210";
    if (ascending.includes(pin) || descending.includes(pin)) {
      return false;
    }

    // Cek jika memiliki setidaknya dua kelompok angka yang berbeda
    const uniqueDigits = new Set(pin.split(""));
    if (uniqueDigits.size < 2) {
      return false;
    }

    return true;
  }

  useEffect(() => {
    setInitialValues({
      id: props.id,
      pin: "",
      telp: props.telp ? props.telp.slice(1) : "",
    });
    setError("");
  }, [props]);
  const validationSchema = Yup.object().shape({
    telp: Yup.string()
      .matches(/^\d+$/, "Nomor Telp harus berupa angka")
      .required("Nomor Telp Harus Diisi"),
    pin: Yup.string()
      .matches(/^\d+$/, "PIN harus berupa angka")
      .length(6, "PIN harus 6 digit")
      .test(
        "complexity",
        "Untuk keamanan akun anda gunakan angka yang lain",
        (value) => isComplexPIN(value)
      )
      .required("PIN Harus Diisi"),
    confirmpin: Yup.string()
      .oneOf([Yup.ref("pin"), null], "PIN tidak cocok")
      .required("Konfirmasi PIN Harus Diisi"),
  });
  function generateToken() {
    return Math.floor(Date.now() / 1000); // Get current time in seconds
  }
  const verifikasiAkun = async (values) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = generateToken();
      const Kirim = await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_AKTIVASI}`,
        {
          pin: values.pin,
          telp: values.telp,
          message: `SEND_PIN#${values.pin}#${username}#${name}#`,
          to: `62${values.telp}@c.us`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPin2(values.pin);
      setSuccessMessage("PIN berhasil dibuat dan dikirim!");
      handleOpenModal(); // Open OTP modal after PIN is sent
      setLoading(false);
    } catch (error) {
      const backendError =
        (error.response && error.response.data && error.response.data.status) ||
        "PIN Gagal dibuat";
      setError("PIN Gagal dibuat " + `[${backendError}]`);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (otp) => {
    handleCloseModal();
  };

  return (
    <>
      {props.status === "TRUE" && (
        <>
          <div className="d-flex justify-content-start align-items-center my-1">
            <div className="my-1">
              <QRCode value={props.pin} />
            </div>
          </div>
          <div style={{ marginLeft: "10px" }}>
            <Button variant="success" size="sm">
              Akun Sudah Terverifikasi
            </Button>
            <Button
              variant="danger"
              className="mx-2 my-2"
              size="sm"
              onClick={handleButtonClick}
            >
              Ubah PIN
            </Button>
          </div>
        </>
      )}

      {(props.status === "FALSE" || ubahdata) && (
        <Container>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={verifikasiAkun}
            enableReinitialize={true}
          >
            {({ values }) => (
              <>
                {loading && (
                  <div className="row my-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner
                        animation="border"
                        role="status"
                        size="md"
                        variant="secondary"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  </div>
                )}

                {dataerror && (
                  <div className="row mb-3">
                    <div className="col-sm-12">
                      <Alert
                        variant="danger"
                        onClose={() => setError("")}
                        dismissible
                      >
                        {dataerror}
                      </Alert>
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="row mb-3">
                    <div className="col-sm-12">
                      <Alert
                        variant="success"
                        onClose={() => setSuccessMessage("")}
                        dismissible
                      >
                        {successMessage}
                      </Alert>
                    </div>
                  </div>
                )}
                {alertMessage && (
                  <div className="row mb-3">
                    <div className="col-sm-12">
                      <Alert
                        variant="warning"
                        onClose={() => setAlertMessage("")}
                        dismissible
                      >
                        {alertMessage}
                      </Alert>
                    </div>
                  </div>
                )}

                <Form>
                  <FormGroup as={Row} className="mb-3">
                    <FormLabel htmlFor="telp" column sm={3}>
                      Nomor Telepon
                    </FormLabel>
                    <Col sm={9}>
                      <InputGroup>
                        <InputGroup.Text>62</InputGroup.Text>
                        <Field
                          as={FormControl}
                          type="text"
                          name="telp"
                          disabled
                          placeholder="Masukkan nomor telepon"
                          autoComplete="off"
                          value={props.telp ? props.telp.slice(1) : ""} // Menghilangkan karakter pertama
                        />
                      </InputGroup>
                      <ErrorMessage
                        name="telp"
                        component="div"
                        className="text-danger mt-2"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup as={Row} className="mb-3">
                    <FormLabel htmlFor="pin" column sm={3}>
                      PIN
                    </FormLabel>
                    <Col sm={9}>
                      <Field
                        type="password"
                        className="form-control"
                        name="pin"
                        placeholder="PIN [6 digit harus angka]"
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="pin"
                        component="div"
                        className="text-danger mt-2"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup as={Row} className="mb-3">
                    <FormLabel htmlFor="confirmpin" column sm={3}>
                      Konfirmasi PIN
                    </FormLabel>
                    <Col sm={9}>
                      <Field
                        type="password"
                        className="form-control"
                        name="confirmpin"
                        placeholder="Konfirmasi PIN [6 digit harus angka]"
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="confirmpin"
                        component="div"
                        className="text-danger mt-2"
                      />
                    </Col>
                  </FormGroup>

                  <Col sm={{ span: 9, offset: 3 }}>
                    <Button
                      variant="primary"
                      type="submit"
                      size="sm"
                      className="mx-2"
                    >
                      Buat PIN
                    </Button>
                  </Col>
                </Form>
              </>
            )}
          </Formik>

          <OtpModal
            show={showOtpModal}
            handleClose={handleCloseModal}
            handleOtpSubmit={handleOtpSubmit}
            pin={pin2} // Pass the pin to the modal
          />
        </Container>
      )}
    </>
  );
};
export default VerifikasiAkun;
