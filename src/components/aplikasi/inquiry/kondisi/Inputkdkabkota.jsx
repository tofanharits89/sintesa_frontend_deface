import React, { useState } from "react";
import { Form } from "react-bootstrap";

function Inputkdkabkota({ kdkabkotakondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    kdkabkotakondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02,03, ...dst"
      className="form-select-sm"
      disabled={status !== "kondisikdkabkota"}
      onChange={handleInputChange}
      required
    />
  );
}

export default Inputkdkabkota;
