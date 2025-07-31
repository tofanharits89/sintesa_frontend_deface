import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataSubOutput({ opsikatasuboutput, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatasuboutput(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="ketik nama ro ..."
      className="form-select-sm mt-1"
      onChange={handleInputChange}
      disabled={status !== "katasuboutput"}
      required
    />
  );
}

export default InputKataSubOutput;
