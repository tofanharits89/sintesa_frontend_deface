import React from "react";
import { Form } from "react-bootstrap";

function SdanaRadio({ sdanaRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    sdanaRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupsdana"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihsdana"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupsdana"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihsdana"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupsdana"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihsdana"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupsdana"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihsdana"}
      /> */}
    </span>
  );
}

export default SdanaRadio;
