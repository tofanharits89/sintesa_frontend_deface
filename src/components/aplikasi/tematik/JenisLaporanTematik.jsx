import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

const JenisLaporanTematik = ({ jenlap, onChange }) => {
  const jenisLap = [
    { value: "1", label: "Prioritas Nasional" },
    { value: "2", label: "Major Project" },
    { value: "3", label: "Tematik Anggaran" },
    { value: "4", label: "Inflasi" },
    { value: "5", label: "Penanganan Stunting" },
    { value: "7", label: "Kemiskinan Ekstrim" },
    { value: "8", label: "Belanja Pemilu" },
    { value: "9", label: "Ibu Kota Nusantara" },
    { value: "10", label: "Ketahanan Pangan" },
    { value: "11", label: "Bantuan Pemerintah" },
    { value: "12", label: "Makanan Bergizi Gratis" },
    { value: "13", label: "Swasembada Pangan" },
    { value: "14", label: "Program Strategis" },
  ];

  const [selectedValue, setSelectedValue] = useState("1");

  const handleJenisLaporanChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue); // Perbarui selectedValue dengan nilai yang baru dipilih
    onChange(selectedValue); // Panggil fungsi onChange dengan nilai yang baru dipilih
  };

  const halfLength = Math.ceil(jenisLap.length / 2);
  const firstColumn = jenisLap.slice(0, halfLength);
  const secondColumn = jenisLap.slice(halfLength);

  return (
    <>
      <Row>
        <Col xs={3} md={2} lg={2} xl={2}>
          <p className="text-white"> Laporan</p>
        </Col>

        <Col xs={8} md={7} lg={9} className="jenis-laporan-option-tematik">
          <Row>
            {/* Kolom pertama */}
            <Col xs={6}>
              {firstColumn.map((jenis) => (
                <p key={jenis.value} style={{ margin: "0px" }} className="mt-1">
                  <input
                    type="radio"
                    name="jenlap"
                    className="mx-2 "
                    value={jenis.value}
                    checked={selectedValue === jenis.value}
                    onChange={handleJenisLaporanChange}
                  />
                  {jenis.label}
                </p>
              ))}
            </Col>
            {/* Kolom kedua */}
            <Col xs={6}>
              {secondColumn.map((jenis) => (
                <p key={jenis.value} style={{ margin: "0px" }} className="mt-1">
                  <input
                    type="radio"
                    name="jenlap"
                    className="mx-2 "
                    value={jenis.value}
                    checked={selectedValue === jenis.value}
                    onChange={handleJenisLaporanChange}
                  />
                  {jenis.label}
                </p>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default JenisLaporanTematik;
