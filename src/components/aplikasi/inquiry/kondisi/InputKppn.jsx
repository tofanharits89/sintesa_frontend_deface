import React, { useContext, useState } from "react";

import { Form } from "react-bootstrap";

function InputKppn({ kppnkondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    kppnkondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 079,080,081, ...dst"
      className="form-select-sm mt-1"
      disabled={status !== "kondisikppn"}
      onChange={handleInputChange}
    />
  );
}

export default InputKppn;
