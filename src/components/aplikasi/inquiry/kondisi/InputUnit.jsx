import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputUnit({ unitkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    unitkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02,03, ...dst"
      className="form-select-sm"
      onChange={handleInputChange}
      disabled={status !== "kondisiunit"}
      required
    />
  );
}

export default InputUnit;
