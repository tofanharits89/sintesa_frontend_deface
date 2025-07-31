import React, { useContext } from "react";
import { Card, Row, Col } from "react-bootstrap";

import MyContext from "../../../../auth/Context";
import EpaPaguMinusTB from "../chart/PaguMinusTB";
import EpaPaguMinusTL from "../chart/PaguMinusTL";

const TabPaguMinus = () => {
  const { role, kdkanwil, axiosJWT, username, token, dataEpa } =
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
  // console.log(dataEpa);

  return (
    <div>
      {/* <h2 style={{ fontSize: "20px", marginBottom: "30px" }} className="p-0">
          Tren dan data Dukman/ Teknis
        </h2> */}
      <Row>
        {" "}
        <Col xs={12} sm={12} md={6} lg={6}>
          <EpaPaguMinusTL
            thang={dataEpa.year}
            periode={monthNumber}
            dept={dataEpa.kddept}
            kdkanwil={dataEpa.kdkanwil}
            kdkppn={dataEpa.kdkppn}

          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <EpaPaguMinusTB
            thang={dataEpa.year}
            periode={monthNumber}
            dept={dataEpa.kddept}
            kdkanwil={dataEpa.kdkanwil}
            kdkppn={dataEpa.kdkppn}

          />
        </Col>
      </Row>
    </div>
  );
};

export default TabPaguMinus;
