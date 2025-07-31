import React, { useContext } from "react";
import { Card, Row, Col } from "react-bootstrap";

import MyContext from "../../../../auth/Context";
import EpaUpTayl from "../chart/UpTayl";
import EpaUpTaYlTL from "../chart/UpTaYlTL";

const TabUpTayl = () => {
  const { role, kdkanwil, kdkppn, axiosJWT, username, token, dataEpa } =
    useContext(MyContext);
  const periodOptions = [
    "Januari",
    "Pebruari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const monthIndex = periodOptions.indexOf(dataEpa.period);
  const monthNumber =
    monthIndex !== -1 ? String(monthIndex + 1).padStart(2, "0") : "00";

  // Gunakan filter dari dataEpa yang sudah diupdate oleh pilihanAtas.jsx
  const currentKdkanwil = dataEpa?.kdkanwil || kdkanwil;
  const currentKdkppn = dataEpa?.kdkppn || kdkppn;

  console.log("TabUpTayl - Filter values:", {
    dataEpaKdkanwil: dataEpa?.kdkanwil,
    dataEpaKdkppn: dataEpa?.kdkppn,
    contextKdkanwil: kdkanwil,
    contextKdkppn: kdkppn,
    finalKdkanwil: currentKdkanwil,
    finalKdkppn: currentKdkppn
  });

  return (
    <div>
      <Row>
        <Col xs={12} sm={12} md={6} lg={6}>
          <EpaUpTaYlTL
            thang={dataEpa.year}
            periode={monthNumber}
            dept={dataEpa.kddept}
            kdkanwil={currentKdkanwil}
            kdkppn={currentKdkppn}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <EpaUpTayl
            thang={dataEpa.year}
            periode={monthNumber}
            dept={dataEpa.kddept}
            kdkanwil={currentKdkanwil}
            kdkppn={currentKdkppn}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TabUpTayl;
