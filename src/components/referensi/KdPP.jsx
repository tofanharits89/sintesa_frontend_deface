import React from "react";
import data from "../../data/Prioritas.json";

const KodePP = (props) => {
  // console.log(props.kdPN, props.value);
  // console.log(props.kdPN);
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.PP}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihPP"}
        >
          {/* <option value="XX">-- Pilih Unit --</option> */}
          <option value="00" selected>
            Semua Program Prioritas
          </option>

          {data
            .filter((item) => item.kdpn === props.kdPN)
            .map((item, index) => (
              <option value={item.kdpp} option key={index}>
                {item.kdpp} - {item.nmpp}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default KodePP;
