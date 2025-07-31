import React, { Fragment } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import LoginForm from "./LoginForm";

import loginBg from "../../../assets/images/login/exma.jpg";

const LoginOne = () => {
  return (
    <Fragment>
      <section>
        <Container fluid>
          <Row>
            <Col
              xl={5}
              className="b-center bg-size p-0"
              style={{
                backgroundImage: `url(${loginBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
              }}
            >
              {/* Jika ingin menyisipkan image sebagai elemen juga */}
              <Image src={loginBg} alt="loginpage" className="d-none" fluid />
            </Col>
            <Col xl={7} className="p-0">
              <LoginForm logoClassMain="text-start" />
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default LoginOne;
