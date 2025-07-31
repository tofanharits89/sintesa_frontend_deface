import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Kddept from "../../../data/Kddept.json";
import Kdkanwil from "../../../data/Kdkanwil.json";
import Kdkppn from "../../../data/Kdkppn.json";
import MyContext from "../../../auth/Context";

const FilterData = ({ show, onHide, onFilter }) => {
  const { role, kdkanwil, kdkppn } = useContext(MyContext);
  // const [selectedDispensasi, setSelectedDispensasi] = useState("00");
  const [selectedKementerian, setSelectedKementerian] = useState("00");
  const [selectedKanwil, setSelectedKanwil] = useState("00");
  const [selectedKppn, setSelectedKppn] = useState("00");
  // const [selectedStatus, setSelectedStatus] = useState("00");
  const [tahun, setTahun] = useState("");

  const handleClose = () => {
    onHide();
  };

  const handleFilter = () => {
    const filterData = {
      // selectedDispensasi,
      selectedKementerian,
      selectedKanwil,
      selectedKppn,
      // selectedStatus,
      tahun,
    };

    // Mengirim hasil filter ke komponen induk
    onFilter(filterData);

    onHide();
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setTahun(currentYear);
  }, []);

  const handleTahunChange = (event) => {
    const selectedTahun = event.target.value;
    setTahun(selectedTahun);
  };

  const resetFilter = () => {
    // setSelectedDispensasi("00");
    setSelectedKementerian("00");
    setSelectedKanwil("00");
    setSelectedKppn("00");
    // setSelectedStatus("00");

    const filterData = {
      // selectedDispensasi: "00",
      selectedKementerian: "00",
      selectedKanwil: "00",
      selectedKppn: "00",
      // selectedStatus: "00",
      tahun: "",
    };

    // Mengirim hasil filter yang direset ke komponen induk
    onFilter(filterData);

    onHide();
  };
  const kanwilOptions = Kdkanwil.filter((kanwil) =>
    role === "2" ? kanwil.kdkanwil === kdkanwil : true
  ).map((kdkanwil, index) => (
    <option key={index} value={kdkanwil.kdkanwil}>
      {kdkanwil.kdkanwil} - {kdkanwil.nmkanwil}
    </option>
  ));
  const kppnOptions = Kdkppn.filter((kppn) =>
    role === "3" ? kppn.kdkppn === kdkppn : true
  ).map((kdkppn, index) => (
    <option key={index} value={kdkppn.kdkppn}>
      {kdkppn.kdkppn} - {kdkppn.nmkppn}
    </option>
  ));

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        size="xl"
        backdrop="static"
        keyboard={false}
      //centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "17px" }}>
            <i className="bi bi-grid-3x3-gap-fill text-primary fw-bold mx-2 "></i>
            Filter Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Col sm={6} md={6} lg={4} xl={4}>
                  <Form.Label className="w-auto text-dark">Tahun</Form.Label>
                </Col>
                <Col sm={6} md={6} lg={8} xl={8}>
                  <select
                    className="form-select"
                    value={tahun}
                    as="select"
                    onChange={(e) => {
                      handleTahunChange(e);
                    }}
                  >
                    <option value="">Semua Tahun</option>
                    <option value="2023">TA 2023</option>
                    <option value="2024">TA 2024</option>
                    <option value="2025">TA 2025</option>
                  </select>
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Col sm={6} md={6} lg={4} xl={4}>
                  <Form.Label className="w-auto text-dark">
                    Kementerian
                  </Form.Label>
                </Col>
                <Col sm={6} md={6} lg={8} xl={8}>
                  <select
                    className="form-select"
                    value={selectedKementerian}
                    onChange={(e) => setSelectedKementerian(e.target.value)}
                  >
                    <option value="00">Semua Kementerian</option>
                    {Kddept.map((dept, index) => (
                      <option key={index} value={dept.kddept}>
                        {dept.kddept} - {dept.nmdept}
                      </option>
                    ))}
                  </select>
                </Col>
              </Form.Group>
            </Row>
            {role !== "3" && (
              <Row>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Col sm={6} md={6} lg={4} xl={4}>
                    <Form.Label className="w-auto text-dark">Kanwil</Form.Label>
                  </Col>
                  <Col sm={6} md={6} lg={8} xl={8}>
                    <select
                      className="form-select"
                      value={selectedKanwil}
                      onChange={(e) => setSelectedKanwil(e.target.value)}
                    >
                      {role !== "2" && <option value="00">Semua Kanwil</option>}
                      {kanwilOptions}
                    </select>
                  </Col>
                </Form.Group>
              </Row>
            )}
            {role === "3" && (
              <Row>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Col sm={6} md={6} lg={4} xl={4}>
                    <Form.Label className="w-auto text-dark">Kppn</Form.Label>
                  </Col>
                  <Col sm={6} md={6} lg={8} xl={8}>
                    <select
                      className="form-select"
                      value={selectedKppn}
                      onChange={(e) => setSelectedKppn(e.target.value)}
                    >
                      {role !== "3" && <option value="00">Semua KPPN</option>}
                      {kppnOptions}
                    </select>
                  </Col>
                </Form.Group>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" size="sm" onClick={handleFilter}>
            Terapkan Filter
          </Button>
          <Button variant="secondary" size="sm" onClick={resetFilter}>
            Reset Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FilterData;
