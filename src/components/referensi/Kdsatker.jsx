import React from "react";
import data from "../../data/Kdsatker.json";

const Kdsatker = (props) => {
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
          <option value="SEMUASATKER">Semua Satker</option>

          {data
            .filter(
              (item) =>
                item.kddept === props.kddept && item.kdunit === props.kdunit
            )
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

export default Kdsatker;
