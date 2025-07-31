import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Kddept from "../../../data/Kddept.json";
import Kdkanwil from "../../../data/Kdkanwil.json";
import Kdmppnbp from "../../../data/Mp_pnbp.json";
import MyContext from "../../../auth/Context";

const FilterData = ({ show, onHide, onFilter }) => {
  const { role, kdkanwil } = useContext(MyContext);
  const [selectedKementerian, setSelectedKementerian] = useState("00");
  const [selectedKanwil, setSelectedKanwil] = useState("00");
  const [selectedJenisMp, setSelectedJenisMp] = useState("00");
  const [tahun, setTahun] = useState("");
  const [triwulan, setTriwulan] = useState("");

  const handleClose = () => {
    onHide();
  };

  const handleFilter = () => {
    const filterData = {
      selectedKementerian,
      selectedKanwil,
      selectedJenisMp,
      tahun,
      triwulan,
    };

    // Mengirim hasil filter ke komponen induk
    onFilter(filterData);

    onHide();
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setTahun("");
    // setTriwulan("1");
  }, []);

  const handleTahunChange = (event) => {
    const selectedTahun = event.target.value;
    setTahun(selectedTahun);
  };

  const handleTriwulanChange = (event) => {
    const selectedTriwulan = event.target.value;
    setTriwulan(selectedTriwulan);
  };

  const resetFilter = () => {
    setSelectedKementerian("00");
    setSelectedKanwil("00");
    setSelectedJenisMp("00");
    setTahun("");  // Mengatur kembali tahun ke "Semua Tahun"
    setTriwulan(""); // Mengatur kembali triwulan ke "Semua Triwulan"

    const filterData = {
      selectedKementerian: "00",
      selectedKanwil: "00",
      selectedJenisMp: "00",
      tahun: "",
      triwulan: "",
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
                    {/* <option value="2023">TA 2023</option>
                    <option value="2024">TA 2024</option> */}
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
                  <Form.Label className="w-auto text-dark">Triwulan</Form.Label>
                </Col>
                <Col sm={6} md={6} lg={8} xl={8}>
                  <select
                    className="form-select"
                    value={triwulan}
                    as="select"
                    onChange={(e) => {
                      handleTriwulanChange(e);
                    }}
                  >
                    <option value="">Semua Triwulan</option>
                    <option value="1">Triwulan I</option>
                    <option value="2">Triwulan II</option>
                    <option value="3">Triwulan III</option>
                    <option value="4">Triwulan IV</option>
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
            <Row>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Col sm={6} md={6} lg={4} xl={4}>
                  <Form.Label className="w-auto text-dark">
                    Jenis PNBP
                  </Form.Label>
                </Col>
                <Col sm={6} md={6} lg={8} xl={8}>
                  <select
                    className="form-select"
                    value={selectedJenisMp}
                    onChange={(e) => setSelectedJenisMp(e.target.value)}
                  >
                    <option value="00">Semua Jenis MP</option>
                    {Kdmppnbp.map((mp, index) => (
                      <option key={index} value={mp.kdmppnbp}>
                        {mp.nmmppnbp}
                      </option>
                    ))}
                  </select>
                </Col>
              </Form.Group>
            </Row>
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
