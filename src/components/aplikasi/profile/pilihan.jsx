import React, { useState, useContext } from "react";
import { FloatingLabel, Form, Col, Row } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import kddept from "../../../data/Kddept.json";
import kdunit from "../../../data/Kdunit.json";
import kanwil from "../../../data/Kdkanwil.json";
import "./pilihan.css";

const Pilihan = ({ onInputChange }) => {
  const { role, kdkanwil } = useContext(MyContext);

  const [selectedDept, setSelectedDept] = useState("000");
  const [selectedTA, setSelectedTA] = useState("2024");

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "dept") {
      setSelectedDept(value.split("//")[0]);
    }

    if (id === "thang") {
      setSelectedTA(value);
    }

    onInputChange(id, value);
  };
  //console.log(selectedDept);
  return (
    <div
      className="sticky-header1 is-sticky  my-0"
      style={{ borderRadius: "5px" }}
    >
      <Row>
        <Col xl={2} md={6} lg={12} sm={12} className="my-2">
          <FloatingLabel controlId="thang" label="Pilih TA" className="combo">
            <Form.Select onChange={handleInputChange} value={selectedTA}>
              <option value="2020">TA 2020</option>
              <option value="2021">TA 2021</option>
              <option value="2022">TA 2022</option>
              <option value="2023">TA 2023</option>
              <option value="2024">TA 2024</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col xl={4} md={6} lg={12} sm={12} className="my-2">
          <FloatingLabel
            controlId="dept"
            label="Pilih Kementerian"
            className="combo"
          >
            <Form.Select className="pilih" onChange={handleInputChange}>
              <option value="000">Semua Kementerian</option>
              {kddept.map((kl, index) => (
                <option key={index} value={kl.kddept + "//" + kl.nmdept}>
                  {kl.kddept} - {kl.nmdept}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col xl={4} md={6} lg={12} sm={12} className="my-2">
          <FloatingLabel
            controlId="unit"
            label="Pilih Eselon I"
            className="combo"
          >
            <Form.Select className="pilih" onChange={handleInputChange}>
              <option value="00">Semua Unit</option>
              {kdunit
                .filter((item) => item.kddept === selectedDept)
                .map((item, index) => (
                  <option value={item.kdunit} key={index}>
                    {item.kdunit} - {item.nmunit}
                  </option>
                ))}
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col xl={2} md={6} lg={12} sm={12} className="my-2">
          <FloatingLabel
            controlId="prov"
            label="Pilih Kanwil"
            className="combo"
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
        </Col>
      </Row>
    </div>
  );
};

export default Pilihan;
