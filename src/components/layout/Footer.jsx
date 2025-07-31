import React, { useContext, useEffect, useState } from "react";
import { Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import Typewriter from "./Typewriter";
import MyContext from "../../auth/Context";
import "../layout/query.css";
import Lokasi from "../aplikasi/lokasi/getLokasi";
import { ToastUserLogin } from "../aplikasi/notifikasi/Omspan";
import SocketProvider from "../../auth/Socket";

const Footer = () => {
  const { name, statusLogin, namelogin, loginDengan, username } =
    useContext(MyContext);
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [showName, setShowName] = useState(false);
  const tooltip = <Tooltip id="tooltip-top">Kembali ke atas</Tooltip>;
  // console.log(loginDengan);

  useEffect(() => {
    setShowName(true); // Tampilkan shortenedName saat komponen dimount
    const timer = setTimeout(() => {
      setShowName(false); // Sembunyikan shortenedName setelah 5 detik
    }, 5000);
    namelogin &&
      ToastUserLogin(
        `${namelogin} telah login ${
          loginDengan === "PIN" ? "dengan PIN 🔐" : ""
        }`
      );

    return () => clearTimeout(timer); // Membersihkan timer saat komponen di-unmount
  }, [namelogin, loginDengan]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowGoToTop(true);
      } else {
        setShowGoToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const namauser = name.split(" ");
  const singkatnama = namauser.slice(0, 2).join(" ");

  return (
    statusLogin && (
      <SocketProvider username={username}>
        <Navbar
          style={navbarStyle}
          fixed="bottom"
          collapseOnSelect
          expand="xs"
          bg="dark"
          className="d-flex justify-content-between align-items-center"
        >
          <Navbar.Brand className="d-flex justify-content-between w-100">
            <span className="text-white" style={{ fontSize: "15px" }}>
              V1.0.1 © PDPSIPA 2023 | <Typewriter text={singkatnama} />{" "}
            </span>
            <span className="text-white mx-2">
              {showGoToTop && (
                <OverlayTrigger placement="right" overlay={tooltip}>
                  <span
                    onClick={handleGoToTop}
                    className="text-white foot fade-in mx-4"
                  >
                    <i
                      className="bi bi-arrow-up-square-fill mx-0"
                      style={{ fontSize: "18px", cursor: "pointer" }}
                    ></i>
                  </span>
                </OverlayTrigger>
              )}
            </span>
            <span>
              <Lokasi />
            </span>
          </Navbar.Brand>
        </Navbar>
      </SocketProvider>
    )
  );
};
const navbarStyle = {
  width: "100%",
};

export default Footer;
