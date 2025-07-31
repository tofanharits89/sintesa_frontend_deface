import React from "react";
import { Form } from "react-bootstrap";

function ItemRadio({ itemRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    itemRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupitem"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihitem"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupitem"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihitem"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupitem"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihitem"}
      />
    </span>
  );
}

export default ItemRadio;
