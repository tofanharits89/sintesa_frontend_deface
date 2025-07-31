import React from "react";
import data from "../../data/Kdunit.json";

const Kdunit = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdunit}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihunit"}
        >
          {/* <option value="XX">-- Pilih Unit --</option> */}
          <option value="00" selected>
            Semua Unit
          </option>

          {data
            .filter((item) => item.kddept === props.value)
            .map((item, index) => (
              <option value={item.kdunit} option key={index}>
                {item.kdunit} - {item.nmunit}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default Kdunit;
