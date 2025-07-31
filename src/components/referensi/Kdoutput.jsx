import React from "react";
import data from "../../data/Kdoutput.json";

const Kdoutput = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdoutput}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihoutput"}
        >
          {/* <option value="XX">-- Pilih Output --</option> */}
          <option value="SEMUAOUTPUT">Semua Output</option>
          {data
            .filter(
              (item) =>
                item.kddept === props.kddept &&
                item.kdunit === props.kdunit &&
                item.kdprogram === props.kdprogram &&
                item.kdgiat === props.kdgiat
            )
            .map((item) => (
              <option value={item.kdoutput}>
                {item.kdoutput} - {item.nmoutput}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default Kdoutput;
