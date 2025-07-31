import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import {
  faChartBar,
  faCog,
  faClipboardList,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Tab1 from "./tab1";
import Tab2 from "./tab2";
import Tab3 from "./tab3";
import Tab4 from "./tab4";
import "./tab.css";

// Komponen untuk Rekam Data
export const TabAnalisaRekam = ({ onDataChange }) => {
  const [activeKey, setActiveKey] = useState("tab1");
  const [formData, setFormData] = useState({
    tab1: { kategori: [] },
    tab2: { urgency: "", seriousness: "", growth: "" },
    tab3: { rencanaAksi: "", deadline: "" },
    tab4: { status: "", approval: "" },
  });

  // Fungsi untuk menerima data dari masing-masing tab
  const handleDataChange = (tabKey, data) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [tabKey]: data };
      onDataChange(tabKey, data); // Kirim ke komponen induk
      return newFormData;
    });
  };

  return (
    <Container className="mt-0">
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        className="custom-tabs mb-3"
      >
        <Tab
          eventKey="tab1"
          title={
            <>
              <FontAwesomeIcon icon={faChartBar} /> Kategori
            </>
          }
        >
          <Tab1 onDataChange={(data) => handleDataChange("tab1", data)} />
        </Tab>
        <Tab
          eventKey="tab2"
          title={
            <>
              <FontAwesomeIcon icon={faClipboardList} /> Kriteria
            </>
          }
        >
          <Tab2 onDataChange={(data) => handleDataChange("tab2", data)} />
        </Tab>
        <Tab
          eventKey="tab3"
          title={
            <>
              <FontAwesomeIcon icon={faCog} /> Rencana Aksi
            </>
          }
        >
          <Tab3 onDataChange={(data) => handleDataChange("tab3", data)} />
        </Tab>
        <Tab
          eventKey="tab4"
          title={
            <>
              <FontAwesomeIcon icon={faFileAlt} /> Status
            </>
          }
        >
          <Tab4 onDataChange={(data) => handleDataChange("tab4", data)} />
        </Tab>
      </Tabs>
    </Container>
  );
};

// Komponen untuk Edit Data
export const TabAnalisaEdit = ({ onDataChange, editTabData }) => {
  const [activeKey, setActiveKey] = useState("tab1");
  const [formData, setFormData] = useState({
    tab1: { kategori: [] },
    tab2: { urgency: "", seriousness: "", growth: "" },
    tab3: { rencanaAksi: "", deadline: "" },
    tab4: { status: "", approval: "" },
  });

  useEffect(() => {
    if (editTabData) {
      setFormData(editTabData);
    }
  }, [editTabData]);

  const handleDataChange = (tabKey, data) => {
    const newFormData = { ...formData, [tabKey]: data };
    setFormData(newFormData);
    onDataChange(tabKey, data); // pastikan ini dipanggil
  };

  // console.log(editTabData);

  return (
    <Container className="mt-0">
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        className="custom-tabs mb-3"
      >
        <Tab
          eventKey="tab1"
          title={
            <>
              <FontAwesomeIcon icon={faChartBar} /> Kategori
            </>
          }
        >
          <Tab1
            value={formData.tab1.kategori}
            onDataChange={(data) => handleDataChange("tab1", data)}
          />
        </Tab>
        <Tab
          eventKey="tab2"
          title={
            <>
              <FontAwesomeIcon icon={faClipboardList} /> Kriteria
            </>
          }
        >
          <Tab2
            urgency={formData.tab2?.urgency || ""}
            seriousness={formData.tab2?.seriousness || ""}
            growth={formData.tab2?.growth || ""}
            onDataChange={(data) => handleDataChange("tab2", data)}
          />
        </Tab>
        <Tab
          eventKey="tab3"
          title={
            <>
              <FontAwesomeIcon icon={faCog} /> Rencana Aksi
            </>
          }
        >
          <Tab3
            value={formData.tab3}
            onDataChange={(data) => handleDataChange("tab3", data)}
          />
        </Tab>
        <Tab
          eventKey="tab4"
          title={
            <>
              <FontAwesomeIcon icon={faFileAlt} /> Status
            </>
          }
        >
          <Tab4
            value={formData.tab4}
            onDataChange={(data) => handleDataChange("tab4", data)}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};
