import React from "react";

const Kdakun2 = (props) => {
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
          <option value="XX">-- Pilih Akun --</option>

          <option value="AKUN">Per Akun</option>
        </select>
      </div>
    </div>
  );
};

export default Kdakun2;
