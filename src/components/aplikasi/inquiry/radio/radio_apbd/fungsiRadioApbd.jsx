import React from "react";
import { Form } from "react-bootstrap";

function FungsiRadioApbd({ fungsiRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    fungsiRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupfungsiapbd"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihfungsi"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupfungsiapbd"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihfungsi"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupfungsiapbd"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihfungsi"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupfungsi"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default FungsiRadioApbd;
