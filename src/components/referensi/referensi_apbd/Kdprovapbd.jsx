import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import data from "../../../data/Kdprov.json";

const Kdprovapbd = (props) => {
  const { role, kdprov } = useContext(MyContext);
  // console.log(role);
  // console.log(props.status);
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdprov}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihprov"}
        >
          {/* <option value="XX">-- Pilih Provinsi --</option> */}
          {role === "0" || role === "1" || role === "X" ? (
            <>
              <option value="00">Semua Provinsi</option>
              {data.map((item) => (
                <option key={item.kdprov} value={item.kdprov}>
                  {item.kdprov} - {item.nmprov}
                </option>
              ))}
            </>
          ) : (
            data
              .filter((item) => item.kdprov === kdprov)
              .map((item) => (
                <option key={item.kdprov} value={kdprov}>
                  {item.kdprov} - {item.nmprov}
                </option>
              ))
          )}
        </select>
      </div>
    </div>
  );
};

export default Kdprovapbd;
