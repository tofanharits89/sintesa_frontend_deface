import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataProv({ opsikataprov, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikataprov(value); // Mengirim nilai input ke komponen induk
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      disabled={status !== "kataprov"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataProv;
