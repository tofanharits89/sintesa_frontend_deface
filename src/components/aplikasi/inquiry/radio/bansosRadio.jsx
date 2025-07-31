import React from "react";
import { Form } from "react-bootstrap";

function BansosRadio({ bansosRadio, selectedValue }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    bansosRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupBansos"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupBansos"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupBansos"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupBansos"
        value="4"
        onChange={handleRadioChange}
      /> */}
    </span>
  );
}

export default BansosRadio;
