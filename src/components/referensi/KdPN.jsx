import React from "react";
import data from "../../data/KdPN.json";

const KodePN = (props) => {
  // console.log(props.kdPN, props.value);
  // console.log(data);
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.PN}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihPN"}
        >
          {/* <option value="XX">-- Pilih Unit --</option> */}
          <option value="00" selected>
            Semua Prioritas Nasional
          </option>

          {data.map((item, index) => (
            <option value={item.kdpn} option key={index}>
              {item.kdpn} - {item.nmpn}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default KodePN;
