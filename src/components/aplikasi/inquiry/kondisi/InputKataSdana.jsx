import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataSdana({ opsikatasdana, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatasdana(value); // Mengirim nilai input ke komponen induk
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan pendidikan ..."
      className="form-select-sm mt-1"
      onChange={handleInputChange}
      disabled={status !== "katasdana"}
      required
    />
  );
}

export default InputKataSdana;
