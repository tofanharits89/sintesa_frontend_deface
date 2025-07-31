import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputItem({ itemkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    itemkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02,03, ...dst"
      className="form-select-sm"
      onChange={handleInputChange}
      disabled={status !== "kondisiitem"}
      required
    />
  );
}

export default InputItem;
