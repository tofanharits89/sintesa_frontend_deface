import React from "react";
import { Form } from "react-bootstrap";

function PilihRadio({ levelRadio, selectedValue, status }) {
    const handleRadioChange = (event) => {
        const value = event.target.value;
        levelRadio(value);
    };

    return (
        <span className="fade-in pilihan">
            <Form.Check
                inline
                type="radio"
                label="Kode"
                name="radioGrouplevel"
                value="1"
                checked={selectedValue === "1"}
                onChange={handleRadioChange}
                disabled={status !== "pilihlevel"}
            />
            <Form.Check
                inline
                type="radio"
                label="Kode Uraian"
                name="radioGrouplevel"
                checked={selectedValue === "2"}
                value="2"
                onChange={handleRadioChange}
                disabled={status !== "pilihlevel"}
            />
            <Form.Check
                inline
                type="radio"
                label="Uraian"
                name="radioGrouplevel"
                checked={selectedValue === "3"}
                value="3"
                onChange={handleRadioChange}
                disabled={status !== "pilihlevel"}
            />
            {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGrouplevel"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihlevel"}
      /> */}
        </span>
    );
}

export default PilihRadio;
