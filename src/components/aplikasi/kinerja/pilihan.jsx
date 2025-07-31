import React, { useState, useContext, useEffect } from "react";
import { FloatingLabel, Form, Col, Row } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import kddept from "../../../data/Kddept.json";
import kanwil from "../../../data/Kdkanwil.json";
import periode from "../../../data/Kdperiode.json";

const Pilihan = ({ onInputChange }) => {
  const { role, kdkanwil } = useContext(MyContext);
  const [selectedDept, setSelectedDept] = useState("027");
  const [selectedTA, setSelectedTA] = useState("2024");
  const [selectedperiode, setSelectedperiode] = useState("01");
  const [selectedProv, setSelectedProv] = useState("00");

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "dept") {
      setSelectedDept(value);
      onInputChange("dept", value);
    } else if (id === "thang") {
      setSelectedTA(value);
      onInputChange("thang", value);
    } else if (id === "periode") {
      setSelectedperiode(value);
      onInputChange("periode", value);
    } else if (id === "prov") {
      setSelectedProv(value);
      onInputChange("prov", value);
    }
  };
  // console.log(selectedDept);
  return (
    <div>
      <Row>
        <Col sm={12} xl={3} md={12} lg={12} className="my-1">
          <FloatingLabel
            controlId="thang"
            label="Pilih TA"
            className="pilihanatas"
          >
            <Form.Select onChange={handleInputChange} value={selectedTA}>
              <option value="2020">TA 2020</option>
              <option value="2021">TA 2021</option>
              <option value="2022">TA 2022</option>
              <option value="2023">TA 2023</option>
              <option value="2024">TA 2024</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col sm={12} xl={4} md={6} lg={12} className="my-1">
          <FloatingLabel
            controlId="periode"
            label="Pilih Periode"
            className="pilihanatas"
          >
            <Form.Select
              className="pilih"
              onChange={handleInputChange}
              value={selectedperiode}
            >
              {/* <option value="0">Semua Periode</option> */}
              {periode.map((kl, index) => (
                <option key={index} value={kl.kdperiode}>
                  {kl.kdperiode} - {kl.nmperiode}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col sm={12} md={6} xl={5} lg={12} className="my-1">
          <FloatingLabel
            controlId="dept"
            label="Pilih Kementerian"
            className="pilihanatas"
          >
            <Form.Select
              className="pilih"
              onChange={handleInputChange}
              value={selectedDept}
            >
              {/* <option value="000">Semua Kementerian</option> */}
              {kddept.map((kl, index) => (
                <option key={index} value={kl.kddept}>
                  {kl.kddept} - {kl.nmdept}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Col>

        {/* <Col xl={2} md={6} lg={12} sm={12} className="my-1">
          <FloatingLabel
            controlId="prov"
            label="Pilih Kanwil"
            className="pilihanatas"
          >
            <Form.Select onChange={handleInputChange}>
              {role === "0" || role === "1" || role === "X" ? (
                <>
                  <option value="00">Semua Kanwil</option>
                  {kanwil.map((item) => (
                    <option value={item.kdkanwil} key={item.kdkanwil}>
                      {item.kdkanwil} - {item.nmkanwil}
                    </option>
                  ))}
                </>
              ) : (
                kanwil
                  .filter((item) => item.kdkanwil === kdkanwil)
                  .map((item) => (
                    <option key={item.kdkanwil} value={item.kdkanwil}>
                      {item.kdkanwil} - {item.nmkanwil}
                    </option>
                  ))
              )}
            </Form.Select>
          </FloatingLabel>
        </Col> */}
      </Row>
    </div>
  );
};

export default Pilihan;
