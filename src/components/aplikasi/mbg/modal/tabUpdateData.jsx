import { useState, useContext } from "react";
import { Tabs, Tab, Container, Alert, Card } from "react-bootstrap";
import UpdateOtomatis from "./updateDataOtomatis";
import { FiClock, FiRefreshCw } from "react-icons/fi";
import MyContext from "../../../../auth/Context";

export const TabUpdateMBG = () => {
  const [key, setKey] = useState("tab1");
  const { role } = useContext(MyContext);

  return (
    <Container className="mt-3">
      <Tabs
        id="controlled-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4 tab-custom justify-content-center"
        justify
      >
        <Tab
          eventKey="tab1"
          title={
            <>
              <FiClock />
              <span>Update Otomatis</span>
            </>
          }
        >
          <div className="tab-content-wrapper">
            <Alert className="alert-info-custom mt-4">
              <strong>Informasi:</strong> Update otomatis dijalankan setiap hari
              pada pukul <strong>07.00 WIB</strong>
              <strong> (weekday)</strong>.
            </Alert>
          </div>
        </Tab>

        {/* Only show Update Manual tab for role 'X' */}
        {role === "X" && (
          <Tab
            eventKey="tab2"
            title={
              <>
                <FiRefreshCw />
                <span>Update Manual</span>
              </>
            }
          >
            <div className="tab-content-wrapper">
              <UpdateOtomatis />
            </div>
          </Tab>
        )}
      </Tabs>
    </Container>
  );
};
