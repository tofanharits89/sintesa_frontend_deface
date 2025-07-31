import React, { useContext, useState } from "react";

import { Form } from "react-bootstrap";

function InputProgram({ programkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    programkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02 ...dst"
      className="form-select-sm mt-1"
      disabled={status !== "kondisiprogram"}
      onChange={handleInputChange}
    />
  );
}

export default InputProgram;
