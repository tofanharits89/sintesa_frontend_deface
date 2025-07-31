import React from "react";
import data from "../../data/Kdsfungsi.json";

const Kdsfungsi = (props) => {
  // console.log(props.kdfungsi);
  return (
    <div>
      <div className="mt-0">
        <select
          value={props.kdsfungsi}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm text-select mb-2 "
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihsubfungsi"}
        >
          {/* <option value="XX">-- Pilih Sub Fungsi --</option> */}
          <option value="00">Semua Sub Fungsi</option>

          {data
            .filter((item) => item.kdfungsi === props.kdfungsi)
            .map((kl, index) => (
              <option key={index} value={kl.kdsfungsi}>
                {kl.kdsfungsi} - {kl.nmsfungsi}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default Kdsfungsi;
