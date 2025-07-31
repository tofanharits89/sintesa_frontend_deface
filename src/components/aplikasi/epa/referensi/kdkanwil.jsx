import React, { useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import data from "../../../../data/KdkanwilEpa.json";

const Kdkanwil = (props) => {
  const { role, kdkanwil } = useContext(MyContext);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedKanwil = data.find((item) => item.kdkanwil === selectedValue);
    props.onChange(selectedKanwil); // Mengirimkan seluruh data Kanwil
  };
  useEffect(() => {
    // Jika kanwil pertama kali dipilih, kirimkan data ke parent hanya jika berbeda
    const selectedKanwil = data.find(
      (item) => item.kdkanwil === props.kdkanwil
    );
    if (selectedKanwil) {
      // Cek apakah value sudah sama, jika belum baru kirim
      if (typeof props.value === 'undefined' || props.value !== props.kdkanwil) {
        props.onChange(selectedKanwil);
      }
    }
  }, [props.kdkanwil]);
  return (
    <div className="dropdown_epa">
      <label className="dropdown_epa-label text-dark" htmlFor="kanwil">
        Pusat/ Kanwil
      </label>
      <select
        value={props.kdkanwil}
        onChange={handleSelectChange}
        className="dropdown_epa-select dropdown-animated"
        aria-label=".form-select-sm"
      >
        {role !== "0" && (role === "1" || role === "X") ? (
          <>
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
                {item.kdkanwil} - KANWIL {item.nmkanwil}
              </option>
            ))
        )}
      </select>
    </div>
  );
};

export default Kdkanwil;
