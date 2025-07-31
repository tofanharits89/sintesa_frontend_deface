import React from "react";
import data from "../../data/KdProgis.json";
import { Col, Row } from "react-bootstrap";

const JenisProgramStrategis = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Program Strategis</option>
        {data.map((row, index) => (
          <option key={index} value={row.kdprogis}>
            {row.kdprogis} - {row.nmprogis}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisProgramStrategis;
