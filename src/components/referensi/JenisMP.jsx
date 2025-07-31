import React from "react";
import data from "../../data/KdMP.json";
import { Col, Row } from "react-bootstrap";

const JenisMP = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Major Project</option>
        {data.map((mp, index) => (
          <option key={index} value={mp.kdmp}>
            {mp.kdmp} - {mp.nmmp}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisMP;
