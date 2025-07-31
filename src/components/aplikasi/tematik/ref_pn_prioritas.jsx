import React from "react";
import data from "../../../data/Prioritas.json";
import { Col, Row } from "react-bootstrap";

const Prioritas = (props) => {
  return (
    <>
      <select
        value={props.kdpp}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Program Prioritas</option>
        {data
          .filter((item) => item.kdpn === props.kdpn)
          .map((pn, index) => (
            <option key={index} value={pn.kdpp}>
              {pn.kdpp} - {pn.nmpp}
            </option>
          ))}
      </select>
    </>
  );
};

export default Prioritas;
