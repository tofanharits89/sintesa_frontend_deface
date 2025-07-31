import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKanwil({ kanwilkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    kanwilkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02,03, ...dst"
      className="form-select-sm"
      disabled={status !== "kondisikanwil"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKanwil;
