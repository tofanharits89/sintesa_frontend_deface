import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKomponen({ komponenkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    komponenkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02,03, ...dst"
      className="form-select-sm"
      onChange={handleInputChange}
      disabled={status !== "kondisikomponen"}
      required
    />
  );
}

export default InputKomponen;
