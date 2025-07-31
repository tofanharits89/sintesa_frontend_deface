import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataLevel({ opsikatalevel, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikatalevel(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="ketik level1/level2/level3 ..."
      className="form-select-sm mt-1"
      disabled={status !== "katalevel"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataLevel;
