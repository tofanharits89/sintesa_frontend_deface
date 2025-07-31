import React from "react";
import data from "../../data/KdStunting.json";
import { Col, Row } from "react-bootstrap";

const JenisStuntingInquiry = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Tematik Stunting</option>
        {data.map((stun, index) => (
          <option key={index} value={stun.kdstunting}>
            {stun.kdstunting} - {stun.nmstunting}
          </option>
        ))}
      </select>
    </>
  );
};

export default JenisStuntingInquiry;
