import React from "react";
import { Form } from "react-bootstrap";

function DeptRadio({ deptRadio, selectedValue, status, babi }) {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    deptRadio(value);
  };
  //console.log(babi);
  return (
    <span className="fade-in pilihan">
      <Form.Check
        inline
        type="radio"
        label="Kode"
        name="radioGroup"
        value="1"
        checked={selectedValue === "1"}
        onChange={handleRadioChange}
        disabled={status !== "pilihdept"}
      />
      <Form.Check
        inline
        type="radio"
        label="Kode Uraian"
        name="radioGroup"
        checked={selectedValue === "2"}
        value="2"
        onChange={handleRadioChange}
        disabled={status !== "pilihdept"}
      />
      <Form.Check
        inline
        type="radio"
        label="Uraian"
        name="radioGroup"
        checked={selectedValue === "3"}
        value="3"
        onChange={handleRadioChange}
        disabled={status !== "pilihdept"}
      />
      <Form.Check
        inline
        type="radio"
        label="Jangan Tampil"
        checked={selectedValue === "4"}
        name="radioGroup"
        value="4"
        onChange={handleRadioChange}
        disabled={status !== "pilihdept" || babi === "tampil"}
      />
    </span>
  );
}

export default DeptRadio;
