import React from "react";
import { Form } from "react-bootstrap";

function DesaRadio({ desaRadio, selectedValue }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    desaRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupdesa"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupdesa"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupdesa"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupdesa"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default DesaRadio;
