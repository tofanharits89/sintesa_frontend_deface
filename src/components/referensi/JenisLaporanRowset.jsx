import React, { useState, useEffect } from "react";
import "./style.css";
import { Col, Container, Row } from "react-bootstrap";

const JenisLaporanRowset = ({ jenlap, onChange }) => {
  const jenisLap = [{ value: "1", label: " SPM/ SP2D" }];

  const [selectedValue, setSelectedValue] = useState("1");

  const handleJenisLaporanChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(jenlap);
    onChange({ jenlap });
  };

  return (
    <>
      <Row>
        <Col xs={3} md={2} lg={2} xl={2}>
          Jenis Data
        </Col>

        <Col xs={9} md={10} lg={10} xl={10} className="jenis-laporan-option">
          {jenisLap.map((jenis) => (
            <p key={jenis.value} style={{ margin: "0px" }} className="mt-1">
              <input
                type="radio"
                name="jenlap"
                className="mx-2 fade-in"
                value={jenis.value}
                checked={selectedValue === jenis.value}
                onChange={handleJenisLaporanChange}
              />

              {jenis.label}
            </p>
          ))}
        </Col>
      </Row>
    </>
  );
};

export default JenisLaporanRowset;
