import React from "react";
import data from "../../data/KdPN.json";
import { Col, Row } from "react-bootstrap";

const JenisPN = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Prioritas Nasional</option>
        {data.map((pn, index) => (
          <option key={index} value={pn.kdpn}>
            {pn.kdpn} - {pn.nmpn}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisPN;
