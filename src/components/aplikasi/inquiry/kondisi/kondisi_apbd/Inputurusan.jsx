import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";

function Inputurusan({ urusankondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    urusankondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02 ...dst"
      className="form-select-sm mt-1"
      disabled={status !== "kondisiurusan"}
      onChange={handleInputChange}
    />
  );
}

export default Inputurusan;
