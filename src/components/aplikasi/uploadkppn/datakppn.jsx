import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import {
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
  Container,
  Card,
} from "react-bootstrap";

import { Loading2 } from "../../layout/LoadingTable";
import { handleHttpError } from "../notifikasi/toastError";
import moment from "moment";

import LkModal from "./LkModal";
import Monev from "./monev";
import ModalMonev from "./ModalMonev";
import MonevKanwil from "./monevkanwil";
import LaporanKeuangan from "./lk";
import LaporanKeuanganList from "./LaporanKeuanganList";
import LaporanMonevList from "./LaporanMonevList";

export default function DataKppn() {
  const { role, nmrole, axiosJWT, token, iduser, setUrl } =
    useContext(MyContext);

  // State untuk toggle antara komponen
  const [activeView, setActiveView] = useState("lk"); // "lk", "monev", "monevkanwil"
  const [showModalKanwil, setShowModalKanwil] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Set default view berdasarkan role
  useEffect(() => {
    if (role === "2") {
      setActiveView("monevkanwil");
    } else {
      setActiveView("lk");
    }
  }, [role]);

  const handleRekam = async () => {
    setShowModal(true);
  };

  const handleRekamMonevKanwil = async () => {
    setShowModalKanwil(true);
  };

  const handleCloseKanwil = () => {
    setShowModalKanwil(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const renderActiveComponent = () => {
    switch (activeView) {
      case "lk":
        return <LaporanKeuanganList key="lk-component" />;
      case "monev":
        return <LaporanMonevList key="monev-component" />;
      case "monevkanwil":
        return <MonevKanwil key="monevkanwil-component" cekMonev={true} />;
      default:
        return <LaporanKeuanganList key="default-component" />;
    }
  };

  const modernButtonStyle = {
    borderRadius: "12px",
    fontWeight: "600",
    textTransform: "none",
    border: "none",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    minHeight: "60px",
  };

  const getButtonVariant = (viewType) => {
    if (activeView === viewType) {
      switch (viewType) {
        case "lk":
          return {
            bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          };
        case "monev":
          return {
            bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
          };
        case "monevkanwil":
          return {
            bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
          };
        default:
          return { bg: "white", color: "#333" };
      }
    }
    return {
      bg: "rgba(255,255,255,0.9)",
      color: "#666",
      border: "2px solid #e0e0e0",
    };
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Laporan Transfer Daerah</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">TKD</a>
              </li>
              <li className="breadcrumb-item active">Upload</li>
            </ol>
          </nav>
        </div>

        <section className="section profile fade-in">
          {/* Upload Buttons */}
          <div className="d-flex justify-content-end mb-3">
            {role !== "2" && (
              <Button
                variant="primary"
                size="sm"
                className="me-2"
                onClick={handleRekam}
              >
                <i className="bi bi-cloud-upload-fill me-2"></i>
                Laporan KPPN
              </Button>
            )}
            {role !== "3" && (
              <Button
                variant="success"
                size="sm"
                onClick={handleRekamMonevKanwil}
              >
                <i className="bi bi-cloud-upload-fill me-2"></i>
                Laporan Kanwil
              </Button>
            )}
          </div>

          {/* Navigation Buttons */}
          <Row>
            <Col xl={12}>
              <div className="mb-4">
                <ButtonGroup className="w-100" size="sm">
                  {role !== "2" && (
                    <>
                      <Button
                        variant={
                          activeView === "lk" ? "primary" : "outline-primary"
                        }
                        onClick={() => setActiveView("lk")}
                        className="d-flex align-items-center justify-content-center py-1"
                      >
                        <i className="bi bi-stickies-fill me-2"></i>
                        Laporan Keuangan KPPN
                      </Button>
                      <Button
                        variant={
                          activeView === "monev" ? "success" : "outline-success"
                        }
                        onClick={() => setActiveView("monev")}
                        className="d-flex align-items-center justify-content-center py-1"
                      >
                        <i className="bi bi-front me-2"></i>
                        Laporan Monev KPPN
                      </Button>
                    </>
                  )}
                  {role !== "3" && (
                    <Button
                      variant={
                        activeView === "monevkanwil"
                          ? "warning"
                          : "outline-warning"
                      }
                      onClick={() => setActiveView("monevkanwil")}
                      className="d-flex align-items-center justify-content-center py-1"
                    >
                      <i className="bi bi-chat-right-text-fill me-2"></i>
                      Laporan Monev Kanwil
                    </Button>
                  )}
                </ButtonGroup>
              </div>

              {/* Render Active Component */}
              {renderActiveComponent()}
            </Col>
          </Row>

          {/* Modals */}
          {showModal && <LkModal show={showModal} onHide={handleClose} />}
          {showModalKanwil && (
            <ModalMonev show={showModalKanwil} onHide={handleCloseKanwil} />
          )}
        </section>
      </main>
    </div>
  );
}
