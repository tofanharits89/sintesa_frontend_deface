import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import LoginForm from "./LoginForm";

const Login = () => (
  <Container fluid className="p-0">
    <Row>
      <Col>
        <LoginForm />
      </Col>
    </Row>
  </Container>
);

export default Login;
