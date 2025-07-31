import React, { useContext } from "react";
import { Card, Row, Col } from "react-bootstrap";

import MyContext from "../../../../auth/Context";
import EpaKinerjaUtama from "../chart/KinerjaUtamaTabel";

const TabKinerjaUtama = () => {
  const { kdkanwil, kdkppn, dataEpa } = useContext(MyContext);
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
        <Col xs={12}>
          <EpaKinerjaUtama
            thang={dataEpa.year}
            periode={monthNumber}
            dept={dataEpa.kddept}
            kdkanwil={kdkanwil}
            kdkppn={kdkppn}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TabKinerjaUtama;
