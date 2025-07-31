import React from "react";

const Kdakun = (props) => {
  // console.log("jenlap:", props.jenlap, props.jenis, props.kdakun);
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdakun}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihakun"}
        >
          {props.jenis === "tematik" ? (
            <>
              <option value="AKUN">Kode Akun</option>
              <option value="BKPK">Kode BKPK</option>
              <option value="JENBEL">Jenis Belanja</option>
            </>
          ) : null}
        </select>
      </div>
    </div>
  );
};

export default Kdakun;
