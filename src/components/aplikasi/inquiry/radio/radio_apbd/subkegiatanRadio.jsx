import React from "react";
import { Form } from "react-bootstrap";

function SubkegiatanRadio({ subkegiatanRadio, selectedValue, status }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    subkegiatanRadio(value);
  };

  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="dekoradioGroupsubkegiatan"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihsubgiat"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="dekoradioGroupsubkegiatan"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihsubgiat"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="dekoradioGroupkesubgiatan"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihsubgiat"}
      />
      {/* <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="dekoradioGroupkegiatan"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihgiat"}
      /> */}
    </span>
  );
}

export default SubkegiatanRadio;
