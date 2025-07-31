import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataProgram({ opsikataprogram, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikataprogram(value); // Mengirim nilai input ke komponen induk
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan dukungan manajemen ..."
      className="form-select-sm mt-1"
      disabled={status !== "kataprogram"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataProgram;
