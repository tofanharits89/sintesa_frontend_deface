import React, { useState, useContext, useEffect } from "react";
import { Modal, Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
import DatePicker from "react-datepicker";

export default function Rekam({ show, onHide, tahun, triwulan, kdkanwil, ndkanwilpilih, onSaveSuccess }) {
    const { axiosJWT, token } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [nd_kanwil, setNdkanwil] = useState("");
    const [rekamanSebelumnya, setRekamanSebelumnya] = useState([]); // Menyimpan data tahun & triwulan yang sudah direkam
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // Daftar tahun untuk dropdown (2025 - 2027)
    const tahunOptions = Array.from({ length: 3 }, (_, i) => 2025 + i);

    // Daftar triwulan (1 - 4)
    const triwulanOptions = [1, 2, 3, 4];

    // Update waktu setiap detik
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Konversi waktu ke GMT+7
    const getGMT7Time = () => {
        const utcTime = currentDateTime.getTime() + currentDateTime.getTimezoneOffset() * 60000;
        const gmt7Time = new Date(utcTime + 7 * 3600000);
        return gmt7Time.toLocaleTimeString("id-ID");
    };

    useEffect(() => {
        if (show) {
            setNdkanwil(ndkanwilpilih || "");
            fetchDataRekaman();
        }
    }, [show, ndkanwilpilih]);

    // Ambil daftar tahun & triwulan yang sudah pernah direkam dari backend
    const fetchDataRekaman = async () => {
        try {
            const response = await axiosJWT.get(`${import.meta.env.VITE_REACT_APP_LOCAL_GET_REKAMAN}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRekamanSebelumnya(response.data); // Simpan daftar rekaman sebelumnya
        } catch (error) {
            console.error("Gagal mengambil data rekaman:", error);
        }
    };

    const initialValues = {
        tahun: tahun || "",
        triwulan: triwulan || "",
        kdkanwil,
        nd_kanwil: null,
    };

    const validationSchema = Yup.object().shape({
        tahun: Yup.string().required("Tahun wajib dipilih"),
        triwulan: Yup.string().required("Triwulan wajib dipilih"),
        nd_kanwil: Yup.mixed()
            .required("File belum dipilih")
            .test("fileSize", "Ukuran file maksimal 2MB", (value) => !value || value.size <= 2 * 1024 * 1024)
            .test("fileType", "Hanya file PDF diperbolehkan", (value) => !value || value.type === "application/pdf"),
    });

    const handleNdkanwilChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            setNdkanwil(file);
            setFieldValue("nd_kanwil", file);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        if (!token) {
            Swal.fire("Error", "Token tidak ditemukan, silakan login ulang", "error");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("kdkanwil", values.kdkanwil);
        formData.append("tahun", values.tahun);
        formData.append("triwulan", values.triwulan);
        formData.append("nd_kanwil", values.nd_kanwil);

        try {
            await axiosJWT.patch(`${import.meta.env.VITE_REACT_APP_LOCAL_UPDATE_LAPPNBP}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire("Sukses", "Data berhasil disimpan", "success").then(() => {
                onSaveSuccess(values.nd_kanwil);
                onHide();
            });
        } catch (error) {
            handleHttpError(error.response?.status, error.response?.data?.error || "Terjadi kesalahan");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    // Cek apakah kombinasi tahun dan triwulan sudah direkam
    const isDisabled = (tahun, triwulan) => {
        return rekamanSebelumnya.some(
            (rekam) => rekam.tahun === tahun && rekam.triwulan === triwulan
        );
    };
    // console.log("nmkanwil:", nmkanwil, kdkanwil);

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Kirim Nota Dinas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik validationSchema={validationSchema} onSubmit={handleSubmit} initialValues={initialValues}>
                    {({ handleSubmit, setFieldValue, values }) => (
                        <Container>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Tahun</Form.Label>
                                            <Form.Select
                                                value={values.tahun}
                                                onChange={(e) => setFieldValue("tahun", e.target.value)}
                                            >
                                                <option value="">Pilih Tahun</option>
                                                {tahunOptions.map((year) => (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                        disabled={triwulanOptions.some((tri) => isDisabled(year, tri))}
                                                    >
                                                        {year}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Triwulan</Form.Label>
                                            <Form.Select
                                                value={values.triwulan}
                                                onChange={(e) => setFieldValue("triwulan", e.target.value)}
                                            >
                                                <option value="">Pilih Triwulan</option>
                                                {triwulanOptions.map((tri) => (
                                                    <option
                                                        key={tri}
                                                        value={tri}
                                                        disabled={isDisabled(values.tahun, tri)}
                                                    >
                                                        Triwulan {tri}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>File Nota Dinas (Maks. 2 MB)</Form.Label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => handleNdkanwilChange(e, setFieldValue)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {" "}
                                <div className="mt-3 text-center">
                                    <p className="fw-bold" style={{ fontSize: "20px" }}>
                                        {getGMT7Time()}
                                    </p>
                                    <p style={{ fontSize: "15px" }}>Waktu Server (GMT +7)</p>
                                </div>
                                {/* Tombol Simpan & Tutup */}
                                <div className="d-flex justify-content-end mt-3">
                                    <Button type="submit" variant="danger" disabled={loading}>
                                        {loading ? <Spinner animation="border" size="sm" /> : "Simpan"}
                                    </Button>
                                    <Button variant="secondary" className="ms-2" onClick={onHide}>
                                        Tutup
                                    </Button>
                                </div>
                            </Form>
                        </Container>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
}
