import React from "react";
import { Form } from "react-bootstrap";

function PnRadio({ pnRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    pnRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="radioGrouppn"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihPN"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="radioGrouppn"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihPN"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="radioGrouppn"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihPN"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGrouppn"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default PnRadio;
