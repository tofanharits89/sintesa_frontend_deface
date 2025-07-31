import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputTema({ Temakondisi, status }) {
    const handleInputChange = (event) => {
        const value = event.target.value;

        Temakondisi(value); // Mengirim nilai input ke komponen induk
    };
    //console.log(PNkondisi);
    return (
        <Form.Control
            rows={3}
            placeholder="misalkan pendidikan ..."
            className="form-select-sm mt-1"
            onChange={handleInputChange}
            disabled={status !== "kondisiTema"}
            required
        />
    );
}

export default InputTema;
