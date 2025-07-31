import React, { useState, useEffect } from "react";
import data from "../../data/KdTEMA.json";

const JenisTEMA = (props) => {
  const defaultSelectedTheme = data.find((theme) => theme.kdtema === "000");

  const [selectedTheme, setSelectedTheme] = useState(defaultSelectedTheme);

  const sortedData = data
    .slice()
    .sort((a, b) => a.kdtema.localeCompare(b.kdtema));

  // Fungsi untuk menangani perubahan pemilihan tema
  const handleThemeChange = (kdtema) => {
    const selectedTheme = sortedData.find((theme) => theme.kdtema === kdtema);
    setSelectedTheme(selectedTheme);
  };

  useEffect(() => {
    props.onOpsitemaChange(selectedTheme ? [selectedTheme.kdtema] : []);
  }, [selectedTheme]);

  return (
    <div>
      <div>
        {sortedData.map((theme) => (
          <div key={theme.kdtema} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="theme"
              id={theme.kdtema}
              value={theme.kdtema}
              checked={selectedTheme && selectedTheme.kdtema === theme.kdtema}
              onChange={() => handleThemeChange(theme.kdtema)}
            />
            <label className="form-check-label" htmlFor={theme.kdtema}>
              {theme.kdtema} - {theme.nmtema}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-3 fw-bold">
        Tema yang dipilih: <br />
        {selectedTheme
          ? `${selectedTheme.kdtema} - ${selectedTheme.nmtema}`
          : "Tidak ada tema yang dipilih"}
      </div>
    </div>
  );
};

export default JenisTEMA;
