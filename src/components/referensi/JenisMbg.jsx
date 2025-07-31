import React from "react";
import data from "../../data/KdMbg.json";
import { Col, Row } from "react-bootstrap";

const JenisMbg = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Intervensi</option>
        {data.map((mbg, index) => (
          <option key={index} value={mbg.kdmbg}>
            {mbg.nmmbg}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisMbg;
