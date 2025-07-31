import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import "./tab4.css"; // Import CSS khusus

const Tab4 = ({ onDataChange }) => {
  const [status, setStatus] = useState("");
  const [approval, setApproval] = useState("");

  const approvalOptions = ["Disetujui", "Ditolak", "Menunggu"];

  // Gunakan useEffect agar data dikirim setelah state diperbarui
  useEffect(() => {
    if (status !== "" || approval !== "") {
      onDataChange({ status, approval });
      // console.log("Updated Data:", { status, approval }); // Debugging
    }
  }, [status, approval]); // `onDataChange` dihapus dari dependency untuk mencegah loop

  return (
    <Card className="p-3 border-0 shadow-sm">
      <Card.Body>
        {/* Input Status (Persentase) */}
        <Row className="align-items-center mb-3">
          <Col xs={12} md={3} className="text-md-start">
            <Form.Label className="fw-bold mb-0">Status (%)</Form.Label>
          </Col>
          <Col xs={12} md={9}>
            <Form.Control
              type="number"
              value={status}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || Number(val) <= 100) {
                  setStatus(val);
                } else {
                  setStatus("100");
                }
              }}
              min="0"
              max="100"
              placeholder="Masukkan persen progress...(max 100%)"
              className="custom-percent"
            />
          </Col>
        </Row>

        {/* Input Approval (Dropdown) */}
        <Row className="align-items-center">
          <Col xs={12} md={3} className="text-md-start">
            <Form.Label className="fw-bold mb-0">Approval</Form.Label>
          </Col>
          <Col xs={12} md={9}>
            <Form.Select
              value={approval}
              onChange={(e) => setApproval(e.target.value)}
            >
              <option value="">Pilih</option>
              {approvalOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Tab4;
