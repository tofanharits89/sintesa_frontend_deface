import React from "react";
import data from "../../data/Kdfungsi.json";

const Kdfungsi = (props) => {
  return (
    <div>
      <div className="mt-0">
        <select
          value={props.kdfungsi}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm text-select mb-2 "
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihfungsi"}
        >
          {/* <option value="XX">-- Pilih Fungsi --</option> */}
          <option value="00">Semua Fungsi</option>

          {data.map((kl, index) => (
            <option key={index} value={kl.kdfungsi}>
              {kl.kdfungsi} - {kl.nmfungsi}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Kdfungsi;
