import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyContext from "../../auth/Context";
import jsonData from "./../../data/Kdsatker.json";
import SearchBar from "../aplikasi/carisatker/CariSatker";
import { Image, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

import CekNotifikasi from "../notifikasi/cekNotifikasi";
import ListNotifikasi from "../notifikasi/listNotifikasi";
import SleepingCat from "./idleCat";

import ChatModal from "../aplikasi/ai/ChatModal";
import Sintesa from "./Sintesa";
import PopupKirimPesan from "./kirimpesan";

export default function Header({ toggleMode, darkMode }) {
  const {
    name,
    role,
    url,
    nmrole,
    logout,
    totNotif,
    setNamelogin,
    username,
    visibilityStatuses,
    setVisibilityStatuses,
    tampilAI,
  } = useContext(MyContext);

  const [showKirimPesanModal, setShowKirimPesanModal] = useState(false);
  const [targetUser, setTargetUser] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      setNamelogin(null);
    } catch (error) {}
  };
  const [showModal, setShowModal] = useState(false);
  const [textColor, setTextColor] = useState("text-success");
  const namauser = name.split(" ");
  const singkatnama = namauser.slice(0, 2).join(" ");
  useEffect(() => {
    const colorOptions = [
      "text-success",
      "text-danger",
      "text-warning",
      "text-primary",
    ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      setTextColor(colorOptions[currentIndex]);
      currentIndex = (currentIndex + 1) % colorOptions.length;
    }, 40000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const closeModal = () => {
    setShowModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      {" "}
      <header
        id="header"
        className={`header fixed-top d-flex align-items-center  ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <div className={`d-flex align-items-center justify-content-between `}>
          <span className={`logo d-flex align-items-center ${textColor}`}>
            <i
              className="bi bi-exclude"
              style={{
                fontSize: "30px",
                fontWeight: "normal",
                margin: "8px",
              }}
            ></i>{" "}
            <span className={`d-none d-md-block p-1`}>
              <Sintesa />
            </span>
          </span>{" "}
          <i
            className={`bi bi-list toggle-sidebar-btn   ${
              darkMode ? "text-white" : "text-dark"
            }`}
          ></i>
        </div>
        <SearchBar data={jsonData} className="mx-0" />{" "}
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            {/* {role !== "2" && role !== "3" && (
              <li className="nav-item">
                <OverlayTrigger
                  placement="left"
                  overlay={
                    <Tooltip id="tooltip-mode">Aisiteru | CHATBOT AI</Tooltip>
                  }
                >
                  <a
                    className={`nav-link nav-icon ${
                      darkMode ? "text-white" : "text-primary"
                    }`}
                    href="#"
                    onClick={openModal}
                    aria-expanded="true"
                  >
                    <i
                      className={`bi bi-chat-dots-fill ${
                        darkMode ? "text-white" : "text-primary"
                      }`}
                    ></i>
                  </a>
                </OverlayTrigger>
              </li>
            )} */}

            <OverlayTrigger
              placement="left"
              overlay={
                <Tooltip id="tooltip-mode">
                  {darkMode ? "Mode Terang" : "Mode Gelap"}
                </Tooltip>
              }
            >
              <a
                className={`nav-link nav-icon ${
                  darkMode ? "dark-mode" : "light-mode"
                }`}
                href="#"
                onClick={toggleMode}
              >
                <i
                  className={`bi ${darkMode ? "bi-moon" : "bi-sun"} ${
                    darkMode ? "text-white" : "text-dark" // Menambah kelas text-white untuk mode gelap
                  }`}
                ></i>
              </a>
            </OverlayTrigger>

            <li className="nav-item dropdown">
              <a
                className="nav-link nav-icon"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ position: "relative" }}
              >
                <i
                  className={`bi bi-bell ${
                    darkMode ? "text-white" : "text-dark"
                  }`}
                ></i>

                <span className="badge bg-danger badge-number mx-0">
                  <CekNotifikasi />
                </span>
              </a>
              <div
                className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications"
                style={{
                  width: "350px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  border: "none",
                  boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  padding: "0",
                }}
              >
                <ListNotifikasi />
              </div>
            </li>
            <li className="nav-item dropdown ">
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0 mx-4"
                href="#"
                data-bs-toggle="dropdown"
              >
                <Image
                  src={url ? url : "/foto/null.png"}
                  className="rounded fade-in"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/foto/null.png";
                  }}
                />
                <span
                  className={`d-none d-md-block dropdown-toggle ps-2  ${
                    darkMode ? "text-white" : "text-dark"
                  }`}
                >
                  {singkatnama}
                </span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6 style={{ fontSize: "14px" }}>{name}</h6>
                  <span> {nmrole}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <NavDropdown.Item as={Link} to="/v3/profile/user">
                    <i className="bi bi-person text-secondary"></i>
                    <span>Profile</span>
                  </NavDropdown.Item>
                </li>
                <li>
                  <hr className=" dropdown-divider" />
                </li>
                {role === "X" ? (
                  <>
                    <li>
                      <NavDropdown.Item as={Link} to="/v3/admin/users">
                        <i className="bi bi-card-text text-primary"></i>
                        <span>Manajemen User</span>
                      </NavDropdown.Item>
                    </li>
                  </>
                ) : null}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                {role === "X" ? (
                  <>
                    <li>
                      <NavDropdown.Item as={Link} to="/v3/admin/setting">
                        <i className="bi bi-gear text-success"></i>
                        <span>Setting</span>
                      </NavDropdown.Item>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                  </>
                ) : null}

                {role === "X" ? (
                  <>
                    <li>
                      <NavDropdown.Item as={Link} to="/v3/chat/landing">
                        <i className="bi bi-filetype-ai text-warning fw-bold"></i>
                        <span>AI Center</span>
                      </NavDropdown.Item>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                  </>
                ) : null}
                <li>
                  <NavDropdown.Item as={Link} to="/v3/notifikasi">
                    <i className="bi bi-bell text-success"></i>
                    <span>Notifikasi</span>
                  </NavDropdown.Item>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowKirimPesanModal(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="bi bi-chat-dots text-primary"></i>
                    <span>Kirim Pesan</span>
                  </a>
                </li>
                <hr className="dropdown-divider" />

                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right text-danger"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <SleepingCat />
      </header>
      {/* Popup Kirim Pesan */}
      <PopupKirimPesan
        show={showKirimPesanModal}
        onHide={() => setShowKirimPesanModal(false)}
        toUser={targetUser}
      />
    </>
  );
}
