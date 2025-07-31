import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { Col, Row, Tab, Nav, Form, Button, Image } from "react-bootstrap";

import { Loading2 } from "../../layout/LoadingTable";
import { handleHttpError } from "../notifikasi/toastError";
import moment from "moment";
import MonevKanwil from "./monevKanwil";
import LkKppn from "./lkKppn";

export default function LandingIku() {
  const { role, nmrole, axiosJWT, token, iduser, setUrl } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [cek, setCek] = useState(false);
  const [dataerror, setError] = useState("");

  useEffect(() => {
    iduser && refreshUser();
  }, [iduser]);

  const handleCek = () => {
    setCek(true);
  };

  const refreshUser = async () => {
    setLoading(true);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_GETUSER
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_GETUSER}?id=${iduser}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setUrl(response.data.url);

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
    }
  };
  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Penilaian IKU TKD </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Analisa</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item ">Laporan</li>
            </ol>
          </nav>
        </div>
        <section className="section profile fade-in">
          <Row>
            <Col xl={12}>
              <div className="card">
                <div className="card-body pt-0 m-2 profile-user">
                  <Tab.Container defaultActiveKey="nilai_monev">
                    <Nav
                      variant="tabs"
                      className="nav-tabs-bordered sticky-user is-sticky-user mb-0"
                      role="tablist"
                    >
                      <Nav.Item className="iku">
                        <Nav.Link eventKey="nilai_monev" role="tab">
                          Nilai Monev Kanwil
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="iku">
                        <Nav.Link eventKey="nilai_lk" role="tab">
                          Nilai LK KPPN
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content className="pt-2">
                      <Tab.Pane eventKey="nilai_monev" role="tabpanel">
                        <MonevKanwil />
                      </Tab.Pane>

                      <Tab.Pane eventKey="nilai_lk" role="tabpanel">
                        <LkKppn />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </main>
    </div>
  );
}
