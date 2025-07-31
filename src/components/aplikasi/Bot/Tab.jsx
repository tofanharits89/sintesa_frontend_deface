import React, { useState } from "react";
import { Tabs, Tab, Container, Row, Col, Table } from "react-bootstrap";
import LandingBot from "./landing";
import LandingPin from "./landingPin";
import UmpanBalik from "../ai/UmpanBalik";
import RekamAPI from "../ai/rekamAPI";

const TabChat = () => {
  const [key, setKey] = useState("home");

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>AI Center</h1>
        </div>

        <Container fluid>
          <Row>
            <Col>
              <Tabs
                id="tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="home" title="ChatBOT">
                  <div className="p-1 my-2">
                    <h2>Inbox dan Pesan Balasan dari System</h2>
                    <p>
                      Pesan dari User melalui WhatsApp di Server 138, termasuk
                      pesan balasan untuk AI dan pesan otomatis saat user login
                      menggunakan PIN.
                    </p>
                  </div>
                  <LandingBot />
                </Tab>
                <Tab eventKey="profile" title="OTP">
                  <div className="p-1">
                    <h2>
                      OTP dikirim melalui server 138 dan digenerate otomatis
                      dengan format 4 angka integer
                    </h2>
                    <p>
                      Pengiriman angka OTP saat diminta. OTP berlaku sampai 1
                      menit/ 1000 ms sebelum expired sejak createdAt.
                    </p>
                  </div>

                  {key === "profile" && <LandingPin />}
                </Tab>
                <Tab eventKey="contact" title="Status">
                  <ul>
                    <li>
                      Vectara
                      <div className="p-1">
                        <h2>Status</h2>
                        <p>OK</p>
                      </div>
                    </li>
                    <li>
                      GROQ
                      <div className="p-1">
                        <h2>Status</h2>
                        <p>OK</p>
                      </div>
                    </li>
                    <li>
                      OpenAI
                      <div className="p-1">
                        <h2>Status</h2>
                        <p>OK</p>
                      </div>
                    </li>
                    <li>
                      Flowise
                      <div className="p-1">
                        <h2>Status</h2>
                        <p>OK</p>
                      </div>
                    </li>
                  </ul>
                </Tab>
                <Tab eventKey="umpanbalik" title="Aisiteru">
                  <div className="p-1">
                    {key === "umpanbalik" && <UmpanBalik />}
                  </div>
                </Tab>
                <Tab eventKey="rekamAPI" title="API Key">
                  <div className="p-1">
                    {key === "rekamAPI" && <RekamAPI />}
                  </div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default TabChat;
