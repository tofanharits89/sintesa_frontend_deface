import React, { useContext, useState, useEffect } from "react";
import { Container, Tab, Tabs, Nav, Spinner } from "react-bootstrap";
import MyContext from "../../../auth/Context";
// import MonitoringKanwil from "../monitoringKanwil"; // Uncomment if needed
import Modal_prediksi from "./Modal_prediksi";

export default function Bansos_dash() {
  const { role } = useContext(MyContext);

  // Set the default tab to 'dash' to make Dashboard Bansos open by default
  const [activeTab, setActiveTab] = useState("dash");

  // useEffect to load Tableau when the tab is active
  useEffect(() => {
    if (activeTab === "dash") {
      const scriptElement = document.createElement("script");
      scriptElement.src =
        "https://public.tableau.com/javascripts/api/viz_v1.js";
      scriptElement.async = true;
      document.getElementById("vizContainer").appendChild(scriptElement);
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Dashboard dan Prediksi</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Dashboard (Status data per 13 Sept 2024)</a>
              </li>
              <li className="breadcrumb-item active">Prediksi</li>
            </ol>
          </nav>
        </div>
        <section className="section profile fade-in">
          <Tab.Container
            defaultActiveKey="dash" /* Set 'dash' as the default active tab */
            onSelect={(tab) => handleTabChange(tab)}
          >
            <Nav
              variant="tabs"
              className="nav-tabs-bordered sticky-user is-sticky-user mb-3 bg-white"
              role="tablist"
            >
              {role !== "3" && (
                <Nav.Item className="bansos_dash">
                  <Nav.Link eventKey="dash" role="tab">
                    Dashboard Bansos
                  </Nav.Link>
                </Nav.Item>
              )}
              {role !== "3" && (
                <Nav.Item>
                  <Nav.Link eventKey="pred" role="tab">
                    Prediksi Kemiskinan
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            <Tab.Content>
              {/* Tableau Dashboard Embed */}
              <Tab.Pane eventKey="dash" role="tabpanel">
                {activeTab === "dash" && (
                  <div
                    id="vizContainer"
                    style={{ width: "100%", height: "100vh" }}
                  >
                    <div
                      className="tableauPlaceholder"
                      id="viz1726476749570"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <noscript>
                        <a href="#">
                          <img
                            alt="Dashboard 1"
                            src="https://public.tableau.com/static/images/ba/bansos_pkh_dashboard/Dashboard1/1_rss.png"
                            style={{ border: "none" }}
                          />
                        </a>
                      </noscript>
                      <object
                        className="tableauViz"
                        style={{ width: "100%", height: "100%" }}
                      >
                        <param
                          name="host_url"
                          value="https%3A%2F%2Fpublic.tableau.com%2F"
                        />
                        <param name="embed_code_version" value="3" />
                        <param name="site_root" value="" />
                        <param
                          name="name"
                          value="bansos_pkh_dashboard/Dashboard1"
                        />
                        <param name="tabs" value="no" />
                        <param name="toolbar" value="yes" />
                        <param
                          name="static_image"
                          value="https://public.tableau.com/static/images/ba/bansos_pkh_dashboard/Dashboard1/1.png"
                        />
                        <param name="animate_transition" value="yes" />
                        <param name="display_static_image" value="yes" />
                        <param name="display_spinner" value="yes" />
                        <param name="display_overlay" value="yes" />
                        <param name="display_count" value="yes" />
                        <param name="language" value="en-US" />
                        <param name="filter" value="publish=yes" />
                      </object>
                    </div>
                  </div>
                )}
              </Tab.Pane>

              {/* Prediksi Tab */}
              <Tab.Pane eventKey="pred" role="tabpanel">
                {activeTab === "pred" && <Modal_prediksi />}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>
      </main>
    </div>
  );
}
