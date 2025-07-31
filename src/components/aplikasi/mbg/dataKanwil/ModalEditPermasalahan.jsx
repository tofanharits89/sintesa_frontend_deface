import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../../auth/Context";
import Swal from "sweetalert2";

// Helper function untuk menghitung kata
const countWords = (text) => {
  if (!text || text.trim() === "") return 0;
  return text.trim().split(/\s+/).length;
};

// Validasi schema menggunakan Yup
const validationSchema = Yup.object({
  indikator: Yup.string().required("Kategori tidak boleh kosong"),
  triwulan: Yup.string().required("Triwulan tidak boleh kosong"),
  tahun: Yup.number()
    .required("Tahun tidak boleh kosong")
    .min(2020, "Tahun minimal 2020")
    .max(2030, "Tahun maksimal 2030"),
  keterangan: Yup.string()
    .required("Keterangan tidak boleh kosong")
    .test("word-count", "Keterangan tidak boleh lebih dari 200 kata", function(value) {
      if (!value) return true;
      return countWords(value) <= 200;
    }),
});

export const ModalEditPermasalahan = ({ show, onHide, editingData, onSave }) => {
  const { username, token } = useContext(MyContext);
  const initialValues = {
    id: editingData?.id || "",
    kode_kanwil: editingData?.kode_kanwil || "",
    indikator: editingData?.kategori || "", // Permasalahan menggunakan 'kategori' bukan 'indikator'
    triwulan: editingData?.triwulan || "",
    tahun: editingData?.tahun || new Date().getFullYear(),
    keterangan: editingData?.keterangan || "",
    username: username || "",
    id_type: "4" // ID untuk Permasalahan
  };

  const handleClose = () => {
    onHide();
  };

  const handleAnalysisChange = (e, handleChange, setFieldValue) => {
    const value = e.target.value;
    const wordCount = countWords(value);
    
    // Jika word count melebihi 200, potong teks
    if (wordCount > 200) {
      const words = value.trim().split(/\s+/);
      const limitedText = words.slice(0, 200).join(' ');
      setFieldValue('keterangan', limitedText);
    } else {
      handleChange(e);
    }
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="lg"
      animation={false}
      centered
    >
      <Modal.Header closeButton style={{ 
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '0.9rem 1.4rem',
        borderRadius: '12px 12px 0 0'
      }}>
        <Modal.Title style={{ 
          fontSize: '0.95rem', 
          fontWeight: 600, 
          letterSpacing: '-0.01em', 
          color: '#fff',
        }}>
          Edit Analisis Permasalahan/Isu
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ 
        background: '#fafbfc', 
        padding: '1.8rem 1.8rem 1.2rem 1.8rem',
        borderRadius: '0 0 12px 12px'
      }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // Panggil onSave yang dikirim dari parent component
              if (onSave) {
                await onSave(values);
              }

              // Tunggu response sukses dari parent
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data permasalahan berhasil diupdate!",
                timer: 2000,
                showConfirmButton: false,
              });

              handleClose();
            } catch (error) {
              // console.error("Error saving data:", error);
              let errorMsg = "Terjadi kesalahan saat menyimpan data.";
              if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
              }
              Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMsg,
                timer: 3000,
                showConfirmButton: false,
              });
            } finally {
              setSubmitting(false);
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
            isSubmitting,
          }) => (            <Form onSubmit={handleSubmit} >
              <Row className="g-2">
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 500, 
                      color: '#374151',
                      marginBottom: '0.4rem',
                    }}>
                      Kategori Permasalahan
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="indikator"
                      value={values.indikator}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.indikator && errors.indikator}
                      className="form-select-sm"
                      style={{
                        fontSize: '0.82rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        background: 'rgba(220, 38, 38, 0.05)',
                        color: '#374151',
                        transition: 'all 0.2s ease'
                      }}
                    >
                    <option value="">Pilih Kategori</option>
                    <option value="Kapasitas dan Infrastruktur Dapur Pemenuhan Gizi">Kapasitas dan Infrastruktur Dapur Pemenuhan Gizi</option>
                    <option value="Sistem Pembayaran">Sistem Pembayaran</option>
                    <option value="Ketersediaan Bahan Makanan dalam wilayah">Ketersediaan Bahan Makanan dalam wilayah</option>
                    <option value="Koordinasi Terkait">Koordinasi Terkait</option>
                    <option value="Tidak Seragamnya dukungan pemerintah">Tidak Seragamnya dukungan pemerintah</option>
                    <option value="Isu Lainnya">Isu Lainnya</option>

                    </Form.Control>                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                      {errors.indikator}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 500, 
                      color: '#374151',
                      marginBottom: '0.4rem',
                    }}>
                      Triwulan
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="triwulan"
                      value={values.triwulan}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.triwulan && errors.triwulan}
                      className="form-select-sm"
                      style={{
                        fontSize: '0.82rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        background: 'rgba(220, 38, 38, 0.05)',
                        color: '#374151',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <option value="">Pilih Triwulan</option>
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                    </Form.Control>                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                      {errors.triwulan}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 500, 
                      color: '#374151',
                      marginBottom: '0.4rem',
                    }}>
                      Tahun
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="tahun"
                      value={values.tahun}
                      onChange={handleChange}
                      className="form-select-sm"
                      style={{
                        fontSize: '0.82rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        background: 'rgba(220, 38, 38, 0.05)',
                        color: '#374151',
                        transition: 'all 0.2s ease'
                      }}
                      isInvalid={touched.tahun && !!errors.tahun}
                    >
                      <option value="">Pilih Tahun</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </Form.Control>                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                      {errors.tahun}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <Form.Label className="mb-0" style={{ 
                        fontSize: '0.82rem', 
                        fontWeight: 500, 
                        color: '#374151',
                      }}>
                        Keterangan Permasalahan
                      </Form.Label>
                      <span className={`${countWords(values.keterangan) > 200 ? 'text-danger' : countWords(values.keterangan) > 180 ? 'text-warning' : 'text-muted'}`} style={{ fontSize: '0.7rem', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
                        {countWords(values.keterangan)}/200 kata
                      </span>
                    </div>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="keterangan"
                      value={values.keterangan}
                      onChange={(e) => handleAnalysisChange(e, handleChange, setFieldValue)}
                      onBlur={handleBlur}
                      placeholder="Masukkan keterangan atau deskripsi permasalahan..."
                      isInvalid={touched.keterangan && errors.keterangan}
                      style={{
                        fontSize: '0.82rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        background: 'rgba(220, 38, 38, 0.05)',
                        color: '#374151',
                        resize: 'vertical',
                        minHeight: '70px',
                        transition: 'all 0.2s ease'
                      }}
                    />
                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                      {errors.keterangan}
                    </Form.Control.Feedback>
                    {countWords(values.keterangan) > 180 && countWords(values.keterangan) <= 200 && (
                      <Form.Text className="text-warning small" >
                        Mendekati batas maksimal 200 kata
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleClose}
                  size="sm"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    background: '#fff',
                    color: '#6b7280',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        
        <style>{`
          .form-control:focus, .form-select:focus {
            border-color: #dc2626 !important;
            box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1) !important;
            background: rgba(220, 38, 38, 0.08) !important;
          }
          .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2) !important;
          }
          .form-control::placeholder {
            color: #9ca3af;
            font-style: italic;
          }
        `}</style>
      </Modal.Body>
    </Modal>
  );
};
