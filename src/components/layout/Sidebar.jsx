import React, { useContext, useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import MyContext from "../../auth/Context";
import { Image } from "react-bootstrap";

export default function Sidebar({ darkMode }) {
  const { statusLogin, role, username } = useContext(MyContext);
  const [activeSubmenu, setActiveSubmenu] = useState("");
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const toggleSidebarBtn = document.querySelector(".toggle-sidebar-btn");
    const bodyElement = document.querySelector("body");

    const handleSidebarToggle = () => {
      if (isSidebarVisible) {
        bodyElement.classList.remove("toggle-sidebar");
      } else {
        bodyElement.classList.add("toggle-sidebar");
      }
      setSidebarVisible(!isSidebarVisible);
    };

    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener("click", handleSidebarToggle);
    }

    return () => {
      if (toggleSidebarBtn) {
        toggleSidebarBtn.removeEventListener("click", handleSidebarToggle);
      }
    };
    clearInterval(intervalId);
  }, [isSidebarVisible]);

  const handleSubmenuClick = (submenuName) => {
    if (activeSubmenu === submenuName) {
      setActiveSubmenu("");
    } else {
      setActiveSubmenu(submenuName);
    }
    // console.log(activeSubmenu);
    (submenuName === "data-kinerja" ||
      submenuName === "data-cluster" ||
      submenuName === "data-spending" ||
      submenuName === "data-dispensasi" ||
      submenuName === "data-harmonisasi" ||
      submenuName === "dashboard-mbg" ||
      submenuName === "bansos-dash" ||
      submenuName === "monev_pnbp") &&
      document.body.classList.add("toggle-sidebar");
  };

  const daysInIndonesian = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  useEffect(() => {
    const pathname = window.location.pathname;

    // Cek jika URL adalah /v3/landing/mbg
    if (pathname === "/v3/landing/mbg") {
      document.body.classList.add("toggle-sidebar");
      setSidebarVisible(false); // Update state agar sinkron
    }
    
    // Auto-collapse sidebar untuk user djsef
    if (username === "djsef") {
      document.body.classList.add("toggle-sidebar");
      setSidebarVisible(false);
    }
  }, [username]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  return (
    <>
      {statusLogin && (
        <>
          <aside
            id="sidebar"
            className={`sidebar ${isSidebarVisible ? "" : ""} ${
              darkMode ? "dark-mode" : "bg-light"
            }`}
          >
            <ul className="sidebar-nav" id="sidebar-nav">
              {/* Special menu for user djsef */}
              {username === "djsef" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/v3/landing/mbg">
                    <i className="bi bi-bar-chart-fill text-success" style={{ fontSize: "18px" }}></i>
                    <span>Dashboard MBG</span>
                  </Link>
                </li>
              )}
              {role !== "3" && username !== "djsef" && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link collapsed"
                      data-bs-target="#dashboard-nav"
                      data-bs-toggle="collapse"
                      to="#"
                    >
                      <i
                        className="bi bi-house-door-fill text-primary"
                        style={{ fontSize: "18px" }}
                      ></i>{" "}
                      {/* Ikon untuk Dashboard */}
                      <span>Dashboard</span>
                      <i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul
                      id="dashboard-nav"
                      className="nav-content collapse"
                      data-bs-parent="#sidebar-nav"
                    >
                      <li>
                        <Link
                          to="v3/landing/profile"
                          onClick={() =>
                            handleSubmenuClick("dashboard-profile")
                          }
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "dashboard-profile"
                              ? "active"
                              : ""
                          }`}
                          as={Link}
                        >
                          <i className="bi bi-circle"></i>

                          <span className="submenu">Kementerian/ Lembaga</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          as={Link}
                          className={` ${darkMode ? "text-white" : ""}`}
                          to="v3/data/form/bansos_dash"
                          onClick={() => handleSubmenuClick("bansos-dash")}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu ">Bansos</span>
                        </Link>
                      </li>
                    </ul>
                  </li>{" "}
                </>
              )}
              <li className="nav-item">
                <Link
                  className="nav-link collapsed "
                  data-bs-target="#mbg-nav"
                  data-bs-toggle="collapse"
                  to="#"
                >
                  <i className="bi bi-shop"></i>

                  <span>Makan Bergizi</span>

                  <i className="bi bi-chevron-down ms-auto"></i>
                </Link>
                <ul
                  id="mbg-nav"
                  className="nav-content collapse "
                  data-bs-parent="#sidebar-nav"
                >
                  <li>
                    <Link
                      to="v3/landing/mbg"
                      onClick={() => handleSubmenuClick("dashboard-mbg")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "dashboard-mbg" ? "active" : ""
                      }`}
                      as={Link}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Dashboard</span>
                    </Link>
                  </li>
                  {(role !== "3" && role !== "4" && username !== "djsef") || username === "djsef" ? (
                    <>
                      {username !== "djsef" && (
                        <li>
                          <Link
                            as={Link}
                            to="v3/mbg/kertas-kerja/"
                            onClick={() => handleSubmenuClick("kk-mbg")}
                            className={` ${darkMode ? "text-white" : ""} ${
                              activeSubmenu === "kk-mbg" ? "active" : ""
                            }`}
                          >
                            <i className="bi bi-circle"></i>
                            <span className="submenu">Kertas Kerja MBG</span>
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          as={Link}
                          to="v3/mbg/update-data/"
                          onClick={() => handleSubmenuClick("update-mbg")}
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "update-mbg" ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu">Data</span>
                        </Link>
                      </li>
                    </>
                  ) : null}
                </ul>
              </li>
              {role === "X" ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link collapsed "
                      data-bs-target="#belwil-nav"
                      data-bs-toggle="collapse"
                      to="#"
                    >
                      <i className="bi bi-globe"></i>

                      <span>Data Kewilayahan</span>

                      <i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul
                      id="belwil-nav"
                      className="nav-content collapse "
                      data-bs-parent="#sidebar-nav"
                    >
                      {/* <li>
                        <Link
                          to="v3/landing/belwil"
                          onClick={() => handleSubmenuClick("dashboard-belwil")}
                          className={` ${darkMode ? "text-white" : ""} ${activeSubmenu === "dashboard-belwil" ? "active" : ""
                            }`}
                          as={Link}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu">Dashboard Kewilayahan</span>
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          as={Link}
                          to="v3/belwil/update-data/"
                          onClick={() => handleSubmenuClick("update-belwil")}
                          className={` ${darkMode ? "text-white" : ""} ${activeSubmenu === "update-belwil" ? "active" : ""
                            }`}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu"> Belanja Kewilayahan</span>
                        </Link>
                      </li>
                      {role !== "3" && (
                        <>
                          <li>
                            <Link
                              to="v3/data/form/bansos"
                              onClick={() => handleSubmenuClick("data-bansos")}
                              className={`${darkMode ? "text-white" : ""} ${activeSubmenu === "data-bansos" ? "active" : ""
                                }`}
                            >
                              <i className="bi bi-circle"></i>
                              <span className="submenu">Bansos</span>
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                </>
              ) : null}
              {username !== "djsef" && (
                <>
              {role === "X" || role === "0" || role === "1" ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link collapsed "
                      data-bs-target="#kinerja-nav"
                      data-bs-toggle="collapse"
                      to="#"
                    >
                      <i className="bi bi-x-diamond"></i>

                      <span>Profile</span>

                      <i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul
                      id="kinerja-nav"
                      className="nav-content collapse "
                      data-bs-parent="#sidebar-nav"
                    >
                      <li>
                        <Link
                          as={Link}
                          className={` ${darkMode ? "text-white" : ""}`}
                          to="v3/data/form/kinerja"
                          onClick={() => handleSubmenuClick("data-kinerja")}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu ">Kinerja K/L</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          as={Link}
                          className={` ${darkMode ? "text-white" : ""}`}
                          to="v3/data/form/cluster"
                          onClick={() => handleSubmenuClick("data-cluster")}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu ">Clustering</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              ) : null}
              {role === "X" ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link collapsed "
                      data-bs-target="#epa-nav"
                      data-bs-toggle="collapse"
                      to="#"
                    >
                      <i className="bi bi-graph-down"></i>

                      <span>EPA</span>

                      <i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul
                      id="epa-nav"
                      className="nav-content collapse "
                      data-bs-parent="#epa-nav"
                    >
                      <li>
                        <Link
                          as={Link}
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "epa" ? "active" : ""
                          }`}
                          to="v3/epa/landing"
                          onClick={() => handleSubmenuClick("epa")}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu ">Summary</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          as={Link}
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "epa-detail" ? "active" : ""
                          }`}
                          to="v3/epa/detail"
                          onClick={() => handleSubmenuClick("epa-detail")}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu "> Analisa</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              ) : null}
              <li className="nav-item">
                <Link
                  className="nav-link collapsed"
                  data-bs-target="#data-nav"
                  data-bs-toggle="collapse"
                  to="#"
                >
                  <i className="bi bi-clipboard-data"></i>
                  <span>Inquiry Data</span>
                  <i className="bi bi-chevron-down ms-auto"></i>
                </Link>
                <ul
                  id="data-nav"
                  className="nav-content collapse"
                  style={{
                    margin: "2px",
                    borderRadius: "5px 5px",
                  }}
                  data-bs-parent="#sidebar-nav"
                >
                  <li>
                    <Link
                      to="v3/data/form/belanja"
                      onClick={() => handleSubmenuClick("data-belanja")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-belanja" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Belanja</span>
                    </Link>
                  </li>

                  {/* {role !== "3" ? ( */}
                  <li>
                    <Link
                      to="/v3/data/form/tematik"
                      onClick={() => handleSubmenuClick("data-tematik")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-tematik" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Tematik</span>
                    </Link>
                  </li>
                  {/* ) : null} */}
                  <li>
                    <Link
                      to="v3/data/form/kontrak"
                      onClick={() => handleSubmenuClick("data-kontrak")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-kontrak" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Kontrak</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="v3/data/form/uptup"
                      onClick={() => handleSubmenuClick("data-uptup")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-uptup" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">UP/ TUP</span>
                    </Link>
                  </li>
                  {role !== "3" && (
                    <>
                      <li>
                        <Link
                          to="v3/data/form/bansos"
                          onClick={() => handleSubmenuClick("data-bansos")}
                          className={`${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "data-bansos" ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu">Bansos</span>
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <Link
                      to="v3/data/form/deviasi"
                      onClick={() => handleSubmenuClick("data-deviasi")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-deviasi" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Deviasi</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="v3/data/form/rkakl"
                      onClick={() => handleSubmenuClick("data-rkakl")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-rkakl" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">RKAKL Detail</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="v3/data/form/penerimaan"
                      onClick={() => handleSubmenuClick("data-penerimaan")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-penerimaan" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Penerimaan PNBP</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="v3/data/form/revisi"
                      onClick={() => handleSubmenuClick("data-revisi")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-revisi" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Revisi DIPA</span>
                    </Link>
                  </li>
                </ul>
              </li>
              {(role === "X" ||
                role === "2" ||
                role === "0" ||
                role === "1") && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link collapsed"
                      data-bs-target="#spending"
                      data-bs-toggle="collapse"
                      to="#"
                    >
                      <i className="bi bi-bag-fill"></i>
                      <span>Spending Review</span>
                      {/* <span className="badge bg-success mx-2">NEW</span> */}
                      <i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul
                      id="spending"
                      className="nav-content collapse "
                      style={{
                        margin: "2px",
                        borderRadius: "5px 5px",
                      }}
                      data-bs-parent="#sidebar-nav"
                    >
                      <li>
                        <Link
                          as={Link}
                          to="v3/spending/alokasi"
                          onClick={() => handleSubmenuClick("data-spending")}
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "data-spending" ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu">Review Alokasi</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          as={Link}
                          to="v3/spending/formalokasi"
                          onClick={() => handleSubmenuClick("data-formalokasi")}
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "data-formalokasi" ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu">Rekapitulasi</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          as={Link}
                          to="v3/spending/monitoring"
                          onClick={() => handleSubmenuClick("data-monitoring")}
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "data-monitoring" ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu">Monitoring</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              {role !== "3" && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link collapsed"
                      data-bs-target="#laporan-nav"
                      data-bs-toggle="collapse"
                      to="#"
                    >
                      <i className="bi bi-journal-text"></i>
                      <span>Laporan</span>
                      <i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul
                      id="laporan-nav"
                      className="nav-content collapse "
                      style={{
                        margin: "2px",
                        borderRadius: "5px 5px",
                      }}
                      data-bs-parent="#sidebar-nav"
                    >
                      <li>
                        {role !== "3" && (
                          <>
                            <li>
                              <Link
                                as={Link}
                                to="v3/data/form/harmonisasi"
                                onClick={() =>
                                  handleSubmenuClick("data-harmonisasi")
                                }
                                className={` ${darkMode ? "text-white" : ""} ${
                                  activeSubmenu === "data-harmonisasi"
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <i className="bi bi-circle"></i>
                                <span className="submenu">Harmonisasi</span>
                              </Link>
                            </li>
                          </>
                        )}
                      </li>
                      <li>
                        {(role === "0" ||
                          role === "1" ||
                          role === "X" ||
                          role === "2") && (
                          <>
                            <li>
                              <Link
                                as={Link}
                                to="v3/data/form/tpid"
                                onClick={() => handleSubmenuClick("data-tpid")}
                                className={` ${darkMode ? "text-white" : ""} ${
                                  activeSubmenu === "data-tpid" ? "active" : ""
                                }`}
                              >
                                <i className="bi bi-circle"></i>
                                <span className="submenu">Tantangan TPID</span>
                              </Link>
                            </li>
                          </>
                        )}
                      </li>
                      <li>
                        {(role === "0" || role === "1" || role === "X") && (
                          <>
                            <li>
                              <Link
                                as={Link}
                                to="v3/data/form/weekly_report"
                                onClick={() => handleSubmenuClick("data-wr")}
                                className={` ${darkMode ? "text-white" : ""} ${
                                  activeSubmenu === "data-wr" ? "active" : ""
                                }`}
                              >
                                <i className="bi bi-circle"></i>
                                <span className="submenu">Weekly Report</span>
                                {/* <span className="badge bg-danger mx-2">
                                  NEW
                                </span> */}
                              </Link>
                            </li>
                          </>
                        )}
                      </li>
                      <li>
                        {(role === "0" || role === "1" || role === "X") && (
                          <>
                            <li>
                              <Link
                                as={Link}
                                to="v3/data/form/monitoring_blokir"
                                onClick={() =>
                                  handleSubmenuClick("monitoring-blokir")
                                }
                                className={` ${darkMode ? "text-white" : ""} ${
                                  activeSubmenu === "monitoring-blokir"
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <i className="bi bi-circle"></i>
                                <span className="submenu">
                                  Monitoring Blokir
                                </span>
                              </Link>
                            </li>
                          </>
                        )}
                      </li>
                      <li>
                        {role !== "3" && (
                          <>
                            <li>
                              <Link
                                as={Link}
                                to="v3/data/form/monev_pnbp"
                                onClick={() => handleSubmenuClick("monev_pnbp")}
                                className={` ${darkMode ? "text-white" : ""} ${
                                  activeSubmenu === "monev_pnbp" ? "active" : ""
                                }`}
                              >
                                <i className="bi bi-circle"></i>
                                <span className="submenu">Monev PNBP</span>
                              </Link>
                            </li>
                          </>
                        )}
                      </li>
                    </ul>
                  </li>
                </>
              )}
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link collapsed"
                    data-bs-target="#dispensasi-nav"
                    data-bs-toggle="collapse"
                    to="#"
                  >
                    <i className="bi bi-intersect"></i>
                    <span>Dispensasi</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </Link>
                  <ul
                    id="dispensasi-nav"
                    className="nav-content collapse "
                    style={{
                      margin: "2px",
                      borderRadius: "5px 5px",
                    }}
                    data-bs-parent="#sidebar-nav"
                  >
                    <li>
                      <Link
                        as={Link}
                        to="v3/data/form/dispensasi"
                        onClick={() => handleSubmenuClick("data-dispensasi")}
                        className={` ${darkMode ? "text-white" : ""} ${
                          activeSubmenu === "data-dispensasi" ? "active" : ""
                        }`}
                      >
                        <i className="bi bi-circle"></i>
                        <span className="submenu">LLAT</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        as={Link}
                        to="v3/data/form/dispensasi/kppn"
                        onClick={() =>
                          handleSubmenuClick("data-dispensasi/kppn")
                        }
                        className={` ${darkMode ? "text-white" : ""} ${
                          activeSubmenu === "data-dispensasi/kppn"
                            ? "active"
                            : ""
                        }`}
                      >
                        <i className="bi bi-circle"></i>
                        <span className="submenu">Kontrak KPPN</span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
              {role !== "3" && (
                <li className="nav-item">
                  <Link
                    className="nav-link collapsed"
                    data-bs-target="#sp2d-nav"
                    data-bs-toggle="collapse"
                    to="#"
                  >
                    <i className="bi bi-diagram-3-fill"></i>
                    <span>Rowset Data </span>
                    {/* <span className="badge bg-danger mx-2">NEW</span> */}
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </Link>
                  {(role === "0" ||
                    role === "1" ||
                    role === "X" ||
                    role === "2") && (
                    <ul
                      id="sp2d-nav"
                      className="nav-content collapse "
                      style={{
                        margin: "2px",
                        borderRadius: "5px 5px",
                      }}
                      data-bs-parent="#sidebar-nav"
                    >
                      <>
                        <li>
                          <Link
                            as={Link}
                            to="/v3/rowset/form/referensi"
                            onClick={() => handleSubmenuClick("data-referensi")}
                            className={` ${darkMode ? "text-white" : ""} ${
                              activeSubmenu === "data-referensi" ? "active" : ""
                            }`}
                          >
                            <i className="bi bi-circle"></i>
                            <span className="submenu">Generate</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            as={Link}
                            to="/v3/rowset/form/sp2d"
                            onClick={() => handleSubmenuClick("data-sp2d")}
                            className={` ${darkMode ? "text-white" : ""} ${
                              activeSubmenu === "data-sp2d" ? "active" : ""
                            }`}
                          >
                            <i className="bi bi-circle"></i>
                            <span className="submenu">SP2D</span>
                          </Link>
                        </li>

                        <li>
                          <Link
                            as={Link}
                            to="/v3/rowset/"
                            onClick={() => handleSubmenuClick("data-subsidi")}
                            className={` ${darkMode ? "text-white" : ""} ${
                              activeSubmenu === "data-subsidi" ? "active" : ""
                            }`}
                          >
                            <i className="bi bi-circle"></i>
                            <span className="submenu">Dataset</span>
                          </Link>
                        </li>

                        <li>
                          <Link
                            as={Link}
                            to="/v3/track/nadine"
                            onClick={() => handleSubmenuClick("data-nadine")}
                            className={` ${darkMode ? "text-white" : ""} ${
                              activeSubmenu === "data-nadine" ? "active" : ""
                            }`}
                          >
                            {" "}
                            <i className="bi bi-circle"></i>
                            <span className="submenu">Track Nadine</span>
                          </Link>
                        </li>
                      </>
                    </ul>
                  )}
                </li>
              )}
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link collapsed"
                    data-bs-target="#tkd-nav"
                    data-bs-toggle="collapse"
                    to="#"
                  >
                    <i className="bi bi-bar-chart-line-fill"></i>
                    <span>Transfer Daerah</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </Link>
                  <ul
                    id="tkd-nav"
                    className="nav-content collapse "
                    style={{
                      margin: "2px",
                      borderRadius: "5px 5px",
                    }}
                    data-bs-parent="#sidebar-nav"
                  >
                    <li>
                      <Link
                        to="v3/tkd/dau/kmk"
                        onClick={() => handleSubmenuClick("data-dau")}
                        className={` ${darkMode ? "text-white" : ""} ${
                          activeSubmenu === "data-dau" ? "active" : ""
                        }`}
                      >
                        <i className="bi bi-circle"></i>
                        <span className="submenu">DAU 2024</span>
                      </Link>
                    </li>{" "}
                    <li>
                      <Link
                        to="v3/tkd/dau/kmk/2025"
                        onClick={() => handleSubmenuClick("data-dau25")}
                        className={` ${darkMode ? "text-white" : ""} ${
                          activeSubmenu === "data-dau25" ? "active" : ""
                        }`}
                      >
                        <i className="bi bi-circle"></i>
                        <span className="submenu">DAU 2025</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="v3/tkd/kppn/upload"
                        onClick={() => handleSubmenuClick("data-upload")}
                        className={` ${darkMode ? "text-white" : ""} ${
                          activeSubmenu === "data-upload" ? "active" : ""
                        }`}
                      >
                        <i className="bi bi-circle"></i>
                        <span className="submenu">Upload Laporan</span>
                      </Link>
                    </li>
                    {role !== "2" && (
                      <li>
                        <Link
                          to="v3/tkd/kppn/proyeksi"
                          onClick={() => handleSubmenuClick("data-proyeksi")}
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "data-proyeksi" ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu">Proyeksi TKD</span>
                        </Link>
                      </li>
                    )}
                    {(role === "0" || role === "1" || role === "X") && (
                      <li>
                        <Link
                          to="v3/tkd/iku/penilaian"
                          onClick={() => handleSubmenuClick("data-penilaian")}
                          className={` ${darkMode ? "text-white" : ""} ${
                            activeSubmenu === "data-penilaian" ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-circle"></i>
                          <span className="submenu">Penilaian IKU</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>
              </>
              <li className="nav-item">
                <Link
                  className="nav-link collapsed"
                  data-bs-target="#tentang-nav"
                  data-bs-toggle="collapse"
                  to="#"
                >
                  <i className="bi bi-circle-square"></i>
                  <span>Tentang</span>
                  <i className="bi bi-chevron-down ms-auto"></i>
                </Link>
                <ul
                  id="tentang-nav"
                  className="nav-content collapse"
                  style={{
                    margin: "2px",
                    borderRadius: "5px 5px",
                  }}
                  data-bs-parent="#sidebar-nav"
                >
                  {/* {username === "yacob" && (
                    <li>
                      <Link
                        as={Link}
                        to="v3/ai/chat/"
                        onClick={() => handleSubmenuClick("data-chat")}
                        className={` ${darkMode ? "text-white" : ""} ${
                          activeSubmenu === "data-chat" ? "active" : ""
                        }`}
                      >
                        <i className="bi bi-circle"></i>
                        <span className="submenu">Chat</span>
                      </Link>
                    </li>
                  )} */}
                  <li>
                    <Link
                      as={Link}
                      to="v3/about/team/"
                      onClick={() => handleSubmenuClick("data-team")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-team" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Team</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={Link}
                      to="v3/about/changelog/"
                      onClick={() => handleSubmenuClick("data-change")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-change" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Change Log</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      as={Link}
                      to="v3/about/developer/beta"
                      onClick={() => handleSubmenuClick("data-dev")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-dev" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Developer</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={Link}
                      to="v3/about/feedback"
                      onClick={() => handleSubmenuClick("data-feedback")}
                      className={` ${darkMode ? "text-white" : ""} ${
                        activeSubmenu === "data-feedback" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-circle"></i>
                      <span className="submenu">Feedback</span>
                    </Link>
                  </li>
                </ul>
              </li>{" "}
              <div className="d-flex justify-content-center my-2 mx-2">
                <li
                  className="nav-item"
                  style={{
                    position: "absolute",
                    bottom: "48px",
                    textAlign: "center",
                    background: darkMode ? "#333" : "#FBF8EC", // Ganti latar belakang tergantung pada darkMode
                    color: darkMode ? "white" : "black", // Ganti warna font tergantung pada darkMode
                    border: darkMode ? "1px solid white" : "none", // Tambahkan border saat darkMode aktif
                    borderRadius: darkMode ? "10px" : "0", // Tambahkan radius saat darkMode aktif
                    padding: "10px",
                    width: "100%",
                  }}
                >
                  {daysInIndonesian[currentDateTime.getDay()]},{" "}
                  {currentDateTime.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                </li>
              </div>
                </>
              )}
            </ul>
          </aside>
        </>
      )}
      <Outlet />
    </>
  );
}
