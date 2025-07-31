import React from "react";
import data from "../../data/KdInflasiInquiry.json";
import { Col, Row } from "react-bootstrap";

const JenisInflasiInquiry = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Belanja dan Inflasi</option>
        {data.map((inf, index) => (
          <option key={index} value={inf.kdinflasi}>
            {inf.nminflasi}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisInflasiInquiry;
