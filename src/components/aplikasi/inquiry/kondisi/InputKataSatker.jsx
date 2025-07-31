import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataSatker({ opsikatasatker, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatasatker(value); // Mengirim nilai input ke komponen induk
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan polres nias ..."
      className="form-select-sm mt-1"
      disabled={status !== "katasatker"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataSatker;
