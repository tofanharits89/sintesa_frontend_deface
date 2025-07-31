import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputSatker({ satkerkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    satkerkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 423900,527060,000001, ...dst"
      className="form-select-sm mt-1"
      disabled={status !== "kondisisatker"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputSatker;
