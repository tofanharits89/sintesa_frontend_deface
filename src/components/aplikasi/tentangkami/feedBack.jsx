import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import "./team.css";
import { BugReport } from "./bugReport";
import Dokumentasi from "./dokumentasi";

const Feedback = () => {
  const { url } = useContext(MyContext);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Feedback </h1>
          {/* <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Form</a>
              </li>
             
            </ol>
          </nav> */}
        </div>
        <section className="section dashboard team">
          <div className="corner-icon top-left">
            <i className="bi bi-exclude"></i>
          </div>
          <div className="corner-icon top-right">
            <i className="bi bi-exclude"></i>
          </div>
          <Container fluid>
            <Card className="mt-0" id="saran">
              <Card.Body className="mt-4 bg-light rounded text-dark p-2">
                <BugReport />
              </Card.Body>
            </Card>
          </Container>
        </section>
      </main>
    </>
  );
};

export default Feedback;
