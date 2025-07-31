import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const EditIsu = ({ initialData, onSaveDataEdit, isFullscreen }) => {
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    setInputs(Array.isArray(initialData) ? initialData : [""]);
  }, [initialData]);

  const addRow = () => {
    if (inputs.length < 10) {
      setInputs([...inputs, ""]);
    }
  };

  const removeRow = (index) => {
    if (inputs.length > 1) {
      const newInputs = inputs.filter((_, i) => i !== index);
      setInputs(newInputs);
      onSaveDataEdit(newInputs);
    }
  };

  const handleChange = (index, value) => {
    const updatedInputs = inputs.map((isu, i) => (i === index ? value : isu));
    setInputs(updatedInputs);
    onSaveDataEdit(updatedInputs);
  };

  return (
    <Container className="mt-4">
      {inputs.map((isu, index) => (
        <Row key={index} className="mb-3 align-items-center">
          <Col xs={1} md={1} className="text-center">
            <span className="badge bg-primary">{index + 1}</span>
          </Col>
          <Col xs={9} md={9}>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Uraian isu spesifik..."
              className={`form-control ${isFullscreen ? "fullscreen-textarea" : ""}`}
              value={isu}
              onChange={(e) => handleChange(index, e.target.value)}
              isInvalid={isu.trim() === ""}
            />
            <Form.Control.Feedback type="invalid">
              Isu tidak boleh kosong!
            </Form.Control.Feedback>
          </Col>
          <Col xs={2} md={2} className="text-center">
            {inputs.length > 1 && (
              <Button
                variant="light"
                size="sm"
                onClick={() => removeRow(index)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            )}
          </Col>
        </Row>
      ))}
      <Row className="mt-3">
        <Col className="text-center">
          {inputs.length < 10 && (
            <Button variant="primary" size="sm" onClick={addRow}>
              <i className="bi bi-plus-circle"></i> Tambah Baris
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EditIsu;
