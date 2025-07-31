import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataKppn({ opsikatakppn, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatakppn(value); // Mengirim nilai input ke komponen induk
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan kppn jakarta ii ..."
      className="form-select-sm mt-1"
      disabled={status !== "katakppn"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataKppn;
