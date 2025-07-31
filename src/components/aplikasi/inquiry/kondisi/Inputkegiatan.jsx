import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";

function Inputkegiatan({ kegiatankondisi, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    kegiatankondisi(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="misalkan 01,02 ...dst"
      className="form-select-sm mt-1"
      disabled={status !== "kondisigiat"}
      onChange={handleInputChange}
    />
  );
}

export default Inputkegiatan;
