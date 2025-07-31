import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

const JenisLaporanTematikApbd = ({ jenlapapbd, onChange }) => {
  const jenisLap = [
    { value: "1", label: "Inflasi" },
    { value: "2", label: "Penanganan Stunting" },
    { value: "3", label: "Kemiskinan" },
  ];

  const [selectedValue, setSelectedValue] = useState("1");

  const handleJenisLaporanChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
    // onChange({ selectedValue });
  };

  return (
    <>
      <Row>
        <Col xs={3} md={2} lg={2} xl={2}>
          <p className="text-white"> Laporan</p>
        </Col>

        <Col xs={8} md={7} lg={9} className="jenis-laporan-option-tematik">
          {jenisLap.map((jenis) => (
            <p key={jenis.value} style={{ margin: "0px" }} className="mt-1">
              <input
                type="radio"
                name="jenlapapbd"
                className="mx-2"
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

export default JenisLaporanTematikApbd;