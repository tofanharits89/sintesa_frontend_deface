import React from "react";
import { Form } from "react-bootstrap";

function SubfungsiRadio({ subfungsiRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    subfungsiRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupsubfungsi"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihsubfungsi"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupsubfungsi"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihsubfungsi"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupsubfungsi"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihsubfungsi"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupsubfungsi"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default SubfungsiRadio;
