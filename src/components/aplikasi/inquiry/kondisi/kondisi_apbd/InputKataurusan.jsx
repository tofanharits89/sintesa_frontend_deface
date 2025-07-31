import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataurusan({ opsikataurusan, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikataurusan(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      disabled={status !== "kataurusan"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataurusan;
