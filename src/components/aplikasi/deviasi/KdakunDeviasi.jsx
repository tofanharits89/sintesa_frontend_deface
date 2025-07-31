import React from "react";

const Kdakun = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          // value={value}
          // onChange={(event) => setValue(event.target.value)}
          value={props.kdakun}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
        >
          <option value="XX">-- Pilih Jenis Belanja --</option>

          <option value="JENBEL">Per Jenis Belanja</option>
        </select>
      </div>
    </div>
  );
};

export default Kdakun;
