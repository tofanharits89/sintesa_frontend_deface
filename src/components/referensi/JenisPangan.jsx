import React from "react";
import data from "../../data/KdPangan.json";
import { Col, Row } from "react-bootstrap";

const JenisPangan = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Belanja dan Ketahanan Pangan</option>
        {data.map((pg, index) => (
          <option key={index} value={pg.kdpangan}>
            {pg.nmpangan}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisPangan;
