import React, { useContext, useEffect } from "react";
import data from "../../../../data/Kdkanwil.json";
import MyContext from "../../../../auth/Context";

const Kdkanwil = (props) => {
  const { role, kdkanwil } = useContext(MyContext);

  useEffect(() => {
    if (kdkanwil && !props.kdkanwil) {
      const selectedItem = data.find((item) => item.kdkanwil === kdkanwil);
      if (selectedItem) {
        props.onChange(selectedItem.kdkanwil); // hanya kirim string
      }
    }
  }, [kdkanwil, props]);

  return (
    <div>
      <select
        value={props.kdkanwil}
        onChange={(e) => {
          const selectedKdkanwil = e.target.value;
          props.onChange(selectedKdkanwil); // hanya kirim string
        }}
        className="form-select form-select-md"
        aria-label=".form-select-md"
      >
        {role === "0" || role === "1" || role === "X" ? (
          <>
            <option value="">Pilih Kanwil</option>
            {data.map((item) => (
              <option value={item.kdkanwil} key={item.kdkanwil}>
                {item.kdkanwil} - {item.nmkanwil}
              </option>
            ))}
          </>
        ) : (
          data
            .filter((item) => item.kdkanwil === kdkanwil)
            .map((item) => (
              <option key={item.kdkanwil} value={item.kdkanwil}>
                {item.kdkanwil} - {item.nmkanwil}
              </option>
            ))
        )}
      </select>
    </div>
  );
};

export default Kdkanwil;
