import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataItem({ opsikataitem, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikataitem(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan jakarta ..."
      className="form-select-sm mt-1"
      onChange={handleInputChange}
      disabled={status !== "kataitem"}
      required
    />
  );
}

export default InputKataItem;
