import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./team.css";

const Team = () => {
  const { url } = useContext(MyContext);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Tentang Kami</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Team</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">Member</li>
            </ol>
          </nav>
        </div>
        <section className="section dashboard team">
          <div className="corner-icon top-left">
            <i className="bi bi-exclude"></i>
          </div>
          <div className="corner-icon top-right">
            <i className="bi bi-exclude"></i>
          </div>

          <Container>
            <Row className="justify-content-center">
              <Col md={4}>
                <Card className="profileteam">
                  <Card.Img
                    src={
                      import.meta.env.VITE_PUBLIC_URL +
                      "/foto/Moudy_Hermawan.png"
                    }
                    alt="Profile 1"
                  />
                  <Card.Body>
                    <Card.Title>Moudy Hermawan</Card.Title>
                    <Card.Text>Penanggung Jawab</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Card className="profileteam">
                  <Card.Img
                    src={import.meta.env.VITE_PUBLIC_URL + "/foto/ari_s.jpeg"}
                    alt="Profile 1"
                  />
                  <Card.Body>
                    <Card.Title>Arie Suwandani</Card.Title>
                    <Card.Text>Pembina</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="profileteam">
                  <Card.Img
                    src={
                      import.meta.env.VITE_PUBLIC_URL +
                      "/foto/302448510_629033305273351_2561626813355947053_n.jpg"
                    }
                    alt="Profile 1"
                  />
                  <Card.Body>
                    <Card.Title>Bayu Yudhistira</Card.Title>
                    <Card.Text>Project Manager</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* Baris 3 */}
            <br />
            <Row>
              <Col md={3}>
                <Card className="profileteam">
                  <Card.Img
                    src={import.meta.env.VITE_PUBLIC_URL + "/foto/dani.jpeg"}
                    alt="Profile 1"
                  />
                  <Card.Body>
                    <Card.Title>Legendani</Card.Title>
                    <Card.Text>Mockup Designer</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="profileteam">
                  <Card.Img
                    src={
                      import.meta.env.VITE_PUBLIC_URL +
                      "/foto/a9ab71af5552cb98bd83d6dc0ed2f149.jpg"
                    }
                    alt="Profile 1"
                  />
                  <Card.Body>
                    <Card.Title>Restu Alam Siagian</Card.Title>
                    <Card.Text>DBA & Fullstack Developer</Card.Text>
                  </Card.Body>
                </Card>
              </Col>{" "}
              <Col md={3}>
                <Card className="profileteam">
                  <Card.Img
                    src={import.meta.env.VITE_PUBLIC_URL + "/foto/tofan.jpg"}
                    alt="Profile 1"
                  />
                  <Card.Body>
                    <Card.Title>Taufan Maulana Harits</Card.Title>
                    <Card.Text>Fullstack Developer</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="profileteam">
                  <Card.Img
                    src={
                      import.meta.env.VITE_PUBLIC_URL +
                      "/foto/368215460_1396692604213485_5347192732567637734_n.jpg"
                    }
                    alt="Profile 1"
                  />
                  <Card.Body>
                    <Card.Title>Yacob Yulis</Card.Title>
                    <Card.Text>Fullstack Developer</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="row justify-content-between heart mt-4">
              <div className="col-auto">PDPSIPA © 2023</div>
              <div className="col-auto">
                <i className="bi bi-cup-fill"></i> KANT<small>or</small>IN
                <small>tegritas@tresuri</small>{" "}
                <i className="bi bi-cup-straw"></i>
              </div>
              <div className="col-auto">
                made with <i className="bi bi-heart-fill text-danger"></i>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
};

export default Team;
