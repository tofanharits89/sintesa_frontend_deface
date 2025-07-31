import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const Tab1 = ({ value = [], onDataChange }) => {
  const [selectedKategori, setSelectedKategori] = useState([]);

  const kategoriList = [
    "Penganggaran",
    "PBJ",
    "Eksekusi Kegiatan",
    "Regulasi",
    "SDM",
    "Permasalahan Hukum",
  ];

  // ⏬ Pastikan saat edit, `selectedKategori` diperbarui dari prop `value`
  useEffect(() => {
    if (value.length) {
      setSelectedKategori(value);
    }
  }, [value]);

  const handleCheckboxChange = (event) => {
    // console.log(event.target);

    const { value, checked } = event.target;
    const updatedKategori = checked
      ? [...selectedKategori, value]
      : selectedKategori.filter((item) => item !== value);

    setSelectedKategori(updatedKategori);
    onDataChange({ kategori: updatedKategori }); // Kirim perubahan ke induk
    // console.log(updatedKategori);
  };
  // console.log(selectedKategori);

  return (
    <Form>
      {kategoriList.map((item) => (
        <Form.Check
          key={item}
          type="checkbox"
          label={item}
          value={item}
          checked={selectedKategori.includes(item)} // ✅ Pastikan checkbox tetap terpilih
          onChange={handleCheckboxChange}
          className="custom-checkbox1 mx-2"
        />
      ))}
    </Form>
  );
};

export default Tab1;
