import React from "react";
import { Form } from "react-bootstrap";

function UnitRadio({ unitRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    unitRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="radioGroupunit"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihunit"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="radioGroupunit"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihunit"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="radioGroupunit"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihunit"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="radioGroupunit"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default UnitRadio;
