import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModalKinerja = ({
  show,
  handleClose,
  title,
  description,
  jeniskinerja,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: title || "",
    description: description || "",
    jenis: jeniskinerja || "", // Pastikan jenis sesuai dengan props
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      title,
      description, // Tambahkan description agar ikut diperbarui
      jenis: jeniskinerja,
    }));
  }, [title, description, jeniskinerja]); // Tambahkan description ke dependency array

  const [errors, setErrors] = useState({
    title: false,
    description: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false })); // Reset error saat user mengetik
  };

  const handleSave = () => {
    const newErrors = {
      title: formData.title.trim() === "",
      description: formData.description.trim() === "",
    };

    setErrors(newErrors);

    if (!newErrors.title && !newErrors.description) {
      onSave(formData);
      handleClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
      animation={false}
    >
      <Modal.Header closeButton style={{ cursor: "pointer" }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Judul</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              isInvalid={errors.title}
            />
            {errors.title && (
              <Form.Control.Feedback type="invalid">
                Judul wajib diisi.
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={errors.description}
            />
            {errors.description && (
              <Form.Control.Feedback type="invalid">
                Deskripsi wajib diisi.
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Tutup
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModalKinerja;
