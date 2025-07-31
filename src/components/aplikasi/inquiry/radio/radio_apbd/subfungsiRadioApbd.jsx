import React from "react";
import { Form } from "react-bootstrap";

function SubfungsiRadioApbd({ subfungsiRadio, selectedValue, status }) {
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
        name="dekoradioGroupsubfungsiapbd"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihsubfungsi"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupsubfungsiapbd"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihsubfungsi"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupsubfungsiapbd"
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
        name="dekoradioGroupsubfungsiapbd"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default SubfungsiRadioApbd;
