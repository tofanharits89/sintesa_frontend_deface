import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Container, Alert, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
const OtpModal = ({ show, handleClose, pin }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{4}$/, "OTP harus terdiri dari 4 digit angka.")
      .required("OTP harus diisi."),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_OTP,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("PIN Berhasil Dibuat");
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Terjadi Permasalahan Koneksi atau Server Backend";
      setErrorMessage(message);
      console.error("Error:", message);
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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Enter OTP</Modal.Title>
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
        {successMessage && (
          <Col md={12}>
            <div className="d-flex justify-content-center align-items-center">
              <Alert
                variant="success"
                onClose={() => setSuccessMessage(null)}
                style={{
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                {successMessage}
              </Alert>
            </div>
          </Col>
        )}
        <Formik
          initialValues={{ otp: "", username: username, token: token, pin: "" }}
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
                    placeholder="Masukkan OTP ..."
                    size="lg"
                    maxLength={4}
                    isInvalid={touched.otp && !!errors.otp}
                    className="otp-input"
                  />
                  {/* <Form.Control.Feedback type="invalid">
                    {errors.otp}
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Modal.Footer>
                  <Button
                    variant="danger"
                    type="submit"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Kirim OTP"}
                  </Button>
                </Modal.Footer>
              </Form>
            </Container>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default OtpModal;
