import { Button, Form, Row, Col } from "react-bootstrap";
import { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import MyContext from "../../../../auth/Context";

// Helper function untuk menghitung kata
const countWords = (text) => {
  if (!text || text.trim() === "" || text.trim() === "isi analisis dan keterangan yang relevan...")
    return 0;
  return text.trim().split(/\s+/).length;
};

// Validasi schema
const validationSchema = Yup.object({
  kdkanwil: Yup.string().required("Kanwil tidak boleh kosong"),
  indikator: Yup.string().required("Indikator tidak boleh kosong"),
  triwulan: Yup.string().required("Triwulan tidak boleh kosong"),
  tahun: Yup.string().required("Tahun tidak boleh kosong"),
  analisis: Yup.string()
    .required("Analisis tidak boleh kosong")
    .test(
      "word-count",
      "Analisis tidak boleh lebih dari 200 kata",
      function (value) {
        if (!value) return true;
        return countWords(value) <= 200;
      }
    ),
});

export const ModalRekamTriwulan = ({ onSave, id, onClose }) => {
  const {
    username,
    token,
    axiosJWT,
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
  const handleClose = (resetForm) => {
    resetForm();
    // Tutup modal jika ada callback dari parent
    if (onClose) {
      onClose();
    }
  };

  const handleAnalysisChange = (e, handleChange, setFieldValue) => {
    const value = e.target.value;
    const wordCount = countWords(value);

    // Jika word count melebihi 200, potong teks
    if (wordCount > 200) {
      const words = value.trim().split(/\s+/);
      const limitedText = words.slice(0, 200).join(" ");
      setFieldValue("analisis", limitedText);
    } else {
      handleChange(e);
    }
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        background:
          "linear-gradient(120deg, rgba(255,193,7,0.10) 0%, rgba(255,255,255,0.08) 100%)",
        borderRadius: "18px",
        boxShadow: "0 4px 24px 0 rgba(255,193,7,0.08)",
        backdropFilter: "blur(8px)",
        border: "1.5px solid rgba(255,193,7,0.13)",
        padding: "0.5rem 0.5rem 0.5rem 0.5rem",
        fontSize: "0.75rem", // minimalist
        minWidth: 0,
      }}
    >
      <Formik
        initialValues={{
          kdkanwil: getDefaultKanwil(),
          indikator: "Angka Partisipasi Sekolah (APS)",
          triwulan: "I",
          analisis: "",
          tahun: "2025",
          username: username || "n/a",
          // Tidak mengirim id, biarkan DB auto-increment
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          try {
            // Extract kode kanwil dari kdkanwil (format: "03 - SUMATERA BARAT")
            const kodeKanwil = values.kdkanwil.split(" - ")[0]; // Map frontend fields to backend expected fields for DataTriwulanan
            const dataToSend = {
              data: {
                kode_kanwil: kodeKanwil, // Extract dari kdkanwil dan gunakan nama field yang benar
                indikator: values.indikator,
                customIndikator: null, // optional field
                customSatuan: null, // optional field untuk triwulanan
                triwulan: values.triwulan,
                tahun: parseInt(values.tahun), // convert ke integer
                username: username,
                keterangan: values.analisis, // map analisis ke keterangan
                id: "3", // id "3" untuk DataTriwulanan berdasarkan controller
              },
            };

            // Get base URL dari environment variable (SAMA SEPERTI BPS)
            const baseURL =
              import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace(
                "/users",
                ""
              ) ;
            const saveURL = `${baseURL}/simpan/data/kanwil`;

            // Kirim data ke backend menggunakan axiosJWT
            const response = await axiosJWT.post(saveURL, dataToSend, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const result = response.data;
            if (response.status === 201) {
              // Berhasil disimpan - tampilkan notifikasi dengan Swal (tanpa await, agar modal langsung tertutup)
              Swal.fire({
                title: "Berhasil!",
                text: "Data triwulanan berhasil disimpan",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              });

              // Call onSave callback jika ada (untuk parent component)
              if (onSave) {
                // Kirim data yang sudah dimapping, bukan values asli
                const mappedValues = {
                  ...values,
                  kode_kanwil: kodeKanwil,
                  keterangan: values.analisis,
                };
                onSave(mappedValues);
              }

              // Trigger refresh table
              if (window.triggerTriwulanDataRefresh) {
                window.triggerTriwulanDataRefresh();
              }

              handleClose(resetForm);
              return true;
            }
          } catch (error) {
            let errorMessage = "Gagal menyimpan data triwulanan";
            if (error.response) {
              errorMessage = `Server error: HTTP status ${error.response.status}`;
            } else if (
              error.message &&
              error.message.includes("Network Error")
            ) {
              errorMessage = `Koneksi gagal: Pastikan backend berjalan di ${
                import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace(
                  "/users",
                  ""
                ) 
              }`;
            } else if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
            // Notifikasi error
            await Swal.fire({
              title: "Gagal Menyimpan!",
              text: errorMessage,
              icon: "error",
              confirmButtonText: "OK",
            });
            return false;
            // Jangan tutup modal jika ada error
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
            <Row className="mb-2 g-2">
              {" "}
              <Col xs={6} md={2}>
                <Form.Group className="mb-2">
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Tahun
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="tahun"
                    value={values.tahun}
                    onChange={handleChange}
                    className="form-select form-select-sm"
                    style={{ fontSize: "0.75rem" }}
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
                    style={{ fontSize: "0.75rem" }}
                  >
                    {errors.tahun}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6} md={2}>
                <Form.Group className="mb-2">
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Triwulan
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="triwulan"
                    value={values.triwulan}
                    onChange={handleChange}
                    className="form-select form-select-sm"
                    style={{ fontSize: "0.75rem" }}
                    isInvalid={touched.triwulan && !!errors.triwulan}
                  >
                    <option value="">Pilih Triwulan</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </Form.Control>{" "}
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {errors.triwulan}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>{" "}
              <Col xs={12} md={8}>
                <Form.Group className="mb-2">
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.75rem" }}
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
                    style={{ fontSize: "0.75rem" }}
                    disabled={role === "2"}
                    isInvalid={touched.kdkanwil && !!errors.kdkanwil}
                  >
                    <option value="">Pilih Kanwil</option>
                    {getKanwilOptions().map((kanwil) => (
                      <option key={kanwil} value={kanwil}>
                        {kanwil}
                      </option>
                    ))}
                  </Form.Control>{" "}
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {errors.kdkanwil}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            {/* Indikator Section */}
            <Row className="mb-2">
              <Col xs={12}>
                <Form.Group className="mb-2" style={{ fontSize: "0.75rem" }}>
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Indikator
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="indikator"
                    value={values.indikator}
                    onChange={handleChange}
                    className="form-select form-select-sm"
                    style={{ fontSize: "0.75rem" }}
                    isInvalid={touched.indikator && !!errors.indikator}
                  >
                    <option value="">Pilih Indikator</option>
                    <option value="Harapan Lama Sekolah (HLS)">
                      Indikator Harapan Lama Sekolah (HLS) dan Rata-rata Lama
                      Sekolah (RLS)
                    </option>
                    <option value="Tingkat Kemiskinan">
                      Tingkat Kemiskinan
                    </option>
                    <option value="Prevalensi Stunting">
                      Prevalensi Stunting
                    </option>
                    <option value="Indeks Pembangunan Manusia (IPM)">
                      Indikator Indeks Pembangunan Manusia (IPM)
                    </option>
                    <option value="Angka Putus Sekolah (APS/Drop Out Rate)">
                      Indikator Angka Putus Sekolah (APS/Drop Out Rate)
                    </option>
                    <option value="Biaya Pendidikan Dasar (Primary Education)">
                      Biaya Pendidikan Dasar (Primary Education)
                    </option>
                    <option value="Lainya">
                      Lainya
                    </option>
                  </Form.Control>{" "}
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {errors.indikator}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            {/* Analysis Section */}
            <Row className="mb-2">
              <Col xs={12}>
                <Form.Group style={{ fontSize: "0.75rem" }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label
                      className="fw-bold text-dark small mb-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Analisis
                    </Form.Label>
                    <span
                      className={`small ${
                        countWords(values.analisis) > 200
                          ? "text-danger"
                          : countWords(values.analisis) > 180
                          ? "text-warning"
                          : "text-muted"
                      }`}
                      style={{ fontSize: "0.68rem" }}
                    >
                      {countWords(values.analisis)}/200 kata
                    </span>
                  </div>
                  <Form.Control
                    as="textarea"
                    name="analisis"
                    value={values.analisis}
                    onChange={(e) =>
                      handleAnalysisChange(e, handleChange, setFieldValue)
                    }
                    rows={4}
                    placeholder="isi analisis dan keterangan yang relevan..."
                    className="border-0 form-control-sm shadow-none"
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      fontSize: "0.75rem",
                      padding: "6px 8px",
                      lineHeight: "1.25",
                      borderRadius: "7px",
                      color: "#795548",
                      minHeight: "44px",
                      resize: "vertical",
                      outline: "none",
                      transition: "box-shadow 0.2s",
                      fontStyle:
                        values.analisis === "" ||
                        values.analisis === "isi analisis dan keterangan yang relevan..."
                          ? "italic"
                          : "normal",
                    }}
                    isInvalid={touched.analisis && !!errors.analisis}
                  />{" "}
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {errors.analisis}
                  </Form.Control.Feedback>
                  {countWords(values.analisis) > 180 &&
                    countWords(values.analisis) <= 200 && (
                      <Form.Text
                        className="text-warning small"
                        style={{ fontSize: "0.68rem" }}
                      >
                        Mendekati batas maksimal 200 kata
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>
            </Row>
            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="warning"
                type="submit"
                size="sm"
                className="px-3"
                // style={{ fontSize: '0.75rem', borderRadius:'8px', background:'linear-gradient(90deg,#ffd600,#ffb300)', color:'#fff', fontWeight:'500', letterSpacing:'0.01em', boxShadow:'0 1px 8px 0 rgba(255,193,7,0.13)', border:'none', transition:'background 0.2s' }}
              >
                Simpan
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <style>{`
        textarea::placeholder {
          color: rgba(120,120,120,0.28)!important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};
