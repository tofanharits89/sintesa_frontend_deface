import React from "react";
import { Form } from "react-bootstrap";

function KegiatanRadioApbd({ kegiatanRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    kegiatanRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupkegiatanapbd"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihgiat"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupkegiatanapbd"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihgiat"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupkegiatanapbd"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihgiat"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupkegiatanapbd"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihgiat"}
      /> */}
    </span>
  );
}

export default KegiatanRadioApbd;
