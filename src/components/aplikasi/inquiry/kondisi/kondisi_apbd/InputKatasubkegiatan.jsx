import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKatasubkegiatan({ opsikatasubkegiatan, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatasubkegiatan(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      disabled={status !== "katasubgiat"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKatasubkegiatan;
