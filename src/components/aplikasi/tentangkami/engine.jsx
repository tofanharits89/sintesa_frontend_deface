import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import { Container, Card } from "react-bootstrap";
import "./team.css";

const Engine = () => {
  const { url } = useContext(MyContext);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Engine </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Core</a>
              </li>
              <li className="breadcrumb-item active">App</li>
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

          <Container className="my-4">
            <Card
              className="mt-3"
              style={{
                backgroundColor: "#fffff",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Body className="mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <a
                      href="#"
                      className={`logo d-flex align-items-center text-primary`}
                      style={{ textDecoration: "none" }}
                    >
                      <i
                        className="bi bi-exclude text-danger"
                        style={{
                          fontSize: "24px",
                          fontWeight: "normal",
                          margin: "0 10px 0 0",
                        }}
                      ></i>
                      <span
                        className="d-none d-md-block"
                        style={{ fontWeight: "bold", fontSize: "20px" }}
                      >
                        Sintesa v3
                      </span>
                    </a>
                  </div>
                  <div>
                    <a href="#informasi" style={{ textDecoration: "none" }}>
                      Informasi{" "}
                    </a>
                  </div>
                </div>
                <div className="my-4" id="informasi">
                  {" "}
                  (Production Version){" "}
                </div>
                <p>
                  {" "}
                  Sintesa v3 dibangun dengan teknologi sebagai berikut : <br />{" "}
                </p>
                <hr className="styled-hr" />
                <p> Core utama aplikasi </p>
                <ul>
                  <li>
                    {" "}
                    Node.js version v18.17.0 (LTS) [https://nodejs.org/en]{" "}
                  </li>
                  <li>
                    {" "}
                    React.js version 18.2.0 (frontend) [https://react.dev/]{" "}
                  </li>
                  <li>
                    {" "}
                    Express.js version 4.17.1 (backend) [https://expressjs.com/]{" "}
                  </li>
                </ul>{" "}
                <hr className="styled-hr" />
                <p> Framework CSS </p>
                <ul>
                  <li> Bootstrap 5 [https://react-bootstrap.netlify.app/] </li>
                </ul>{" "}
                <hr className="styled-hr" />
                <p> Database </p>
                <ul>
                  <li> MYSQL </li>
                </ul>{" "}
                <hr className="styled-hr" />
                <p> Enkripsi dan Kompresi Data </p>
                <ul>
                  <li> CryptoJS </li>
                  <li> gzip </li>
                </ul>{" "}
                <hr className="styled-hr" />
                <p> Autentikasi Endpoint </p>
                <ul>
                  <li> JWT (JSON Web Token) </li>
                </ul>{" "}
                <hr className="styled-hr" />
                <p> Lisensi </p>
                <ul>
                  <li> MIT </li>
                </ul>{" "}
                <hr className="styled-hr" />
                {/* <p> Lain-Lain </p>
                <ul>
                  <li>
                    {" "}
                    Websocket kami gunakan untuk komunikasi ke Server secara
                    realtime{" "}
                  </li>
                  <li>
                    {" "}
                    NiceAdmin template{" "}
                    <i className="bi bi-emoji-heart-eyes-fill"></i>{" "}
                  </li>
                </ul> */}
              </Card.Body>
            </Card>
          </Container>
        </section>
      </main>
    </>
  );
};

export default Engine;
