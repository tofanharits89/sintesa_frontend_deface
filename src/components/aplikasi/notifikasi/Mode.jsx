import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import { Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Mode() {
  const { mode, tampil, tampilverify, active, verified } =
    useContext(MyContext);
  // console.log(verified);

  if (mode === "0" && tampil) {
    return (
      <main id="main" className="main">
        <section className="section mode">
          <Container>
            <Alert variant="danger fw-normal fade-in" dismissible>
              Sintesa sekarang sedang berada di mode Development
            </Alert>
          </Container>
        </section>
      </main>
    );
  } else if (
    active === "1" &&
    tampilverify &&
    (verified === "FALSE" || verified === "")
  ) {
    return (
      <main id="main" className="main">
        <section className="section mode">
          <Container style={{ marginTop: "75px" }}>
            <Alert variant="primary fw-normal fade-in" dismissible>
              Verifikasi user anda sekarang dengan menambahkan nomor telepon
              yang terhubung dengan WhatsApp untuk mendapatkan berbagai fitur
              antara lain :
              <hr />
              <div className="text-start">
                <li>login hanya dengan PIN </li>
                <li>analisa hasil inquiry belanja </li>
                <li>share data hasil inqury melalui WhatsApp</li>
                <li>akses ke #Aisiteru (AI Sintesa) melalui UI Browser</li>
                <li>akses ke #Aisiteru (AI Sintesa) melalui WA</li>
                <hr />
                <p className="mt-4 fw-bold">
                  Petunjuk aktivasi akun sudah kami kirimkan melalui pesan ke
                  semua user. Silahkan cek notifikasi
                  <Link to="/v3/notifikasi"> disini</Link>
                </p>
                <p className="fw-bold" style={{ marginTop: "50px" }}>
                  Salam Semangat 👋
                </p>
                <p className="fw-bold">Tim Pengembang Sintesa v3</p>
              </div>
            </Alert>
          </Container>
        </section>
      </main>
    );
  } else {
    return null;
  }
}
