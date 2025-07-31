import React from "react";
import { Form } from "react-bootstrap";

function OutputRadio({ outputRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    outputRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupoutput"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihoutput"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupoutput"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihoutput"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupoutput"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihoutput"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupoutput"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default OutputRadio;
