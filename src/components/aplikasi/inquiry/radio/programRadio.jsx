import React from "react";
import { Form } from "react-bootstrap";

function ProgramRadio({ programRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    programRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupprogram"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihprogram"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupprogram"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihprogram"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupprogram"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihprogram"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupprogram"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihprogram"}
      /> */}
    </span>
  );
}

export default ProgramRadio;
