import {
  Button,
  Form,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
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

// Data kluster permasalahan
const klusterPermasalahan = [
  {
    id: "kapasitas_infrastruktur",
    nama: "Kapasitas dan Infrastruktur Dapur Pemenuhan Gizi",
    tooltip:
      "Contoh: Keterbatasan beberapa kasus keterlambatan pembayaran oleh Yayasan kepada supplier, Dapat menjadi barrier bagi UMKM untuk menjadi mitra karena keterbatasan modal",
  },
  {
    id: "sistem_pembayaran",
    nama: "Sistem Pembayaran",
    tooltip:
      "Contoh:Biaya operasional ditalangi terlebih dahulu oleh Yayasan, Terdapat beberapa kasus keterlambatan pembayaran oleh Yayasan kepada supplier",
  },
  {
    id: "ketersediaan_bahan",
    nama: "Ketersediaan Bahan Makanan dalam wilayah",
    tooltip:
      "Contoh: Ketersediaan bahan makanan lokal dan distribusi dalam wilayah tertentu belum memenuhi kebutuhan supply dapur sppg.",
  },
  {
    id: "koordinasi_terkait",
    nama: "Koordinasi Terkait",
    tooltip: "Contoh: Koordinasi antar stakeholder dan instansi terkait terbatas dan kurang optimal",
  },
  {
    id: "dukungan_pemerintah",
    nama: "Sinkronisasi Dukungan Pemerintah",
    tooltip: "Contoh: Perbedaan dukungan dan kebijakan pemerintah di berbagai daerah masih parsial dan tidak merata antara daerah",
  },
  {
    id: "isu_lainnya",
    nama: "Isu Lainnya",
    tooltip:
      "Contoh: Supply chain yang terlalu panjang antar produsen dan dapur sppg, sehingga menyebabkan keterlambatan pasokan bahan makanan dan peningkatan biaya operasional",
  },
];

// Validasi schema
const validationSchema = Yup.object({
  kdkanwil: Yup.string().required("Kanwil tidak boleh kosong"),
  triwulan: Yup.string().required("Triwulan tidak boleh kosong"),
  tahun: Yup.string().required("Tahun tidak boleh kosong"),
  selectedKluster: Yup.array().min(
    1,
    "Pilih minimal satu kluster permasalahan"
  ),
});

// Tambah: custom green glassmorphism style
const glassGreen = {
  background: "rgba(60, 180, 90, 0.13)",
  border: "1.5px solid rgba(60, 180, 90, 0.18)",
  borderRadius: "18px",
  boxShadow: "0 4px 24px 0 rgba(60,180,90,0.08)",
  backdropFilter: "blur(6px)",
};
const greenGradientBtn = {
  background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  boxShadow: "0 2px 8px 0 rgba(60,180,90,0.10)",
};
const badgeGreen = {
  background: "rgba(60,180,90,0.13)",
  color: "#2e7d32",
  borderRadius: "8px",
  fontSize: "10px",
  padding: "2px 8px",
  fontWeight: 500,
  marginLeft: "8px",
};
const dividerGreen = {
  border: "none",
  borderTop: "1.5px solid rgba(60,180,90,0.18)",
  margin: "12px 0",
};

export const ModalPermasalahanIsu = ({ onSave, id, show, onClose }) => {
  const {
    username,
    axiosJWT,
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

  const handleClose = (resetForm) => {
    resetForm();
    if (onClose) onClose();
  };

  const handleAnalysisChange = (fieldName, value, setFieldValue) => {
    const wordCount = countWords(value);

    // Jika word count melebihi 200, potong teks
    if (wordCount > 200) {
      const words = value.trim().split(/\s+/);
      const limitedText = words.slice(0, 200).join(" ");
      setFieldValue(fieldName, limitedText);
    } else {
      setFieldValue(fieldName, value);
    }
  };

  const handleKlusterChange = (klusterId, isChecked, setFieldValue, values) => {
    let updatedKluster = [...values.selectedKluster];

    if (isChecked) {
      if (!updatedKluster.includes(klusterId)) {
        updatedKluster.push(klusterId);
      }
    } else {
      updatedKluster = updatedKluster.filter((id) => id !== klusterId);
      // Clear the corresponding text field when unchecked
      setFieldValue(`isi_${klusterId}`, "");
    }

    setFieldValue("selectedKluster", updatedKluster);
  };
  const renderTooltip = (text) => (
    <Tooltip
      id="tooltip"
      className="custom-tooltip"
      style={{
        "--bs-tooltip-bg": "rgba(220, 220, 220, 0.95)",
        "--bs-tooltip-opacity": "1",
      }}
    >
      <div
        style={{
          textAlign: "left",
          maxWidth: "160px",
          fontSize: "8px",
          lineHeight: "1.3",
          padding: "6px 8px",
          backgroundColor: "rgba(220, 220, 220, 0.95)",
          color: "#333333",
          border: "1px solid rgba(180, 180, 180, 0.8)",
          borderRadius: "4px",
          backdropFilter: "blur(4px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        {text}
      </div>
    </Tooltip>
  );
  // Fungsi simpan data ke backend (pola seperti ModalRekamBPS)
  const saveData = async (values, resetForm) => {
    try {
      // Siapkan array data untuk setiap kluster yang dipilih
      const dataToSave = [];
      for (const klusterId of values.selectedKluster) {
        const kluster = klusterPermasalahan.find((k) => k.id === klusterId);
        const isiField = `isi_${klusterId}`;
        const isiValue = values[isiField];
        if (kluster && isiValue && isiValue.trim()) {
          const extractedKodeKanwil = values.kdkanwil.includes(" - ")
            ? values.kdkanwil.split(" - ")[0].trim()
            : values.kdkanwil;
          dataToSave.push({
            kode_kanwil: extractedKodeKanwil,
            indikator: kluster.nama,
            keterangan: isiValue.trim(),
            triwulan: values.triwulan,
            tahun: values.tahun,
            username: values.username,
            id: "4", // id 4 untuk permasalahan
          });
        }
      }
      if (dataToSave.length === 0) {
        await Swal.fire({
          title: "Validasi Gagal!",
          text: "Tidak ada data yang valid untuk disimpan. Pastikan setidaknya satu kluster permasalahan memiliki isi yang tidak kosong.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return false;
      }
      // POST satu per satu (atau bisa juga batch jika backend support array)
      const baseURL =
        import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace("/users", "") ;
      const saveURL = `${baseURL}/simpan/data/kanwil`;
      let savedCount = 0;
      for (const rowData of dataToSave) {
        const payload = { data: rowData };
        const response = await axiosJWT.post(saveURL, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          savedCount++;
        }
      }
      Swal.fire({
        title: "Berhasil!",
        text: `Berhasil menyimpan ${savedCount} data permasalahan.`,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
      if (onSave) onSave(); // trigger refresh parent jika perlu
      handleClose(resetForm);
      return true;
    } catch (error) {
      let errorMessage = "Gagal menyimpan data";
      if (error.response) {
        errorMessage = `Server error: HTTP status ${error.response.status}`;
      } else if (error.message && error.message.includes("Network Error")) {
        errorMessage = `Koneksi gagal: Pastikan backend berjalan di ${
          import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace("/users", "") 
        }`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      await Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        borderRadius: "18px",
        // boxShadow: "0 4px 24px 0 rgba(229,57,53,0.08)",
        backdropFilter: "blur(8px)",
        // border: "1.5px solid rgba(229,57,53,0.13)",
        padding: "0.5rem 0.5rem 0.5rem 0.5rem",
        fontSize: "0.67rem", // Minimalist font size
        minWidth: 0,
      }}
    >
      <Formik
        initialValues={{
          kdkanwil: getDefaultKanwil(),
          triwulan: "I",
          tahun: "2025",
          selectedKluster: [],
          isi_kapasitas_infrastruktur: "",
          isi_sistem_pembayaran: "",
          isi_ketersediaan_bahan: "",
          isi_koordinasi_terkait: "",
          isi_dukungan_pemerintah: "",
          isi_isu_lainnya: "",
          username: username || "n/a",
          id: id,
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          await saveData(values, resetForm);
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
                    style={{ fontSize: "0.8rem" }}
                  >
                    Tahun
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="tahun"
                    value={values.tahun}
                    onChange={handleChange}
                    className="form-select form-select-sm"
                    style={{ fontSize: "0.8rem" }}
                    isInvalid={touched.tahun && !!errors.tahun}
                  >
                    <option value="">Pilih Tahun</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.tahun}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>{" "}
              <Col xs={6} md={2}>
                <Form.Group className="mb-1">
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.8rem" }}
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
                  <Form.Control.Feedback type="invalid">
                    {errors.triwulan}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>{" "}
              <Col xs={12} md={8}>
                <Form.Group className="mb-1">
                  <Form.Label
                    className="fw-bold text-dark small"
                    style={{ fontSize: "0.8rem" }}
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
                  <Form.Control.Feedback type="invalid">
                    {errors.kdkanwil}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <hr
              style={{
                border: "none",
                borderTop: "1.5px solid rgba(229,57,53,0.18)",
                margin: "12px 0",
              }}
            />
            {/* Kluster Permasalahan Section */}
            <Row className="mb-2">
              <Col xs={12}>
                <Form.Group
                  style={{
                    // background: "rgba(255,255,255,0.18)",
                    borderRadius: "14px",
                    // boxShadow: "0 2px 12px 0 rgba(229,57,53,0.07)",
                    // border: "1px solid rgba(229,57,53,0.10)",
                    // padding: "1rem 0.7rem 0.7rem 0.7rem",
                    marginBottom: "0.5rem",
                    backdropFilter: "blur(6px)",
                    fontSize: "0.8rem", // minimalist
                  }}
                >
                  <Form.Label
                    className="fw-bold mb-2"
                    style={{
                      color: "#b71c1c",
                      fontSize: "0.82rem",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Kluster Permasalahan
                  </Form.Label>
                  {errors.selectedKluster && touched.selectedKluster && (
                    <div
                      className="text-danger small mb-1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {errors.selectedKluster}
                    </div>
                  )}
                  {klusterPermasalahan.map((kluster, index) => (
                    <div
                      key={kluster.id}
                      className="row mb-2 align-items-center gx-1 kluster-row-glass"
                      style={{
                        borderRadius: "8px",
                        marginBottom: "0.5rem",
                        padding: "0.3rem 0.1rem 0.3rem 0.1rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      {/* Left Column - Checkbox and Label */}
                      <div
                        className="col-12 col-lg-5 d-flex align-items-center gap-2"
                        style={{
                          paddingRight: "0.2rem",
                          minHeight: "44px",
                          fontSize: "0.78rem",
                        }}
                      >
                        <Form.Check
                          type="checkbox"
                          id={kluster.id}
                          checked={values.selectedKluster.includes(kluster.id)}
                          onChange={(e) =>
                            handleKlusterChange(
                              kluster.id,
                              e.target.checked,
                              setFieldValue,
                              values
                            )
                          }
                        />
                        <span
                          className="flex-grow-1 small me-2 d-flex align-items-center"
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            lineHeight: "1.25",
                            textAlign: "left",
                            wordBreak: "break-word",
                            letterSpacing: "0.01em",
                            marginBottom: 0,
                          }}
                        >
                          {kluster.nama}
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 300, hide: 150 }}
                            overlay={renderTooltip(kluster.tooltip)}
                          >
                            <span
                              style={{
                                marginLeft: 6,
                                color: "#43e97b",
                                fontSize: "1.1em",
                                cursor: "pointer",
                                userSelect: "none",
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                background: 'rgba(67,233,123,0.13)',
                                border: '1px solid #43e97b44',
                                fontWeight: 700,
                              }}
                              tabIndex={0}
                            >
                              ?
                            </span>
                          </OverlayTrigger>
                        </span>
                      </div>
                      {/* Right Column - Text Input */}
                      <div className="col-12 col-lg-7">
                        <div className="position-relative ps-lg-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small text-muted" style={{ fontSize: "0.8rem", color: "#d32f2f" }}></span>
                            <span
                              className={`badge px-2 py-1 ${
                                countWords(values[`isi_${kluster.id}`]) > 200
                                  ? "bg-dark"
                                  : countWords(values[`isi_${kluster.id}`]) >
                                    180
                                  ? "bg-dark text-dark"
                                  : "bg-dark bg-gradient text-white"
                              }`}
                              style={{
                                fontSize: "0.68rem",
                                borderRadius: "7px",
                                background:
                                  countWords(values[`isi_${kluster.id}`]) > 200
                                    ? "#ff5252"
                                    : countWords(values[`isi_${kluster.id}`]) >
                                      180
                                    ? "linear-gradient(90deg,#ffd6d6,#ff5252)"
                                    : "linear-gradient(90deg,#e53935,#ff1744)",
                                color:
                                  countWords(values[`isi_${kluster.id}`]) > 180
                                    ? "#333"
                                    : "#fff",
                                fontWeight: "500",
                                letterSpacing: "0.01em",
                                boxShadow: "0 1px 4px 0 rgba(229,57,53,0.10)",
                              }}
                            >
                              {countWords(values[`isi_${kluster.id}`])}/200
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name={`isi_${kluster.id}`}
                              value={values[`isi_${kluster.id}`]}
                              onChange={(e) =>
                                handleAnalysisChange(
                                  `isi_${kluster.id}`,
                                  e.target.value,
                                  setFieldValue
                                )
                              }
                              placeholder="uraian permasalahan/isu..."
                              className="border-1 shadow-none"
                              style={{
                                color: "#b71c1c",
                              }}
                              disabled={!values.selectedKluster.includes(kluster.id)}
                              onFocus={(e) =>
                                (e.target.style.background = "rgba(255,255,255,0.18)")
                              }
                              onBlur={(e) =>
                                (e.target.style.background = "rgba(255,255,255,0.10)")
                              }
                            />
                          </div>
                          {countWords(values[`isi_${kluster.id}`]) > 180 &&
                            countWords(values[`isi_${kluster.id}`]) <= 200 && (
                              <Form.Text className="text-warning" style={{ fontSize: "0.65rem" }}>
                                Mendekati batas maksimal
                              </Form.Text>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg,rgba(229,57,53,0.18),rgba(255,23,68,0.10))",
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
                variant="danger"
                type="submit"
                size="sm"
                className="px-2"
                onMouseOver={(e) =>
                  (e.target.style.background =
                    "linear-gradient(90deg,#ff1744,#e53935)")
                }
                onMouseOut={(e) =>
                  (e.target.style.background =
                    "linear-gradient(90deg,#e53935,#ff1744)")
                }
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
