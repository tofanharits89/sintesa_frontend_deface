import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputDekon({ dekonkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    dekonkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02,03, ...dst"
      className="form-select-sm"
      disabled={status !== "kondisidekon"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputDekon;
