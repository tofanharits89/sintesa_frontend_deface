import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";

function Inputbidurusan({ bidurusankondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    bidurusankondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02 ...dst"
      className="form-select-sm mt-1"
      disabled={status !== "kondisibidurusan"}
      onChange={handleInputChange}
    />
  );
}

export default Inputbidurusan;
