import React from "react";
import { Form } from "react-bootstrap";

function KppnRadioApbd({ kppnRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    kppnRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupkppnapbd"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihkppn"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupkppnapbd"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihkppn"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupkppnapbd"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihkppn"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupkppnapbd"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihkppn"}
      /> */}
    </span>
  );
}

export default KppnRadioApbd;
