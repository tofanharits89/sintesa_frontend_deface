import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Card,
  Container,
  FloatingLabel,
  Table,
  Button,
  ButtonGroup,
  Row,
  Col,
  Form,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import numeral from "numeral";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";
import moment from "moment";
import CekKppn from "../../referensi/referensi_dau/cek_Kppn";
import CekKdpemda from "../../referensi/referensi_dau/cek_Kdpemda";
import { Formik, Field, ErrorMessage } from "formik";
import RefKppn from "../../referensi/referensi_dau/ref_Kppn";
import { CekAlokasi } from "../../referensi/referensi_dau/cek_Alokasi";
import KdBulan from "../../referensi/referensi_dau/ref_bulan";

const RekamKMKModalTambahPenundaan = ({ show, onHide, id }) => {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [kppn, setCekKppn] = useState("");
  const [kdpemda, setKdpemda] = useState("");
  const [alokasi, setAlokasi] = useState("");
  const [sql, setSql] = useState("");
  const [bulan, setBulan] = useState("");
  const [periode, setPeriode] = useState("");
  const [thang, setThang] = useState("");
  const [jenis, setJenis] = useState("");
  const [nokmk, setNokmk] = useState("");
  const [uraian, setUraian] = useState("");
  const [kriteria, setKriteria] = useState("");
  const [formDataFromChild, setFormDataFromChild] = useState({}); // State untuk menyimpan data dari komponen anak

  const handleReceiveFormData = (formData) => {
    setFormDataFromChild(formData);
  };

  useEffect(() => {
    id && getData();
  }, [id]);
  //console.log(formDataFromChild);
  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.id,(SELECT NOW() FROM DUAL) AS update_data,a.thang,a.no_kmk,a.tgl_kmk,
      SUBSTR(a.uraian,1,40) uraian,a.jenis,a.kriteria,nm_kriteria,nmjenis,a.status_cabut FROM tkd.ref_kmk_dau a
      LEFT OUTER JOIN ( SELECT b.jenis,b.nmjenis AS nmjenis FROM tkd.ref_kmk b) b ON a.jenis=b.jenis
      LEFT OUTER JOIN ( SELECT c.id_kriteria,c.nm_kriteria AS nm_kriteria FROM tkd.ref_kmk_dau_kriteria c) c 
      ON a.kriteria=c.id_kriteria	 WHERE a.id='${id}'  GROUP BY a.no_kmk limit 1`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      setBulan(
        moment(response.data.result[0].tgl_kmk, "YYYY-MM-DD").format("MM")
      );
      setKriteria(response.data.result[0].kriteria);
      setThang(response.data.result[0].thang);
      setNokmk(response.data.result[0].no_kmk);
      setJenis(response.data.result[0].jenis);
      setUraian(response.data.result[0].uraian);
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
  const handleModalClose = () => {
    onHide();
    setCekKppn("");
    setKdpemda("");
  };

  const handleCekKppn = (kppn) => {
    setCekKppn(kppn);
    setKdpemda("");
    setAlokasi("");
  };
  const handleCekKdpemda = (kdpemda) => {
    setKdpemda(kdpemda);
    setAlokasi("");
  };
  const handleCekAlokasi = (alokasi) => {
    setCekKppn(kppn);
    setKdpemda("");
  };
  const handleCekPeriode = (periode) => {
    setPeriode(periode);
  };
  //  console.log(periode);
  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      //  console.log(values);
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANPENUNDAAN,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      Swal.fire({
        html: `<div className='text-success mt-4'>Data Berhasil Disimpan</div>`,
        icon: "success", // Tambahkan ikon error
        position: "top",
        buttonsStyling: false,
        customClass: {
          popup: "swal2-animation",
          container: "swal2-animation",
          confirmButton: "swal2-confirm ", // Gunakan kelas CSS kustom untuk tombol
          icon: "swal2-icon", // Gunakan kelas CSS kustom untuk ikon
        },
        confirmButtonText: "Tutup",
      });
    } catch (error) {
      // console.log(error);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }

    setSubmitting(false); // Atur kembali nilai setSubmitting menjadi false
    setLoading(false);
  };

  const validationSchema = Yup.object().shape({
    periode: Yup.string().required("Periode harus dipilih"),
    kppn: Yup.string().required("KPPN harus dipilih"),
    kdpemda: Yup.string().required("Kabkota harus dipilih"),
    alokasi: Yup.string().required("Alokasi harus terisi"),
    thang: Yup.string().required("thang harus terisi"),
    jenis: Yup.string().required("jenis harus terisi"),
    nokmk: Yup.string().required("nokmk harus terisi"),
    kriteria: Yup.string().required("kriteria harus terisi"),
    uraian: Yup.string().required("uraian harus terisi"),
    jan1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    peb1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    mar1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    apr1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    mei1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    jun1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    jul1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    ags1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    sep1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    okt1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    nov1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
    des1: Yup.number()
      .typeError("Harus berupa angka")
      .min(0, "Tidak boleh negatif"),
  });

  const months = [
    { name: "jan1", label: "Januari" },
    { name: "peb1", label: "Februari" },
    { name: "mar1", label: "Maret" },
    { name: "apr1", label: "April" },
    { name: "mei1", label: "Mei" },
    { name: "jun1", label: "Juni" },
    { name: "jul1", label: "Juli" },
    { name: "ags1", label: "Agustus" },
    { name: "sep1", label: "September" },
    { name: "okt1", label: "Oktober" },
    { name: "nov1", label: "November" },
    { name: "des1", label: "Desember" },
    { name: "nokmk", label: "NO KMK kosong" },
  ];

  const renderErrorMessages = () => {
    return months.map((month) => (
      <ErrorMessage
        key={month.name}
        name={month.name}
        render={(msg) => (
          <div className="text-danger">
            {msg && `Error pada bulan ${month.label}: ${msg}`}
          </div>
        )}
      />
    ));
  };

  return (
    <Container>
      <Modal
        show={show}
        onHide={handleModalClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        animation={false}
        fullscreen={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>
            <i className="bi bi-box-arrow-in-up-right text-success mx-3"></i>
            Rekam Data Penundaan Alokasi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <div className="mt-3 mb-3 fade-in">
                {data && data.length > 0 ? (
                  <>
                    <Row>
                      <Col md={12}>
                        <Button
                          variant="primary"
                          className="btn-sm mx-2 my-1"
                          style={{ whiteSpace: "normal" }}
                        >
                          No KMK : {data[0].no_kmk || "Data Kosong"} Tanggal{" "}
                          {moment(data[0].tgl_kmk, "YYYY-MM-DD").format(
                            "DD-MM-YYYY"
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          className="btn-sm mx-2 my-1"
                          style={{ whiteSpace: "normal" }}
                        >
                          Uraian : {data[0].uraian || "Data Kosong"}
                        </Button>{" "}
                        <Button
                          variant="secondary"
                          className="btn-sm mx-2 my-1"
                          style={{ whiteSpace: "normal" }}
                        >
                          Kriteria : {data[0].nm_kriteria || "Data Kosong"}
                        </Button>{" "}
                      </Col>
                    </Row>
                  </>
                ) : (
                  <p className="text-danger fw-bold">
                    Form Error, Tidak ada data yang tersedia
                  </p>
                )}
              </div>

              <hr />
              <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmitdata}
                enableReinitialize={true}
                initialValues={{
                  periode: periode,
                  kdpemda: kdpemda,
                  kppn: kppn,
                  jan1: formDataFromChild.jan1,
                  peb1: formDataFromChild.peb1,
                  mar1: formDataFromChild.mar1,
                  apr1: formDataFromChild.apr1,
                  mei1: formDataFromChild.mei1,
                  jun1: formDataFromChild.jun1,
                  jul1: formDataFromChild.jul1,
                  ags1: formDataFromChild.ags1,
                  sep1: formDataFromChild.sep1,
                  okt1: formDataFromChild.okt1,
                  nov1: formDataFromChild.nov1,
                  des1: formDataFromChild.des1,
                  alokasi: formDataFromChild.alokasi,
                  thang: thang,
                  jenis: jenis,
                  nokmk: nokmk,
                  kriteria: kriteria,
                  uraian: uraian,
                }}
              >
                {({ handleSubmit, handleChange, values, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col sm={12} md={6} lg={6} xl={6} className={`mt-2`}>
                        <Form.Group controlId="kppn">
                          <Form.Label>KPPN</Form.Label>
                          <RefKppn
                            name="kppn"
                            kppn={kppn}
                            as="select" // Mengganti input text dengan elemen select
                            className="form-select form-select-md text-select"
                            onChange={(e) => {
                              handleChange(e);
                              handleCekKppn(e);
                            }}
                          />
                          <ErrorMessage
                            name="kppn"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={6} className={`mt-2`}>
                        <Form.Group controlId="kdpemda">
                          <Form.Label>Kabupaten/ Kota</Form.Label>
                          <CekKdpemda
                            name="kdpemda"
                            kppn={kppn}
                            kdpemda={kdpemda}
                            as="select" // Mengganti input text dengan elemen select
                            className="form-select form-select-md text-select"
                            onChange={(e) => {
                              handleChange(e);
                              handleCekKdpemda(e);
                            }}
                          />

                          <ErrorMessage
                            name="kdpemda"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6} lg={6} xl={6} className={`mt-2`}>
                        <Form.Group controlId="periode">
                          <Form.Label>Periode</Form.Label>
                          <KdBulan
                            name="periode"
                            as="select" // Mengganti input text dengan elemen select
                            className="form-select form-select-md text-select"
                            onChange={(e) => {
                              handleChange(e);
                              handleCekPeriode(e);
                            }}
                          />

                          <ErrorMessage
                            name="periode"
                            component="div"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={12} lg={12} xl={12} className={`mt-2`}>
                        <Form.Group controlId="kdpemda">
                          <CekAlokasi
                            name="alokasi"
                            periode={periode}
                            bulan={bulan}
                            kppn={kppn}
                            kriteria={kriteria}
                            kdpemda={kdpemda}
                            onReceiveFormData={handleReceiveFormData}
                            as="select" // Mengganti input text dengan elemen select
                            className="form-select form-select-md text-select"
                            onChange={(e) => {
                              handleChange(e);
                              handleCekAlokasi(e);
                            }}
                          />
                          {renderErrorMessages()}
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end my-4">
                      <Button type="submit" variant="danger" disabled={loading}>
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
                        onClick={handleModalClose}
                      >
                        Tutup
                      </Button>
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

export default RekamKMKModalTambahPenundaan;
