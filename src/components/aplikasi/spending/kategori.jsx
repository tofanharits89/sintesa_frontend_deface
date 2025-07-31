import React from "react";
import data from "../../../data/Kategori.json";

const Kategori = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select text-select"
        style={{ width: "330px" }}
        aria-label=".form-select"
        name="sebab"
      >
        <option value="">Pilih Kategori Inefisiensi</option>
        {data.map((pn, index) => (
          <option key={index} value={pn.kdkategori}>
            {pn.kdkategori} - {pn.nmkategori}
          </option>
        ))}
      </select>
    </>
  );
};

export default Kategori;
