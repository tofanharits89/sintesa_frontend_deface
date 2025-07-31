import React, { useContext } from "react";
import { Row, Col } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import EpaPaguMinusTB from "../chart/PaguMinusTB";
import EpaPaguMinusTL from "../chart/PaguMinusTL";

const TabOutstandingUp = () => {
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

  return (
    <div>
      <Row>
        <Col xs={12} sm={12} md={6} lg={6}>
          <EpaPaguMinusTL
            thang={dataEpa.year}
            periode={monthNumber}
            dept={dataEpa.kddept}
            kdkanwil={kdkanwil}
            kdkppn={kdkppn}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <EpaPaguMinusTB
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

export default TabOutstandingUp;
