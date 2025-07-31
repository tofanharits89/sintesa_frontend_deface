import React, { useState, useContext } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import FormKritik from "../saran/landing";
import Typewriter from "../../layout/Typewriter";

export const BugReport = () => {
  const { axiosJWT, token } = useContext(MyContext);

  const handleKritikSubmit = (kritik) => {
    // console.log("Entering handleKritikSubmit"); // Add this line
    //  console.log("Kritik yang dikirim:", kritik);
  };

  return (
    <Container className="p-2">
      {/* <Row>
        <Col xs={12} md={12}>
          <LandingPage />
        </Col>
      </Row> */}
      <Row>
        <Col xs={12} md={12}>
          <h6 className="text-dark">
            <Typewriter text="Mari jadikan Sintesa lebih baik ..." />
          </h6>
          <span>
            Terima kasih telah membantu kami memperbaiki aplikasi Sintesa v3.
            Jika Anda menemui bug atau masalah lain dalam penggunaan aplikasi,
            harap laporkan di bawah ini.
          </span>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={12}>
          <FormKritik onSubmit={handleKritikSubmit} />
        </Col>
      </Row>
    </Container>
  );
};
