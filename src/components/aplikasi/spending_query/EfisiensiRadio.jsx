import React from "react";
import { Form } from "react-bootstrap";

function EfisiensiRadio({ efisiensiRadio, selectedValue }) {
    const handleRadioChange = (event) => {
        const value = event.target.value;
        efisiensiRadio(value);
    };

    return (
        <span className="fade-in pilihan">
            <Form.Check
                inline
                type="radio"
                label="Kode"
                name="radioGroupefisiensi"
                value="1"
                checked={selectedValue === "1"}
                onChange={handleRadioChange}
            />
            <Form.Check
                inline
                type="radio"
                label="Kode Uraian"
                name="radioGroupefisiensi"
                checked={selectedValue === "2"}
                value="2"
                onChange={handleRadioChange}
            />
            <Form.Check
                inline
                type="radio"
                label="Uraian"
                name="radioGroupefisiensi"
                checked={selectedValue === "3"}
                value="3"
                onChange={handleRadioChange}
            />
            {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tatemail"
        checked={selectedValue === "4"}
        name="dekoradioGrouppp"
        value="4"
        onChange={handleRadioChange}
      /> */}
        </span>
    );
}

export default EfisiensiRadio;