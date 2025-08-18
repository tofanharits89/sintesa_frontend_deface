import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import UpdateDataMbg from "./updateMBG";
import TarikDataBGN from "./tarikDataBGN";
import { FaDatabase, FaSearch, FaChartBar } from "react-icons/fa"; // Ikon yang relevan

const TabDataMbg = () => {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Dataset MBG </h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">&nbsp;</a>
            </li>
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

        <Tabs defaultActiveKey="mbgData" id="mbg-tabs" className="mb-3">
          <Tab
            eventKey="mbgData"
            title={
              <>
                <FaDatabase className="me-2" />
                Update Data
              </>
            }
          >
            <UpdateDataMbg />
          </Tab>
          <Tab
            eventKey="tarikDataBGN"
            title={
              <>
                <FaSearch className="me-2" />
                Tarik Data BGN
              </>
            }
          >
            <TarikDataBGN />
          </Tab>

          {/* <Tab
            eventKey="Inquiry"
            title={
              <>
                <FaSearch className="me-2" />
                Inquiry
              </>
            }
          >
            <div>Konten tab Inquiry di sini</div>
          </Tab>

          <Tab
            eventKey="Statistik"
            title={
              <>
                <FaChartBar className="me-2" />
                Statistik dan Harga
              </>
            }
          >
            <div>Konten tab Statistik dan Harga di sini</div>
          </Tab> */}
        </Tabs>
      </section>
    </main>
  );
};

export default TabDataMbg;
