import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataDept({ opsikatadept, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatadept(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan keuangan ..."
      className="form-select-sm mt-1"
      disabled={status !== "katadept"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataDept;
