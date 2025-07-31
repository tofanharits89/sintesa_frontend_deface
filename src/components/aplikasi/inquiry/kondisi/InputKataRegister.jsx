import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataRegister({ opsikataregister, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikataregister(value); // Mengirim nilai input ke komponen induk
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan pendidikan ..."
      className="form-select-sm mt-1"
      onChange={handleInputChange}
      disabled={status !== "kataregister"}
      required
    />
  );
}

export default InputKataRegister;
