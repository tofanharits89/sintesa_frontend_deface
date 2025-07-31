import React, { useState, useEffect } from "react";
import data from "../../data/KdInflasi.json";

const JenisInflasiApbd = (props) => {
  const defaultSelectedTheme = data.find(
    (inflasi) => inflasi.kdinflasi === "00"
  );

  const [selectedTheme, setSelectedTheme] = useState(defaultSelectedTheme);

  const sortedData = data.slice().sort((a, b) => {
    if (a.kdinflasi && b.kdinflasi) {
      return a.kdinflasi.localeCompare(b.kdinflasi);
    } else {
      return 0;
    }
  });

  // Fungsi untuk menangani perubahan pemilihan tema
  const handleThemeChange = (kdinflasi) => {
    const selectedTheme = sortedData.find(
      (inflasi) => inflasi.kdinflasi === kdinflasi
    );
    setSelectedTheme(selectedTheme);
  };

  useEffect(() => {
    props.onOpsiChange(selectedTheme ? [selectedTheme.kdinflasi] : []);
  }, [selectedTheme]);

  return (
    <div>
      <div>
        {sortedData.map((inflasi) => (
          <div key={inflasi.kdinflasi} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="inflasi"
              id={inflasi.kdinflasi}
              value={inflasi.kdinflasi}
              checked={
                selectedTheme && selectedTheme.kdinflasi === inflasi.kdinflasi
              }
              onChange={() => handleThemeChange(inflasi.kdinflasi)}
            />
            <label className="form-check-label" htmlFor={inflasi.kdinflasi}>
              {inflasi.kdinflasi} - {inflasi.nminflasi}
            </label>
          </div>
        ))}
      </div>
      {/* <div className="mt-3 fw-bold">
        Tema yang dipilih: <br />
        {selectedTheme
          ? `${selectedTheme.kdinflasi} - ${selectedTheme.nminflasi}`
          : "Tidak ada tema yang dipilih"}
      </div> */}
    </div>
  );
};

export default JenisInflasiApbd;
