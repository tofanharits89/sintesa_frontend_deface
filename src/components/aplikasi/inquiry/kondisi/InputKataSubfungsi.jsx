import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataSubfungsi({ opsikatasubfungsi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatasubfungsi(value); // Mengirim nilai input ke komponen induk
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan pendidikan kedinasan ..."
      className="form-select-sm mt-1"
      disabled={status !== "katasubfungsi"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataSubfungsi;
