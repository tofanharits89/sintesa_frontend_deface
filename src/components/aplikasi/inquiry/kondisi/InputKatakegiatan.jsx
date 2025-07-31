import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKatakegiatan({ opsikatakegiatan, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatakegiatan(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      disabled={status !== "katagiat"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKatakegiatan;
