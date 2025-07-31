import React, { useState } from "react";

import { Col, Row } from "react-bootstrap";

const Thang = ({ jenlap, onChange }) => {
  const thang = [
    { value: "2019", label: " 2019" },
    { value: "2020", label: " 2020" },
    { value: "2021", label: " 2021" },
    { value: "2022", label: " 2022" },
    { value: "2023", label: " 2023" },
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

      <Col xs={9} md={10} lg={10} xl={10} className="jenis-laporan-option">
        {thang.map((tahun) => (
          <label key={tahun.value}>
            <input
              type="radio"
              className={`mx-2 ${
                tahun.value < "2022" ? "custom-disabled" : ""
              }`}
              name="thang"
              value={tahun.value}
              checked={selectedValue === tahun.value}
              onChange={handleChange}
              disabled={jenlap === "2" && tahun.value < "2022"}
            />
            {tahun.label}
          </label>
        ))}
      </Col>
    </Row>
  );
};

export default Thang;
