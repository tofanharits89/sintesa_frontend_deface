import React from "react";
import { Form } from "react-bootstrap";

function PanganRadio({ panganRadio, selectedValue }) {
    const handleRadioChange = (event) => {
        const value = event.target.value;
        panganRadio(value);
    };

    return (
        <span className="fade-in pilihan">
            <Form.Check
                inline
                type="radio"
                label="Kode"
                name="radioGrouppangan"
                value="1"
                checked={selectedValue === "1"}
                onChange={handleRadioChange}
            />
            <Form.Check
                inline
                type="radio"
                label="Kode Uraian"
                name="radioGrouppangan"
                checked={selectedValue === "2"}
                value="2"
                onChange={handleRadioChange}
            />
            <Form.Check
                inline
                type="radio"
                label="Uraian"
                name="radioGrouppangan"
                checked={selectedValue === "3"}
                value="3"
                onChange={handleRadioChange}
            />
            {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGrouppp"
        value="4"
        onChange={handleRadioChange}
      /> */}
        </span>
    );
}

export default PanganRadio;