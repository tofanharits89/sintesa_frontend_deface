import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./team.css";

const Log = () => {
  const { url } = useContext(MyContext);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Change Log </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Update</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">Log</li>
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
            <Card className="mt-3">
              <Card.Body className="mt-4">
                <h5 className="p-0">
                  Version 1.0.1.1 - Release Date: 06/11/2023
                  <br />
                </h5>
                <pre>(beta)</pre>
                <ul>
                  <li>Penambahan menu Harmonisasi Belanja K/L dan DAK Fisik</li>
                  <li>Penambahan menu Dispensasi SPM dan Kontrak</li>
                </ul>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="mt-4">
                <h5 className="p-0">
                  Version 1.0.1 - Release Date: 16/10/2023
                </h5>
                <pre>(beta)</pre>
                <ul>
                  <li>
                    Pilihan Single Session saat user melakukan login dengan IP
                    dan Username yang sama
                  </li>
                  <li>
                    Penambahan Captcha pada form login. Menggunakan Captcha
                    standart (default) atau menggunakan Google reCaptcha v2
                  </li>
                  <li>Penambahan menu UP/TUP</li>
                  <li>
                    Penambahan Log Menu yang menyimpan jumlah klik per menu
                  </li>
                  <li>Penambahan Log User yang menyimpan jumlah pengunjung</li>
                  <li>Penambahan List user yang sedang Online</li>
                  <li>
                    Perbaikan UI pada form login dan breakpoints pada tampilan
                    mobile
                  </li>
                  <li>Perbaikan bug pada Inquiry Belanja</li>
                </ul>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="mt-4">
                <h5 className="p-0">
                  Version 1.0.0 - Release Date: 01/10/2023
                </h5>
                <pre>(beta)</pre>

                <ul>
                  <li>Development Mode released</li>
                </ul>
              </Card.Body>
            </Card>

            {/* You can add more change log entries here */}
          </Container>
        </section>
      </main>
    </>
  );
};

export default Log;
