import React, { useState, useEffect } from "react";
import "./style.css"; 
import { Col, Container, Row } from "react-bootstrap";

const JenisLaporanRkakl = ({ jenlap, onChange }) => {
  const jenisLap = [{ value: "1", label: " Pagu dan Blokir" }];

  const [selectedValue, setSelectedValue] = useState("1");

  const handleJenisLaporanChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(jenlap);
    onChange({ jenlap });
  };

  return (
    <>
      <Container>
        <Row>
          <Col xs={3} md={4} lg={2}>
            <p> Laporan</p>
          </Col>

          <Col xs={8} md={7} lg={9} className="jenis-laporan-option ">
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
      </Container>
    </>
  );
};

export default JenisLaporanRkakl;
