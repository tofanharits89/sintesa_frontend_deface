import React from "react";
// import data from "../../../data/Kdprogramapbd.json";

const Kdprogramapbd = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdprogram}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm tahun"
          disabled={props.status !== "pilihprogram"}
        >
          {/* <option value="XX">-- Pilih Program --</option> */}
          <option value="00">Semua Program</option>
          {/* {data
            .filter(
              (item) =>
                item.kddept === props.kddept && item.kdunit === props.kdunit
            )
            .map((item) => (
              <option value={item.kdprogram}>
                {item.kdprogram} - {item.nmprogram}
              </option>
            ))} */}
        </select>
      </div>
    </div>
  );
};

export default Kdprogramapbd;
