import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import "./tab2.css";

const Tab2 = ({ urgency, seriousness, growth, onDataChange }) => {
  const kriteriaList = ["Urgency", "Seriousness", "Growth"];

  // State untuk menyimpan nilai input
  const [kriteriaValues, setKriteriaValues] = useState({
    Urgency: urgency || "",
    Seriousness: seriousness || "",
    Growth: growth || "",
  });

  // Inisialisasi hanya sekali, hanya jika nilai kriteriaValues masih kosong
  useEffect(() => {
    if (
      kriteriaValues.Urgency === "" &&
      kriteriaValues.Seriousness === "" &&
      kriteriaValues.Growth === ""
    ) {
      setKriteriaValues({
        Urgency: urgency,
        Seriousness: seriousness,
        Growth: growth,
      });
    }
  }, [urgency]);

  const handleNilaiChange = (event, kriteria) => {
    let value = event.target.value;
    // Batasi nilai antara 1 dan 10
    if (value === "") {
      setKriteriaValues({ ...kriteriaValues, [kriteria]: "" });
      onDataChange({ ...kriteriaValues, [kriteria]: "" });
      return;
    }
    value = Math.max(1, Math.min(10, Number(value)));
    const updated = { ...kriteriaValues, [kriteria]: value };
    setKriteriaValues(updated);
    onDataChange(updated);
  };

  return (
    <Card className="p-3 border-0 shadow-sm">
      <Card.Body>
        <Form>
          {kriteriaList.map((kriteria) => (
            <Row key={kriteria} className="align-items-center mb-3">
              <Col xs={12} md={3} className="text-md-start">
                <Form.Label className="fw-bold mb-0">{kriteria}</Form.Label>
              </Col>
              <Col xs={12} md={9}>
                <Form.Control
                  type="number"
                  name={kriteria}
                  value={kriteriaValues[kriteria]}
                  onChange={(e) => handleNilaiChange(e, kriteria)}
                  placeholder="Masukkan nilai (max 10)"
                  min={1}
                  max={10}
                />
              </Col>
            </Row>
          ))}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Tab2;
