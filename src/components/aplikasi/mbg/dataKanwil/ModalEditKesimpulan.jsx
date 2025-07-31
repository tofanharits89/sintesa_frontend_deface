import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../../auth/Context";
import Swal from "sweetalert2";
//import axios from "axios";

// Validasi schema menggunakan Yup
const validationSchema = Yup.object({
  triwulan: Yup.string().required("Triwulan tidak boleh kosong"),
  tahun: Yup.number()
    .required("Tahun tidak boleh kosong")
    .min(2020, "Tahun minimal 2020")
    .max(2030, "Tahun maksimal 2030"),
  kesimpulan: Yup.string().required("Kesimpulan tidak boleh kosong"),
  saran: Yup.string().required("Saran tidak boleh kosong"),
});

export const ModalEditKesimpulan = ({ show, onHide, editingData, onSave }) => {
  const { username, token } = useContext(MyContext);
  const initialValues = {
    id: editingData?.id || "",
    kode_kanwil: editingData?.kode_kanwil || "",
    triwulan: editingData?.triwulan || "",
    tahun: editingData?.tahun || new Date().getFullYear(),
    kesimpulan: editingData?.kesimpulan || "",
    saran: editingData?.saran || "",
    username: username || "",
    id_type: "5" // ID untuk Kesimpulan
  };

  const handleClose = () => {
    onHide();
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
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
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
          Edit Kesimpulan & Rekomendasi
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
                text: "Kesimpulan berhasil diupdate!",
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
                        border: '1px solid #ddd6fe',
                        background: 'rgba(139, 92, 246, 0.05)',
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

                <Col md={6}>
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
                        border: '1px solid #ddd6fe',
                        background: 'rgba(139, 92, 246, 0.05)',
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
                    <Form.Label style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 500, 
                      color: '#374151',
                      marginBottom: '0.4rem',
                    }}>
                      Kesimpulan
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="kesimpulan"
                      value={values.kesimpulan}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Masukkan kesimpulan analisis..."
                      isInvalid={touched.kesimpulan && errors.kesimpulan}
                      style={{
                        fontSize: '0.82rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd6fe',
                        background: 'rgba(139, 92, 246, 0.05)',
                        color: '#374151',
                        resize: 'vertical',
                        minHeight: '90px',
                        transition: 'all 0.2s ease'
                      }}
                    />
                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                      {errors.kesimpulan}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-2">
                    <Form.Label style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 500, 
                      color: '#374151',
                      marginBottom: '0.4rem',
                    }}>
                      Saran
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="saran"
                      value={values.saran}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Masukkan saran dan rekomendasi..."
                      isInvalid={touched.saran && errors.saran}
                      style={{
                        fontSize: '0.82rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd6fe',
                        background: 'rgba(139, 92, 246, 0.05)',
                        color: '#374151',
                        resize: 'vertical',
                        minHeight: '90px',
                        transition: 'all 0.2s ease'
                      }}
                    />
                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                      {errors.saran}
                    </Form.Control.Feedback>
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
                    border: '1px solid #ddd6fe',
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
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1) !important;
            background: rgba(139, 92, 246, 0.08) !important;
          }
          .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2) !important;
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