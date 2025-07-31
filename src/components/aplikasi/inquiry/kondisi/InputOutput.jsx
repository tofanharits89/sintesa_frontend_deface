import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputOutput({ outputkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    outputkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 001,002,003, ...dst"
      className="form-select-sm"
      disabled={status !== "kondisioutput"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputOutput;
