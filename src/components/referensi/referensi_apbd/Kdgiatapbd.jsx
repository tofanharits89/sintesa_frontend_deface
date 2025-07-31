import React from "react";
// import data from "../../data/Kdgiat.json";

const Kdgiatapbd = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdgiat}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihgiat"}
        >
          {/* <option value="XX">-- Pilih Kegiatan --</option> */}
          <option value="00">Semua Kegiatan</option>
          {/* {data
            .filter(
              (item) =>
                item.kddept === props.kddept &&
                item.kdunit === props.kdunit &&
                item.kdprogram === props.kdprogram
            )
            .map((item) => (
              <option value={item.kdgiat}>
                {item.kdgiat} - {item.nmgiat}
              </option>
            ))} */}
        </select>
      </div>
    </div>
  );
};

export default Kdgiatapbd;
