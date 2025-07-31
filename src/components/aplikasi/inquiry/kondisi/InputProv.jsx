import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputProv({ provkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    provkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 001,002,003, ...dst"
      className="form-select-sm"
      disabled={status !== "kondisiprov"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputProv;
