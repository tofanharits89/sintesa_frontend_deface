import React from "react";
import { Form } from "react-bootstrap";

function UrusanRadio({ urusanRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    urusanRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupurusan"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihurusan"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupurusan"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihurusan"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupurusan"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihurusan"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupurusan"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihurusan"}
      /> */}
    </span>
  );
}

export default UrusanRadio;
