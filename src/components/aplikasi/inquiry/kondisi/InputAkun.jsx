import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputAkun({ akunkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    akunkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 511111,511112 ...dst"
      className="form-select-sm"
      disabled={status !== "kondisiakun"}
      onChange={handleInputChange}
      //maxLength={6}
      required
    />
  );
}

export default InputAkun;
