import React from "react";
import data from "../../../data/Kdsatkerapbd.json";

const Kdsatkerapbd = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          // value={value}
          // onChange={(event) => setValue(event.target.value)}
          value={props.kdsatker}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihsatker"}
        >
          {/* <option value="XXX">-- Pilih Satker --</option> */}
          <option value="SEMUASATKER">Semua SKPD/Satker</option>

          {data
            .filter((item) => item.kdprov === props.kdprov)
            .map((item) => (
              <option value={item.kdsatker}>
                {item.kdsatker} - {item.nmsatker}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default Kdsatkerapbd;
