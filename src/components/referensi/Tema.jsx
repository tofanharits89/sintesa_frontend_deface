import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios"; // Untuk mengirim permintaan HTTP ke server

const Tema = () => {
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [data, setData] = useState([]); // State untuk menyimpan hasil data dari server

  // Daftar semua tema yang mungkin
  const themes = [
    {
      kdtema: "007",
      nmtema: "Adaptasi perubahan iklim",
      kdupdate: "",
      updater: "",
      tglupdate: "0000-00-00 00:00:00",
      aktif: "1",
    },
    {
      kdtema: "006",
      nmtema: "Anggaran Kesehatan",
      kdupdate: "",
      updater: "",
      tglupdate: "0000-00-00 00:00:00",
      aktif: "1",
    },
    {
      kdtema: "005",
      nmtema: "Anggaran Pendidikan",
      kdupdate: "",
      updater: "",
      tglupdate: "0000-00-00 00:00:00",
      aktif: "1",
    },
    {
      kdtema: "004",
      nmtema: "Mitigasi perubahan Iklim",
      kdupdate: "",
      updater: "",
      tglupdate: "0000-00-00 00:00:00",
      aktif: "1",
    },
    {
      kdtema: "003",
      nmtema: "Anggaran Responsif Gender",
      kdupdate: "",
      updater: "",
      tglupdate: "0000-00-00 00:00:00",
      aktif: "1",
    },
    {
      kdtema: "002",
      nmtema: "Kerjasama Selatan-Selatan dan Triangular (KSST)",
      kdupdate: "",
      updater: "",
      tglupdate: "0000-00-00 00:00:00",
      aktif: "1",
    },
    {
      kdtema: "001",
      nmtema: "Anggaran Infrastruktur",
      kdupdate: "",
      updater: "",
      tglupdate: "0000-00-00 00:00:00",
      aktif: "1",
    },
    {
      kdtema: "000",
      nmtema: "Bukan Tematik",
      kdupdate: "",
      updater: "",
      tglupdate: "0000-00-00 00:00:00",
      aktif: "1",
    },
  ];

  // Fungsi untuk menangani perubahan pemilihan tema
  const handleThemeChange = (kdtema) => {
    // Periksa apakah kdtema sudah ada dalam selectedThemes
    if (selectedThemes.includes(kdtema)) {
      // Hapus kdtema jika sudah ada
      setSelectedThemes(selectedThemes.filter((theme) => theme !== kdtema));
    } else {
      // Tambahkan kdtema jika belum ada
      setSelectedThemes([...selectedThemes, kdtema]);
    }
  };

  // Fungsi untuk mengirim permintaan ke server dan mendapatkan data yang sesuai
  const fetchData = async () => {
    try {
      // Buat string query SQL berdasarkan selectedThemes
      const sqlQuery = `SELECT * FROM a_pagu_real_bkpk_dja_2023 WHERE ${selectedThemes
        .map((theme) => `FIND_IN_SET('${theme}', kdtema) > 0`)
        .join(" OR ")}`;

      // Kirim permintaan GET ke server dengan query SQL
      const response = await axios.get(`/api/data?sqlQuery=${sqlQuery}`);
      //  console.log(sqlQuery);
      // Simpan data dari respons server ke dalam state data
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Ketika selectedThemes berubah, panggil fungsi fetchData untuk memperbarui data
  useEffect(() => {
    fetchData();
  }, [selectedThemes]);

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Pilih Tema
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {themes.map((theme) => (
            <Dropdown.Item
              key={theme.kdtema}
              active={selectedThemes.includes(theme.kdtema)}
              onClick={() => handleThemeChange(theme.kdtema)}
            >
              {theme.nmtema}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <div>Kode Tema yang dipilih: {selectedThemes.join(", ")}</div>
    </div>
  );
};

export default Tema;
