import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const ThangJenlap = ({ jenlap, onChange }) => {
  const thang = [
    // { value: "2023", label: " 2023" },
    { value: "2024", label: " 2024" },
    { value: "2025", label: " 2025" },
  ];
  const [selectedValue, setSelectedValue] = useState("2025");

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <Row>
      <Col xs={3} md={2} lg={2} xl={2}>
        Tahun
      </Col>

      <Col xs={8} md={7} xl={9} lg={9} className="jenis-laporan-option-tematik">
        {thang.map((tahun) => (
          <label key={tahun.value}>
            <input
              type="radio"
              className={`mx-2 custom-disabled`}
              name="thang"
              value={tahun.value}
              checked={selectedValue === tahun.value}
              onChange={handleChange}
            />
            {tahun.label}
          </label>
        ))}
      </Col>
    </Row>
  );
};

export default ThangJenlap;
