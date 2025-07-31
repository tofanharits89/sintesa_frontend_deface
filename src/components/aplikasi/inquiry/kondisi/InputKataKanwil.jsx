import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataKanwil({ opsikatakanwil, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatakanwil(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      disabled={status !== "katakanwil"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataKanwil;
