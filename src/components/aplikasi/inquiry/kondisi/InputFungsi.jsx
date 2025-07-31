import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputFungsi({ fungsikondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    fungsikondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02,03, ...dst"
      className="form-select-sm mt-1"
      disabled={status !== "kondisifungsi"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputFungsi;
