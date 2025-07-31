import React from "react";
import data from "../../data/KdPemilu.json";
import { Col, Row } from "react-bootstrap";

const JenisPemilu = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Belanja dan Pemilu</option>
        {data.map((pm, index) => (
          <option key={index} value={pm.kdpemilu}>
            {pm.nmpemilu}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisPemilu;
