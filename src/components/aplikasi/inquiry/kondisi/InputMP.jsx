import React, { useState } from "react";
import { Form } from "react-bootstrap";

function InputMP({ MPkondisi, status }) {
    const handleInputChange = (event) => {
        const value = event.target.value;

        MPkondisi(value); // Mengirim nilai input ke komponen induk
    };
    //console.log(PNkondisi);
    return (
        <Form.Control
            rows={3}
            placeholder="misalkan pendidikan ..."
            className="form-select-sm mt-1"
            onChange={handleInputChange}
            disabled={status !== "kondisiMP"}
            required
        />
    );
}

export default InputMP;
