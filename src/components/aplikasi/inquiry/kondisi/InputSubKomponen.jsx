import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputSubKomponen({ subkomponenkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    subkomponenkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02,03, ...dst"
      className="form-select-sm"
      onChange={handleInputChange}
      disabled={status !== "kondisisubkomponen"}
      required
    />
  );
}

export default InputSubKomponen;
