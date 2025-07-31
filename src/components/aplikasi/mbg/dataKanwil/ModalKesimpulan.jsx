import { Button, Form, Row, Col } from "react-bootstrap";
import { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import MyContext from "../../../../auth/Context";

// Helper function untuk menghitung kata
const countWords = (text) => {
  if (!text || text.trim() === "") return 0;
  return text.trim().split(/\s+/).length;
};

// Validasi schema dengan word count
const validationSchema = Yup.object({
  kdkanwil: Yup.string().required("Kanwil tidak boleh kosong"),
  triwulan: Yup.string().required("Triwulan tidak boleh kosong"),
  tahun: Yup.string().required("Tahun tidak boleh kosong"),
  kesimpulan: Yup.string()
    .required("Kesimpulan tidak boleh kosong")
    .test("word-count", "Maksimal 200 kata", function (value) {
      return countWords(value) <= 200;
    }),
  rekomendasi: Yup.string()
    .required("Rekomendasi tidak boleh kosong")
    .test("word-count", "Maksimal 300 kata", function (value) {
      return countWords(value) <= 300;
    }),
});

export const ModalKesimpulan = ({ id, show, onClose }) => {
  const {
    axiosJWT,
    username,
    token,
    role,
    kdkanwil: userKanwil,
  } = useContext(MyContext);

  // Helper functions untuk pembatasan role
  const getKanwilMapping = () => {
    return {
      "01": "01 - DAERAH ISTIMEWA ACEH",
      "02": "02 - SUMATERA UTARA",
      "03": "03 - SUMATERA BARAT",
      "04": "04 - RIAU",
      "05": "05 - JAMBI",
      "06": "06 - SUMATERA SELATAN",
      "08": "08 - BENGKULU",
      "07": "07 - LAMPUNG",
      "09": "09 - BANGKA BELITUNG",
      31: "31 - KEPULAUAN RIAU",
      11: "11 - DKI JAKARTA",
      12: "12 - JAWA BARAT",
      13: "13 - JAWA TENGAH",
      14: "14 - DI JOGJAKARTA",
      15: "15 - JAWA TIMUR",
      10: "10 - BANTEN",
      20: "20 - BALI",
      21: "21 - NUSA TENGGARA BARAT",
      22: "22 - NUSA TENGGARA TIMUR",
      16: "16 - KALIMANTAN BARAT",
      17: "17 - KALIMANTAN TENGAH",
      18: "18 - KALIMANTAN SELATAN",
      19: "19 - KALIMANTAN TIMUR",
      34: "34 - KALIMANTAN UTARA",
      27: "27 - SULAWESI UTARA",
      24: "24 - SULAWESI TENGAH",
      23: "23 - SULAWESI SELATAN",
      25: "25 - SULAWESI TENGGARA",
      26: "26 - GORONTALO",
      32: "32 - SULAWESI BARAT",
      29: "29 - MALUKU",
      28: "28 - MALUKU UTARA",
      33: "33 - PAPUA BARAT",
      30: "30 - PAPUA",
    };
  };

  const getDefaultKanwil = () => {
    if (role === "2" && userKanwil) {
      const mapping = getKanwilMapping();
      // Jika userKanwil sudah format lengkap, gunakan langsung
      if (userKanwil.includes(" - ")) {
        return userKanwil;
      }
      // Jika userKanwil hanya kode, convert ke format lengkap
      return mapping[userKanwil] || userKanwil;
    }
    return "33 - PAPUA BARAT";
  };

  const getKanwilOptions = () => {
    const allOptions = [
      "01 - DAERAH ISTIMEWA ACEH",
      "02 - SUMATERA UTARA",
      "03 - SUMATERA BARAT",
      "04 - RIAU",
      "05 - JAMBI",
      "06 - SUMATERA SELATAN",
      "08 - BENGKULU",
      "07 - LAMPUNG",
      "09 - BANGKA BELITUNG",
      "31 - KEPULAUAN RIAU",
      "11 - DKI JAKARTA",
      "12 - JAWA BARAT",
      "13 - JAWA TENGAH",
      "14 - DI JOGJAKARTA",
      "15 - JAWA TIMUR",
      "10 - BANTEN",
      "20 - BALI",
      "21 - NUSA TENGGARA BARAT",
      "22 - NUSA TENGGARA TIMUR",
      "16 - KALIMANTAN BARAT",
      "17 - KALIMANTAN TENGAH",
      "18 - KALIMANTAN SELATAN",
      "19 - KALIMANTAN TIMUR",
      "34 - KALIMANTAN UTARA",
      "27 - SULAWESI UTARA",
      "24 - SULAWESI TENGAH",
      "23 - SULAWESI SELATAN",
      "25 - SULAWESI TENGGARA",
      "26 - GORONTALO",
      "32 - SULAWESI BARAT",
      "29 - MALUKU",
      "28 - MALUKU UTARA",
      "33 - PAPUA BARAT",
      "30 - PAPUA",
    ];

    if (role === "2" && userKanwil) {
      const mapping = getKanwilMapping();
      // Jika userKanwil sudah format lengkap, gunakan langsung
      if (userKanwil.includes(" - ")) {
        return [userKanwil];
      }
      // Jika userKanwil hanya kode, convert ke format lengkap
      const fullFormat = mapping[userKanwil];
      return fullFormat ? [fullFormat] : [userKanwil];
    }
    return allOptions;
  };

  const [currentKodeKanwil, setCurrentKodeKanwil] = useState(
    getDefaultKanwil()
  );

  // Ambil baseURL dari VITE (ganti sesuai env yang kamu pakai)
  const baseURL =
    import.meta.env.VITE_REACT_APP_LOCAL_SIMPANDATAKANWIL ||
    import.meta.env.VITE_REACT_APP_SIMPANDATAKANWIL;

  const handleClose = (resetForm) => {
    resetForm();
    if (onClose) onClose();
  };

  const handleTextChange = (fieldName, value, setFieldValue, maxWords) => {
    const wordCount = countWords(value);

    // Jika word count melebihi batas, potong teks
    if (wordCount > maxWords) {
      const words = value.trim().split(/\s+/);
      const limitedText = words.slice(0, maxWords).join(" ");
      setFieldValue(fieldName, limitedText);
    } else {
      setFieldValue(fieldName, value);
    }
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        background:
          "linear-gradient(120deg, rgba(103,58,183,0.10) 0%, rgba(156,39,176,0.08) 100%)",
        borderRadius: "18px",
        boxShadow: "0 4px 24px 0 rgba(103,58,183,0.08)",
        backdropFilter: "blur(8px)",
        border: "1.5px solid rgba(103,58,183,0.13)",
        padding: "0.5rem 0.5rem 0.5rem 0.5rem",
        fontSize: "0.8rem", // minimalist
        minWidth: 0,
      }}
    >
      <Formik
        initialValues={{
          kdkanwil: getDefaultKanwil(),
          triwulan: "I",
          tahun: "2025",
          kesimpulan: "",
          rekomendasi: "",
          username: username || "n/a",
          id: id,
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          try {
            // Extract kode kanwil dari format lengkap (misal: "14 - DI JOGJAKARTA" -> "14")
            const kodeKanwil = values.kdkanwil.split(" - ")[0];

            const payload = {
              kode_kanwil: kodeKanwil, // kirim hanya kode ke backend
              triwulan: values.triwulan,
              tahun: values.tahun,
              kesimpulan: values.kesimpulan,
              saran: values.rekomendasi, // map rekomendasi -> saran
              username: username || values.username,
              id: "5", // fixed for kesimpulan/saran
            };
            // Pastikan baseURL sudah endpoint lengkap, tidak perlu tambah /simpan/data/kanwil
            await axiosJWT.post(
              baseURL,
              { data: payload },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            Swal.fire({
              title: "Berhasil!",
              text: "Data kesimpulan dan saran berhasil disimpan.",
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            handleClose(resetForm);
          } catch (error) {
            // console.error("Error saving kesimpulan data:", error);
            Swal.fire({
              title: "Gagal Menyimpan!",
              text: "Terjadi kesalahan saat menyimpan data kesimpulan dan saran. Silakan coba lagi.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
          resetForm,
        }) => (
          <Form onSubmit={handleSubmit} className="p-2">
            {/* Header Row */}
            <Row className="mb-2 g-1">
              <Col xs={6} md={2}>
                <Form.Group className="mb-1">
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Tahun
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="tahun"
                    value={values.tahun}
                    onChange={handleChange}
                    className="form-select form-select-sm"
                    style={{ fontSize: "0.78rem" }}
                    isInvalid={touched.tahun && !!errors.tahun}
                  >
                    <option value="">Pilih Tahun</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </Form.Control>
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {errors.tahun}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6} md={2}>
                <Form.Group className="mb-1">
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Triwulan
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="triwulan"
                    value={values.triwulan}
                    onChange={handleChange}
                    className="form-select form-select-sm"
                    style={{ fontSize: "0.8rem" }}
                    isInvalid={touched.triwulan && !!errors.triwulan}
                  >
                    <option value="">Pilih Triwulan</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </Form.Control>
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {errors.triwulan}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group className="mb-1">
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Kanwil
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="kdkanwil"
                    value={values.kdkanwil}
                    onChange={(e) => {
                      handleChange(e);
                      setCurrentKodeKanwil(e.target.value);
                    }}
                    className="form-select form-select-sm"
                    style={{ fontSize: "0.8rem" }}
                    disabled={role === "2"}
                    isInvalid={touched.kdkanwil && !!errors.kdkanwil}
                  >
                    <option value="">Pilih Kanwil</option>
                    {getKanwilOptions().map((kanwil) => (
                      <option key={kanwil} value={kanwil}>
                        {kanwil}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {errors.kdkanwil}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <hr
              style={{
                border: "none",
                borderTop: "1.5px solid rgba(103,58,183,0.18)",
                margin: "12px 0",
              }}
            />
            {/* Kesimpulan Section */}
            <Row className="mb-2">
              <Col xs={12}>
                <Form.Group
                  className="mb-1"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    borderRadius: "14px",
                    boxShadow: "0 2px 12px 0 rgba(103,58,183,0.07)",
                    border: "1px solid rgba(103,58,183,0.10)",
                    padding: "1rem 0.7rem 0.7rem 0.7rem",
                    marginBottom: "0.5rem",
                    backdropFilter: "blur(6px)",
                    fontSize: "0.8rem",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label
                      className="fw-bold mb-0"
                      style={{
                        color: "#4a148c",
                        fontSize: "0.82rem",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Kesimpulan
                    </Form.Label>
                    <span
                      className={`badge px-2 py-1 ${
                        countWords(values.kesimpulan) > 200
                          ? "bg-danger"
                          : countWords(values.kesimpulan) > 180
                          ? "bg-warning text-dark"
                          : "bg-primary bg-gradient text-white"
                      }`}
                      style={{
                        fontSize: "0.68rem",
                        borderRadius: "7px",
                        background:
                          countWords(values.kesimpulan) > 200
                            ? "#ff5252"
                            : countWords(values.kesimpulan) > 180
                            ? "linear-gradient(90deg,#ffd6d6,#ff5252)"
                            : "linear-gradient(90deg,#673ab7,#9c27b0)",
                        color:
                          countWords(values.kesimpulan) > 180 ? "#333" : "#fff",
                        fontWeight: "500",
                        letterSpacing: "0.01em",
                        boxShadow: "0 1px 4px 0 rgba(103,58,183,0.10)",
                      }}
                    >
                      {countWords(values.kesimpulan)}/200
                    </span>
                  </div>
                  <Form.Control
                    as="textarea"
                    name="kesimpulan"
                    value={values.kesimpulan}
                    onChange={(e) =>
                      handleTextChange(
                        "kesimpulan",
                        e.target.value,
                        setFieldValue,
                        200
                      )
                    }
                    rows={3}
                    placeholder="isi kesimpulan..."
                    className="border-0 shadow-none"
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      fontSize: "0.78rem",
                      padding: "6px 8px",
                      lineHeight: "1.25",
                      width: "100%",
                      minHeight: "44px",
                      resize: "vertical",
                      borderRadius: "7px",
                      color: "#4a148c",
                      fontStyle: "normal",
                      boxShadow: "0 1px 4px 0 rgba(103,58,183,0.07)",
                      outline: "none",
                      transition: "box-shadow 0.2s",
                    }}
                    isInvalid={touched.kesimpulan && !!errors.kesimpulan}
                    onFocus={(e) =>
                      (e.target.style.background = "rgba(255,255,255,0.18)")
                    }
                    onBlur={(e) =>
                      (e.target.style.background = "rgba(255,255,255,0.10)")
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.kesimpulan}
                  </Form.Control.Feedback>
                  {countWords(values.kesimpulan) > 180 &&
                    countWords(values.kesimpulan) <= 200 && (
                      <Form.Text
                        className="text-warning"
                        style={{ fontSize: "0.68rem" }}
                      >
                        Mendekati batas maksimal
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>
            </Row>

            {/* Rekomendasi Section */}
            <Row className="mb-2">
              <Col xs={12}>
                <Form.Group
                  className="mb-1"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    borderRadius: "14px",
                    boxShadow: "0 2px 12px 0 rgba(103,58,183,0.07)",
                    border: "1px solid rgba(103,58,183,0.10)",
                    padding: "1rem 0.7rem 0.7rem 0.7rem",
                    marginBottom: "0.5rem",
                    backdropFilter: "blur(6px)",
                    fontSize: "0.78rem",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label
                      className="fw-bold mb-0"
                      style={{
                        color: "#4a148c",
                        fontSize: "0.82rem",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Rekomendasi
                    </Form.Label>
                    <span
                      className={`badge px-2 py-1 ${
                        countWords(values.rekomendasi) > 300
                          ? "bg-danger"
                          : countWords(values.rekomendasi) > 270
                          ? "bg-warning text-dark"
                          : "bg-primary bg-gradient text-white"
                      }`}
                      style={{
                        fontSize: "0.68rem",
                        borderRadius: "7px",
                        background:
                          countWords(values.rekomendasi) > 300
                            ? "#ff5252"
                            : countWords(values.rekomendasi) > 270
                            ? "linear-gradient(90deg,#ffd6d6,#ff5252)"
                            : "linear-gradient(90deg,#673ab7,#9c27b0)",
                        color:
                          countWords(values.rekomendasi) > 270
                            ? "#333"
                            : "#fff",
                        fontWeight: "500",
                        letterSpacing: "0.01em",
                        boxShadow: "0 1px 4px 0 rgba(103,58,183,0.10)",
                      }}
                    >
                      {countWords(values.rekomendasi)}/300
                    </span>
                  </div>
                  <Form.Control
                    as="textarea"
                    name="rekomendasi"
                    value={values.rekomendasi}
                    onChange={(e) =>
                      handleTextChange(
                        "rekomendasi",
                        e.target.value,
                        setFieldValue,
                        300
                      )
                    }
                    rows={4}
                    placeholder="isi rekomendasi..."
                    className="border-0 shadow-none"
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      fontSize: "0.78rem",
                      padding: "6px 8px",
                      lineHeight: "1.25",
                      width: "100%",
                      minHeight: "58px",
                      resize: "vertical",
                      borderRadius: "7px",
                      color: "#4a148c",
                      fontStyle: "normal",
                      boxShadow: "0 1px 4px 0 rgba(103,58,183,0.07)",
                      outline: "none",
                      transition: "box-shadow 0.2s",
                    }}
                    isInvalid={touched.rekomendasi && !!errors.rekomendasi}
                    onFocus={(e) =>
                      (e.target.style.background = "rgba(255,255,255,0.18)")
                    }
                    onBlur={(e) =>
                      (e.target.style.background = "rgba(255,255,255,0.10)")
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rekomendasi}
                  </Form.Control.Feedback>
                  {countWords(values.rekomendasi) > 270 &&
                    countWords(values.rekomendasi) <= 300 && (
                      <Form.Text
                        className="text-warning"
                        style={{ fontSize: "0.68rem" }}
                      >
                        Mendekati batas maksimal
                      </Form.Text>
                    )}
                  <div
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg,rgba(103,58,183,0.18),rgba(156,39,176,0.10))",
                      margin: "0.5rem 0 0.2rem 0",
                      borderRadius: "2px",
                    }}
                  ></div>
                </Form.Group>
              </Col>
            </Row>
            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-2">
              <Button
                variant="primary"
                type="submit"
                size="sm"
                className="px-2"
                // style={{ fontSize: '0.78rem', padding: '4px 12px', borderRadius:'8px', background:'linear-gradient(90deg,#673ab7,#9c27b0)', color:'#fff', fontWeight:'500', letterSpacing:'0.01em', boxShadow:'0 1px 8px 0 rgba(103,58,183,0.13)', border:'none', transition:'background 0.2s' }}
              >
                Simpan
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
