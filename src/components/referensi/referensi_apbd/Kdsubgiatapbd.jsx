import React from "react";
// import data from "../../data/Kdgiat.json";

const Kdsubgiatapbd = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdsubgiat}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihsubgiat"}
        >
          {/* <option value="XX">-- Pilih Sub Kegiatan --</option> */}
          <option value="00">Semua Sub Kegiatan</option>
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

export default Kdsubgiatapbd;
