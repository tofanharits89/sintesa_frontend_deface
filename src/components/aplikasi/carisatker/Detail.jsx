import React, { useContext, useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import InfoUmum from "./InfoUmum";
import TayangAdk from "./TayangAdk";
import MyContext from "../../../auth/Context";
import jsonData from "../../../data/Kdsatker.json";
import Notifikasi from "../notifikasi/notif";

const DetailSatker = () => {
  const { kdsatker } = useParams();
  const { role, kdkppn, kdlokasi } = useContext(MyContext);
  const navigate = useNavigate();
  const [cek, setCek] = useState(false);

  useEffect(() => {
    let filteredData = jsonData;

    if (role === "3") {
      filteredData = jsonData.filter((item) => item.kdkppn === kdkppn);
    } else if (role === "2") {
      filteredData = jsonData.filter((item) => item.kdlokasi === kdlokasi);
    }

    const isSatkerInFilteredData = filteredData.some(
      (item) => item.kdsatker === kdsatker
    );

    if (!isSatkerInFilteredData) {
      Notifikasi("Satker ini diluar kewenangan Anda");
      setTimeout(() => {
        navigate("/v3/about/feedback");
      }, 2000); // Redirect after 2 seconds
    }
  }, [kdsatker, role, kdkppn, kdlokasi, navigate]);

  const handleSelect = (key) => {
    setCek(true);
  };
  // console.log(cek);
  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle ">
          <h1>Informasi Satker</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Satker</a>
              </li>
              <li className="breadcrumb-item active">
                Informasi Detail Satker
              </li>
            </ol>
          </nav>
        </div>

        <section className="section profile">
          <div className="row">
            <div className="col-xl-12">
              <Tab.Container
                defaultActiveKey="info-umum"
                onSelect={handleSelect}
              >
                <div className="card">
                  <div className="card-body pt-3">
                    <Nav
                      variant="tabs"
                      className="nav-tabs-bordered"
                      role="tablist"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="info-umum">Informasi Umum</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="info-adk">ADK</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content className="pt-2">
                      <Tab.Pane eventKey="info-umum">
                        <InfoUmum kdsatker={kdsatker} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="info-adk">
                        <TayangAdk kdsatker={kdsatker} />
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </div>
              </Tab.Container>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DetailSatker;
