import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataFungsi({ opsikatafungsi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatafungsi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan pendidikan ..."
      className="form-select-sm mt-1"
      disabled={status !== "katafungsi"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataFungsi;
