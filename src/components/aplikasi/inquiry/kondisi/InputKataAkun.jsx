import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputKataAkun({ opsikataakun, status }) {
  const handleInputChange = (event) => {
    const value = event.target.value;

    opsikataakun(value);
  };

  return (
    <Form.Control
      rows={3}
      placeholder="ketik akun/bkpk/jenbel ..."
      className="form-select-sm mt-1"
      disabled={status !== "kataakun"}
      onChange={handleInputChange}
      required
    />
  );
}

export default InputKataAkun;
