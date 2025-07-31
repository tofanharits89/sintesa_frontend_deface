import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { NotifPesan } from "../notifikasi/Omspan";

export default function RekamAPI({ show, onHide }) {
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [data, setData] = useState(""); // Set default value to an empty string

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const query = `SELECT id, api, jenis FROM bot.api WHERE jenis='flowise'`;
    const encryptedQuery = Encrypt(query.trim());

    try {
      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_BOTCENTER
        }${encryptedQuery}&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result[0].api); // Save the fetched API to the state
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (show) {
      setAnimationClass("modal-body-animation-enter");
    } else {
      setAnimationClass("modal-body-animation-exit");
    }
  }, [show]);

  const validationSchema = Yup.object().shape({
    apiflowise: Yup.string().required("API harus diisi"),
  });

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ apiflowise: data }} // Set the initial value with the fetched API
      enableReinitialize={true} // Ensure Formik reinitializes when 'data' changes
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true);
        try {
          await axiosJWT.patch(
            import.meta.env.VITE_REACT_APP_LOCAL_SIMPAN_API_FLOWISE,
            values,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          NotifPesan("API Flowise Berhasil Disimpan");
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
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Container fluid>
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col sm={12} md={12} lg={12} xl={8}>
                <Form.Group className="mb-1">
                  <Form.Label className="fw-bold">Flowise API Key</Form.Label>
                  <Field
                    name="apiflowise"
                    value={values.apiflowise} // Bind the value from Formik's state
                    type="text"
                    placeholder="API key Flowise AI"
                    as={Form.Control}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="apiflowise"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
            </Row>

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
                  Loading...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </Form>
        </Container>
      )}
    </Formik>
  );
}
