import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import KdProgramEpa from "./KdProgram";
import KdRoEpa from "./KdRo";
import Point from "./KdPoint";
import { TabAnalisaEdit } from "./Tab/landingTab";
import SubPoint from "./KdSubPoint";
import { EPANOTIF } from "../../notifikasi/Omspan";
import { handleHttpError } from "../../notifikasi/toastError";
import "./modalRekam.css";

const CustomModal = ({ show, onHide, title, onDataUpdate, editData }) => {
  const { dataEpa, token, axiosJWT } = useContext(MyContext);

  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedPoint, setSelectedPoint] = useState("");
  const [selectedSubPoint, setSelectedSubPoint] = useState("");
  const [selectedRo, setSelectedRo] = useState("");
  const [errors, setErrors] = useState({});

  const [tabData, setTabData] = useState({
    tab1: { kategori: [] },
    tab2: { urgency: "", seriousness: "", growth: "" },
    tab3: { rencanaAksi: "", deadline: "" },
    tab4: { status: "", approval: "" },
  });
  // console.log(tabData);

  useEffect(() => {
    if (show) {
      if (editData) {
        setSelectedProgram(editData.selectedProgram || "");
        setSelectedPoint(editData.selectedPoint || "");
        setSelectedSubPoint(editData.selectedSubPoint || "");
        setSelectedRo(editData.selectedRo || "");
        setTabData({
          tab1: { kategori: editData.kategori || [] },
          tab2: {
            urgency: editData.urgency || "",
            seriousness: editData.seriousness || "",
            growth: editData.growth || "",
          },

          tab3: {
            rencanaAksi: editData.rencanaAksi || "",
            deadline: editData.deadline || "",
          },
          tab4: {
            status: editData.status || "",
            approval: editData.approval || "",
          },
        });
      } else {
        resetState();
      }
    }
  }, [show, editData]);

  const resetState = () => {
    setSelectedProgram("");
    setSelectedPoint("");
    setSelectedSubPoint("");
    setSelectedRo("");
    setErrors({});
    setTabData({
      tab1: { kategori: [] },
      tab2: { urgency: "", seriousness: "", growth: "" },

      tab3: { rencanaAksi: "", deadline: "" },
      tab4: { status: "", approval: "" },
    });
  };

  const handleInputChange = (field, value) => {
    if (field === "point") setSelectedPoint(value);
    if (field === "subpoint") setSelectedSubPoint(value);
    if (field === "program") setSelectedProgram(value);
    if (field === "ro") setSelectedRo(value);
    setErrors((prev) => ({ ...prev, [field]: value ? false : true }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!selectedPoint) newErrors.point = true;
    if (!selectedSubPoint) newErrors.subpoint = true;
    if (!selectedProgram) newErrors.program = true;
    if (!selectedRo) newErrors.ro = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_UPDATEEPA,
        {
          dataEpa,
          selectedProgram,
          selectedPoint,
          selectedSubPoint,
          selectedRo,
          tabData,
          id: editData?.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      EPANOTIF("Data Berhasil Diubah");
      resetState();
      onDataUpdate();
      onHide();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      handleHttpError("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false}
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={12}>
              <Point
                onChange={(value) => handleInputChange("point", value)}
                value={selectedPoint}
              />
            </Col>
            <Col md={12} className="mt-2">
              <SubPoint
                onChange={(value) => handleInputChange("subpoint", value)}
                point={selectedPoint}
                value={selectedSubPoint}
              />
            </Col>
            <Col md={12} className="mt-2">
              <KdProgramEpa
                onChange={(value) => handleInputChange("program", value)}
                subpoint={selectedSubPoint}
                point={selectedPoint}
                value={selectedProgram}
              />
            </Col>
            <Col md={12} className="mt-2">
              <KdRoEpa
                onChange={(value) => handleInputChange("ro", value)}
                kdprogram={selectedProgram}
                subpoint={selectedSubPoint}
                point={selectedPoint}
                value={selectedRo}
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={12} className="mt-2">
              <TabAnalisaEdit
                onDataChange={(tabKey, data) =>
                  setTabData((prev) => ({ ...prev, [tabKey]: data }))
                }
                editTabData={tabData}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" size="md" onClick={handleSubmit}>
          Simpan
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            resetState();
            onHide();
          }}
        >
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
