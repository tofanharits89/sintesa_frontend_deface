import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataOutput({ opsikataoutput, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikataoutput(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      onChange={handleInputChange}
      disabled={status !== "kataoutput"}
      required
    />
  );
}

export default InputKataOutput;
