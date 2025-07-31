import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const InputIsu = ({ initialData, onSaveData }) => {
  const [inputs, setInputs] = useState([{ id: 1, issue: "", error: false }]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setInputs(initialData);
    }
  }, [initialData]);

  const addRow = () => {
    setInputs([...inputs, { id: inputs.length + 1, issue: "", error: false }]);
  };

  const removeRow = (id) => {
    const newInputs = inputs.filter((input) => input.id !== id);
    setInputs(newInputs);
    onSaveData(newInputs);
  };

  const handleChange = (id, value) => {
    const updatedInputs = inputs.map((input) =>
      input.id === id
        ? { ...input, issue: value, error: value.trim() === "" }
        : input
    );
    setInputs(updatedInputs);
    onSaveData(updatedInputs);
  };

  return (
    <Container className="mt-4">
      {inputs.map((input, index) => (
        <Row key={input.id} className="mb-3 align-items-center">
          <Col xs={1} md={1} className="text-center">
            <strong style={{ fontSize: "16px" }}>{index + 1}</strong>
          </Col>
          <Col xs={10} md={10}>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Uraian isu spesifik..."
              value={input.issue}
              onChange={(e) => handleChange(input.id, e.target.value)}
              isInvalid={input.error} // Border merah jika error
              style={{ fontSize: "14px", padding: "8px" }}
            />
            <Form.Control.Feedback type="invalid">
              Isu tidak boleh kosong!
            </Form.Control.Feedback>
          </Col>
          <Col xs={1} md={1} className="text-center">
            {inputs.length > 1 && (
              <Button
                variant="light"
                size="sm"
                className="p-2"
                onClick={() => removeRow(input.id)}
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

export default InputIsu;
