import React from "react";
import { Form } from "react-bootstrap";

function PriRadio({ priRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    priRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="radioGroupppxx"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihPRI"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="radioGroupppxx"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihPRI"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="radioGroupppx"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihPRI"}
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

export default PriRadio;
