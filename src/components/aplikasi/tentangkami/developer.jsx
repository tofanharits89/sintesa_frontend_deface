import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./team.css";

const Developer = () => {
  const { url } = useContext(MyContext);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Developer</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Core</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">API-2</li>
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
            <Card>
              <Card.Title className="p-3 text-center">
                Data Untuk Semua
              </Card.Title>
              <Card.Body>
                {" "}
                <div>
                  <header>
                    <p>
                      Di era keterbukaan layanan informasi, Data dalam Sintesa
                      bisa diakses atau dimanfaatkan untuk berbagai keperluan
                      secara mudah. Akses data Sintesa melalui API memberikan
                      informasi yang cepat dan data dapat digunakan untuk
                      berbagai kebutuhan secara realtime.
                    </p>
                    <br />
                    <p>Mengapa Harus Menggunakan API?</p>
                    <p>
                      API (<i>Application Programing Interface</i>) memberikan
                      akses yang mudah dan terstandar ke berbagai sumber daya
                      dan layanan Sintesa. Dengan menggunakan API, Anda dapat:
                    </p>
                    <br />
                    <ul>
                      <li>
                        <strong>Integrasi yang Mudah :</strong> Integrasikan
                        data ke dalam aplikasi Anda dengan cepat.
                      </li>
                      <li>
                        <strong>Pembaruan Real-time :</strong> Dapatkan
                        informasi terbaru secara real-time tanpa perlu menyimpan
                        data secara lokal.
                      </li>
                      <li>
                        <strong>Skalabilitas :</strong> Mudah memperluas dan
                        memperbarui fungsionalitas tanpa mengubah struktur utama
                        data anda.
                      </li>
                      <li>
                        <strong>Pengembangan Efisien :</strong> Fokus pada
                        pengembangan fitur tanpa perlu mengelola infrastruktur
                        data secara langsung.
                      </li>
                    </ul>
                  </header>

                  <footer className="footer">
                    <p>
                      Untuk petunjuk akses data API, silahkan hubungi LO Sintesa{" "}
                      <br />
                      Bayu Yudistira (+62 853-1893-9744)/ atau dengan mengajukan
                      surat resmi kedinasan kepada kami
                      <br />
                      <br />
                      Salam
                    </p>
                  </footer>
                </div>
              </Card.Body>
            </Card>
          </Container>
        </section>
      </main>
    </>
  );
};

export default Developer;
