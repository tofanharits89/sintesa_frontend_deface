import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataUnit({ opsikataunit, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikataunit(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="ketik unit ..."
      className="form-select-sm mt-1"
      disabled={status !== "kataunit"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataUnit;
