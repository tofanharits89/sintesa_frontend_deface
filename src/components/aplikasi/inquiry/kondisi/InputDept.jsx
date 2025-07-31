import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputDept({ deptkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    deptkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 001,002,003, ...dst"
      className="form-select-sm"
      onChange={handleInputChange}
      disabled={status !== "kondisidept"}
      required
    />
  );
}

export default InputDept;
