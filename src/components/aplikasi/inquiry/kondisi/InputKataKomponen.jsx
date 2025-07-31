import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataKomponen({ opsikatakomponen, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatakomponen(value); // Mengirim nilai input ke komponen induk
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      onChange={handleInputChange}
      disabled={status !== "katakomponen"}
      required
    />
  );
}

export default InputKataKomponen;
