import React, { useState, useContext } from "react";
import {
  Modal,
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  ModalFooter,
  Nav,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
import { BsFillPlusSquareFill, BsTrash } from "react-icons/bs"; // Import plus and trash icons
import { Tab } from "react-bootstrap";
import DataSPM from "./dataSPM";
import DataKontrak from "./datakontrak";
import DataKontrakDetail from "./dataKontrakDetail";
import moment from "moment";
import UploadKontrak from "./uploadKontrak";

export default function RekamKontrak({
  show,
  onHide,
  id,
  nomor,
  kdsatker,
  nmsatker,
  tahun,
}) {
  const { axiosJWT, token, kdlokasi } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [cek, setCek] = useState(false);
  const [formRows, setFormRows] = useState([
    {
      nilaikontrak: "",
      nokontrak: "",
      tgkontrak: null,
      status: "Setuju",
    },
  ]);
  const [cekupload, setCekupload] = useState(false);
  const handleCekUpload = () => {
    setCekupload(true);
    setCek(false);
  };
  const addRow = () => {
    setFormRows([
      ...formRows,
      {
        nilaikontrak: "",
        nokontrak: "",
        tgkontrak: null,
        status: "Setuju", // Set the default value here
      },
    ]);
  };
  // console.log(tahun);
  const removeRow = (index, values, setValues) => {
    const updatedRows = [...formRows];
    updatedRows.splice(index, 1);
    setFormRows(updatedRows);

    // Reset the form fields for the removed row
    const resetRow = {
      nilaikontrak: "",
      nokontrak: "",

      tgkontrak: null,

      status: "Setuju",
    };
    setValues({
      ...values,
      formRows: values.formRows.map((row, rowIndex) =>
        rowIndex === index ? resetRow : row
      ),
    });
  };

  const initialValues = {
    id,
    tahun: tahun,
    formRows,
  };

  const validationSchema = Yup.object().shape({
    formRows: Yup.array().of(
      Yup.object().shape({
        nokontrak: Yup.string().required("harus diisi"),
        nilaikontrak: Yup.number().required("hanya angka"),

        tgkontrak: Yup.date().required("harus diisi"),

        status: Yup.string().required("harus diisi"),
      })
    ),
  });

  const handleSubmitdata = async (formRows, { setSubmitting }) => {
    setCek(false);
    try {
      await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_SIMPANLAMPIRANKONTRAK}`,
        formRows,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      Swal.fire({
        html: `<div className='text-success mt-4'>Data Kontrak Berhasil Disimpan</div>`,
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
      setCek(true);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setFormRows([
      {
        nilaikontrak: "",
        nokontrak: "",
        nobast: "",
        tgkontrak: null,
        tglbast: null,
        status: "Setuju",
      },
    ]);

    onHide();
  };
  const handleCek = () => {
    setCek(true);
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
      size="xl"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>
          <i className="bi bi-box-arrow-in-right text-success mx-3"></i>
          Data Dispensasi Kontrak
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: "auto", height: "600px" }}>
        <Tab.Container defaultActiveKey="dispensasi-overview">
          <Nav
            variant="tabs"
            className="nav-tabs-bordered sticky-user is-sticky-user mb-0 mt-2"
            role="tablist"
          >
            <Nav.Item className="dispensasi-tab">
              <Nav.Link eventKey="dispensasi-overview" role="tab">
                Rekam Kontrak
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="dispensasi-upload"
                role="tab"
                onClick={handleCekUpload}
              >
                Upload Excell
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="dispensasi-edit"
                role="tab"
                onClick={handleCek}
              >
                Data Kontrak
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="pt-2">
            <Tab.Pane eventKey="dispensasi-overview" role="tabpanel">
              <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmitdata}
                initialValues={initialValues}
              >
                {({
                  handleSubmit,
                  setFieldValue,
                  values,
                  setValues,
                  touched,
                  errors,
                }) => (
                  <Container className="mt-2">
                    <Form noValidate onSubmit={handleSubmit}>
                      <div className="d-flex justify-content-between align-bottom">
                        <span className="fw-bold text-success">
                          SATKER : {nmsatker} ({kdsatker}) <br />
                          Nomor Permohonan : {nomor}
                        </span>
                        <span>
                          <Button
                            type="submit"
                            size="sm"
                            variant="danger"
                            className="mt-1 mb-0"
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
                              "Simpan Data"
                            )}
                          </Button>
                        </span>
                      </div>

                      <hr />
                      <div className="text-end">
                        <BsFillPlusSquareFill
                          onClick={addRow}
                          className="my-1 text-primary"
                          style={{
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      {formRows.map((row, index) => (
                        <>
                          <Row>
                            <Col sm={6} md={6} lg={5} xl={5}>
                              <Form.Group className="fw-normal my-1">
                                <Field
                                  name={`formRows[${index}].nokontrak`}
                                  type="text"
                                  placeholder="Nomor Kontrak/ Adendum"
                                  as={Form.Control}
                                />
                                <ErrorMessage
                                  name={`formRows[${index}].nokontrak`}
                                  component="div"
                                  className="text-danger"
                                />
                              </Form.Group>
                            </Col>

                            <Col sm={6} md={6} lg={3} xl={3}>
                              <Form.Group className="fw-normal my-1">
                                <DatePicker
                                  name={`formRows[${index}].tgkontrak`}
                                  className="form-control"
                                  selected={
                                    values.formRows[index] &&
                                    values.formRows[index].tgkontrak
                                      ? moment(
                                          values.formRows[index].tgkontrak
                                        ).toDate()
                                      : null
                                  }
                                  onChange={(date) => {
                                    setFieldValue(
                                      `formRows[${index}].tgkontrak`,
                                      moment(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText="Tgl Kontrak"
                                  autoComplete="off"
                                  timeZone="UTC" // Add timeZone to ensure consistency
                                />

                                <ErrorMessage
                                  name={`formRows[${index}].tgkontrak`}
                                  component="div"
                                  className="text-danger"
                                />
                              </Form.Group>
                            </Col>

                            <Col sm={6} md={6} lg={4} xl={4}>
                              <Form.Group className="fw-normal my-1">
                                <Field
                                  name={`formRows[${index}].nilaikontrak`}
                                  type="number"
                                  placeholder="Nilai Kontrak"
                                  as={Form.Control}
                                />
                                <ErrorMessage
                                  name={`formRows[${index}].nilaikontrak`}
                                  component="div"
                                  className="text-danger"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={6} md={6} lg={12} xl={12}>
                              <Form.Group className="fw-normal my-1">
                                <Form.Check
                                  inline
                                  type="radio"
                                  name={`formRows[${index}].status`}
                                  value="Setuju"
                                  label="Disetujui"
                                  checked={
                                    values.formRows[index] &&
                                    values.formRows[index].status === "Setuju"
                                  }
                                  onChange={() => {
                                    setFieldValue(
                                      `formRows[${index}].status`,
                                      "Setuju"
                                    );
                                  }}
                                />
                                <Form.Check
                                  inline
                                  type="radio"
                                  name={`formRows[${index}].status`}
                                  value="Tolak"
                                  label="Ditolak"
                                  checked={
                                    values.formRows[index] &&
                                    values.formRows[index].status === "Tolak"
                                  }
                                  onChange={() => {
                                    setFieldValue(
                                      `formRows[${index}].status`,
                                      "Tolak"
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`formRows[${index}].status`}
                                  component="div"
                                  className="text-danger"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <hr className="text-danger" />
                        </>
                      ))}
                    </Form>
                  </Container>
                )}
              </Formik>
            </Tab.Pane>
            <Tab.Pane eventKey="dispensasi-edit" role="tabpanel">
              <DataKontrakDetail cek={cek} id={id} />
            </Tab.Pane>
            <Tab.Pane eventKey="dispensasi-upload" role="tabpanel">
              <UploadKontrak cekupload={cekupload} id={id} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}
