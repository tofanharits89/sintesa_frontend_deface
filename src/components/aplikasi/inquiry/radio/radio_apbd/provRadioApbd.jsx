import React from "react";
import { Form } from "react-bootstrap";

function ProvRadioApbd({ provRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    provRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupprovapbd"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihprov"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupprovapbd"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihprov"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupprovapbd"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihprov"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupprov"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihprov"}
      /> */}
    </span>
  );
}

export default ProvRadioApbd;
