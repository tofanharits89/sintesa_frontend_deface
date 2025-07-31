import React from "react";
import data from "../../data/KdMiskin.json";
import { Col, Row } from "react-bootstrap";

const JenisMiskin = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Belanja dan Kemiskinan Ekstrim</option>
        {data.map((ms, index) => (
          <option key={index} value={ms.kdmiskin}>
            {ms.nmmiskin}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisMiskin;
