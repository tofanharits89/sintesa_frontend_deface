import React, { useState } from "react";

import { Col, Container, Row } from "react-bootstrap";

const Pembulatanrkakl = ({ onChange }) => {
  const pembulatan = [
    { value: "1", label: "Rupiah" },
    { value: "1000", label: "Ribu" },
    { value: "1000000", label: "Juta" },
    { value: "1000000000", label: "Milyar" },
    { value: "1000000000000", label: "Triliun" },
  ];

  const [selectedValue, setSelectedValue] = useState(pembulatan[0].value);

  const handlePembulatanoranChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <>
      <Row>
        <Col xs={3} md={4} lg={2}>
          <p className="text-white"> Pembulatan </p>
        </Col>

        <Col xs={8} md={7} lg={8} className="jenis-laporan-option ">
          {pembulatan.map((pembulatan) => (
            <label key={pembulatan.value}>
              <input
                type="radio"
                className="mx-2 custom-disabled"
                name="pembulatan"
                value={pembulatan.value}
                checked={selectedValue === pembulatan.value}
                onChange={handlePembulatanoranChange}
              />
              &nbsp;{pembulatan.label}
            </label>
          ))}
        </Col>
      </Row>
    </>
  );
};

export default Pembulatanrkakl;
