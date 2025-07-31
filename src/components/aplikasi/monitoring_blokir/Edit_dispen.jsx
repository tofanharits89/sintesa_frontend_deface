import React, { useState, useEffect, useContext } from "react";
import {
    Modal,
    Button,
    Form,
    Col,
    Row,
    Spinner,
    Card,
    Container,
    FloatingLabel,
} from "react-bootstrap";

import MyContext from "../../../auth/Context";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { handleHttpError } from "../notifikasi/toastError";
import NotifikasiSukses from "../notifikasi/notifsukses";
// import CekKppn from "../uploadkppn/cek_Kppn";
import Encrypt from "../../../auth/Random";


const Edit_dispen = ({ show, onHide, onUpdate, setRefresh, id }) => {
    const { axiosJWT, token, username, role } = useContext(MyContext);
    const [data, setData] = useState([]);
    const [sql, setSql] = useState("");
    const [loading, setLoading] = useState(false);
    const [kddept, setKddept] = useState("");
    const [kdunit, setKdunit] = useState("");
    const [target, setTarget] = useState("");
    const [dispensasi_blokir, setDispen_blokir] = useState("");
    const [blokir_7, setBlokir_7] = useState("");
    const [blokir_A, setBlokir_A] = useState("");
    const [deviasi, setDeviasi] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        getData();
    }, [id]);
    // console.log(kppn);
    useEffect(() => {
        if (data.length > 0) {
            const dispensasiData = data[0];

            setKddept(dispensasiData.kddept)
            setKdunit(dispensasiData.kdunit)
            setTarget(dispensasiData.target);
            setDispen_blokir(dispensasiData.dispensasi_blokir);
            setBlokir_7(dispensasiData.blokir_7);
            setBlokir_A(dispensasiData.blokir_A);
            setDeviasi(dispensasiData.deviasi);
        }
    }, [data]);

    const getData = async () => {
        setLoading(true);

        const encodedQuery = encodeURIComponent(
            `SELECT a.id, a.kddept, a.kdunit, SUM(a.target) as target_blokir, sum(a.dispensasi_blokir) as dispensasi_blokir, SUM(a.blokir_7 + a.blokir_A) as sudah_blokir, SUM(a.target) - SUM(a.dispensasi_blokir) - SUM(a.blokir_7 + a.blokir_A) AS sisa
    FROM laporan_2023.target_blokir_perjadin a WHERE a.id=${id} GROUP BY a.id, a.kddept, a.kdunit`
        );

        const cleanedQuery = decodeURIComponent(encodedQuery)
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        setSql(cleanedQuery);
        const encryptedQuery = Encrypt(cleanedQuery);
        try {
            const response = await axiosJWT.get(
                import.meta.env.VITE_REACT_APP_LOCAL_MONITORINGBLOKIR
                    ? `${import.meta.env.VITE_REACT_APP_LOCAL_MONITORINGBLOKIR
                    }${encryptedQuery}&user=${username}`
                    : "",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setData(response.data.result);
            setLoading(false);
        } catch (error) {
            const { status, data } = error.response || {};
            handleHttpError(
                status,
                (data && data.error) ||
                "Terjadi Permasalahan Koneksi atau Server Backend"
            );
            console.log(error);
            setLoading(false);
        }
    };

    const handleSubmitdata = async (values, { setSubmitting }) => {
        setLoading(true);
        // console.log(values);
        try {
            await axiosJWT.patch(
                import.meta.env.VITE_REACT_APP_LOCAL_EDITDISPENBLOKIR,
                values,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            NotifikasiSukses("Data Berhasil Diubah");
            setRefresh(true);
        } catch (error) {
            const { status, data } = error.response || {};
            handleHttpError(
                status,
                (data && data.error) ||
                "Terjadi Permasalahan Koneksi atau Server Backend"
            );

            setLoading(false);
        }
        setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
        dispensasi_blokir: Yup.number()
            .nullable()
            .typeError("Harus berupa angka")
            .min(0, "Harus berupa angka non-negatif atau nol")
            .integer("Harus berupa angka bulat")
            .required("Harus diisi"),
    });

    // const tutupModal = () => {
    //     onHide();
    //     onUpdate();
    //     // setCekKppn("");

    //     // setJenis("");
    // };
    const tutupModal = () => {
        // Notify parent about data update before hiding the modal
        if (onUpdate) {
            onUpdate();
        }
        onHide();
    };


    const handleDataUpdated = () => {
        // Trigger refresh by updating a key
        setRefreshKey((prev) => prev + 1);
    };

    // console.log("ID yang diterima:", id);

    return (
        <Container fluid>
            <Modal
                show={show}
                onHide={tutupModal}
                onUpdate={handleDataUpdated}
                backdrop="static"
                keyboard={false}
                size="xl"
                animation={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: "20px" }}>
                        <i className="bi bi-back text-success mx-3"></i>
                        Rekam Dispensasi Blokir
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body className="my-4 mx-4 ">
                            <Formik
                                validationSchema={validationSchema}
                                onSubmit={handleSubmitdata}
                                enableReinitialize={true}
                                initialValues={{
                                    kddept: kddept,
                                    kdunit: kdunit,
                                    target: target,
                                    dispensasi_blokir: dispensasi_blokir,
                                    blokir_7: blokir_7,
                                    blokir_A: blokir_A,
                                    deviasi: deviasi,
                                    id: id,
                                }}
                            >
                                {({ handleSubmit, handleChange, values, setFieldValue }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <FloatingLabel label="Nilai Dispensasi" className="mb-3">
                                            <Form.Control
                                                type="number"
                                                name="dispensasi_blokir"
                                                value={values.dispensasi_blokir}
                                                onChange={handleChange}
                                                placeholder="Nilai Dispensasi"
                                            />
                                            <ErrorMessage name="dispensasi_blokir" component="div" className="text-danger" />
                                        </FloatingLabel>

                                        <div className="d-flex justify-content-between my-4 align-items-bottom">
                                            <hr />
                                            <div>
                                                <Button
                                                    type="submit"
                                                    variant="danger"
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
                                                                className="mx-2"
                                                            />
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        "Simpan"
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className="mx-2"
                                                    onClick={tutupModal}
                                                >
                                                    Tutup
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Edit_dispen;