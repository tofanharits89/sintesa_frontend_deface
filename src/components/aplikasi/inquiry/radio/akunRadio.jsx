import React from "react";
import { Form } from "react-bootstrap";

function PilihRadio({ akunRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    akunRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="radioGroupakun"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihakun"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="radioGroupakun"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihakun"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="radioGroupakun"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihakun"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupakun"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihakun"}
      /> */}
    </span>
  );
}

export default PilihRadio;
