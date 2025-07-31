import React from "react";
import { Form } from "react-bootstrap";

function KabkotaRadio({ kabkotaRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    kabkotaRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupkabkota"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihkdkabkota"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupkabkota"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihkdkabkota"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupkabkota"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihkdkabkota"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupkabkota"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default KabkotaRadio;
