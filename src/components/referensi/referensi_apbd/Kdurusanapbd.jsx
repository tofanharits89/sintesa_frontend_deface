import React from "react";
import data from "../../../data/Kdurusanapbd.json";

const Kdurusanapbd = (props) => {
  return (
    <div>
      <div className="mt-0">
        <select
          value={props.kdurusan}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm text-select mb-2 "
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihurusan"}
        >
          {/* <option value="XX">-- Pilih Urusan --</option> */}
          <option value="00">Semua Urusan</option>

          {data.map((ur, index) => (
            <option key={index} value={ur.kdurusan}>
              {ur.kdurusan} - {ur.nmurusan}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Kdurusanapbd;
