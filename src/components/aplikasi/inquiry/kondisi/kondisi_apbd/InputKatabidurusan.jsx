import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKatabidurusan({ opsikatabidurusan, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatabidurusan(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      disabled={status !== "katabidurusan"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKatabidurusan;
