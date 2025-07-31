import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import "./tab3.css"; // Import CSS khusus

const Tab3 = ({ onDataChange }) => {
  const [rencanaAksi, setRencanaAksi] = useState("");
  const [deadline, setDeadline] = useState("");

  // Update hanya ketika ada perubahan yang valid
  useEffect(() => {
    if (rencanaAksi !== "" || deadline !== "") {
      onDataChange({ rencanaAksi, deadline });
      // console.log("Updated Data:", { rencanaAksi, deadline }); // Debugging
    }
  }, [rencanaAksi, deadline]); // Hapus `onDataChange` dari dependency untuk mencegah loop

  return (
    <Card className="p-3 border-0 shadow-sm">
      <Card.Body>
        <Row className="align-items-center mb-3">
          <Col xs={12} md={3} className="text-md-start">
            <Form.Label className="fw-bold mb-0">Rencana Aksi</Form.Label>
          </Col>
          <Col xs={12} md={9}>
            <Form.Control
              as="textarea"
              value={rencanaAksi}
              onChange={(e) => setRencanaAksi(e.target.value)}
              rows={5}
              placeholder="Tuliskan rencana aksi..."
              className="custom-textarea"
            />
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col xs={12} md={3} className="text-md-start">
            <Form.Label className="fw-bold mb-0">Deadline</Form.Label>
          </Col>
          <Col xs={12} md={9}>
            <Form.Control
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="custom-date"
              min={new Date().toISOString().split('T')[0]}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Tab3;
