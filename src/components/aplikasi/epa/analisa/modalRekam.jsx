import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import KdProgramEpa from "./KdProgram";
import KdRoEpa from "./KdRo";
import Point from "./KdPoint";
import { TabAnalisaRekam } from "./Tab/landingTab";
import SubPoint from "./KdSubPoint";
import { EPANOTIF } from "../../notifikasi/Omspan";
import { handleHttpError } from "../../notifikasi/toastError";
import "./modalRekam.css"; // Tambahkan file CSS untuk styling

const CustomModal = ({ show, onHide, title, onDataUpdate }) => {
  const { dataEpa, token, axiosJWT } = useContext(MyContext);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedPoint, setSelectedPoint] = useState("");
  const [selectedSubPoint, setSelectedSubPoint] = useState("");
  const [selectedRo, setSelectedRo] = useState("");
  const [errors, setErrors] = useState({}); // Default kosong

  const [tabData, setTabData] = useState({
    tab1: { kategori: [] },
    tab2: { kriteria: "", nilai: "" },
    tab3: { rencanaAksi: "", deadline: "" },
    tab4: { status: "", approval: "" },
  });

  // Reset state setiap modal ditutup
  useEffect(() => {
    if (!show) {
      resetState();
    }
  }, [show]);

  const resetState = () => {
    setSelectedProgram("");
    setSelectedPoint("");
    setSelectedSubPoint("");
    setSelectedRo("");
    setErrors({});
    setTabData({
      tab1: { kategori: [] },
      tab2: { kriteria: "", nilai: "" },
      tab3: { rencanaAksi: "", deadline: "" },
      tab4: { status: "", approval: "" },
    });
  };

  // Validasi setiap kali input berubah
  const handleInputChange = (field, value) => {
    if (field === "point") setSelectedPoint(value);
    if (field === "subpoint") setSelectedSubPoint(value);
    if (field === "program") setSelectedProgram(value);
    if (field === "ro") setSelectedRo(value);

    // Jika diisi, hapus error
    setErrors((prev) => ({ ...prev, [field]: value ? false : true }));
  };
  // console.log(tabData);


  // Validasi semua tab dan input utama
  const validateForm = () => {
    let newErrors = {};
    if (!selectedPoint) newErrors.point = true;
    if (!selectedSubPoint) newErrors.subpoint = true;
    if (!selectedProgram) newErrors.program = true;
    if (!selectedRo) newErrors.ro = true;
    setErrors(newErrors);
    // Validasi tab
    const tab1Valid = tabData.tab1 && Array.isArray(tabData.tab1.kategori) && tabData.tab1.kategori.length > 0;
    const tab2Valid = tabData.tab2 && tabData.tab2.Urgency && tabData.tab2.Seriousness && tabData.tab2.Growth;
    const tab3Valid = tabData.tab3 && tabData.tab3.rencanaAksi && tabData.tab3.deadline;
    const tab4Valid = tabData.tab4 && tabData.tab4.status !== undefined && tabData.tab4.status !== "" && tabData.tab4.approval;
    return (
      Object.keys(newErrors).length === 0 &&
      tab1Valid &&
      tab2Valid &&
      tab3Valid &&
      tab4Valid
    );
  };

  // Untuk disabled state pada tombol Simpan
  const isSaveDisabled = () => {
    let newErrors = {};
    if (!selectedPoint) newErrors.point = true;
    if (!selectedSubPoint) newErrors.subpoint = true;
    if (!selectedProgram) newErrors.program = true;
    if (!selectedRo) newErrors.ro = true;
    // Validasi tab
    const tab1Valid = tabData.tab1 && Array.isArray(tabData.tab1.kategori) && tabData.tab1.kategori.length > 0;
    const tab2Valid = tabData.tab2 && tabData.tab2.Urgency && tabData.tab2.Seriousness && tabData.tab2.Growth;
    const tab3Valid = tabData.tab3 && tabData.tab3.rencanaAksi && tabData.tab3.deadline;
    const tab4Valid = tabData.tab4 && tabData.tab4.status !== undefined && tabData.tab4.status !== "" && tabData.tab4.approval;
    return (
      Object.keys(newErrors).length > 0 ||
      !tab1Valid ||
      !tab2Valid ||
      !tab3Valid ||
      !tab4Valid
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANUBAH_ANALISAEPA,
        {
          dataEpa,
          selectedProgram,
          selectedPoint,
          selectedSubPoint,
          selectedRo,
          tabData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      EPANOTIF("Data Berhasil Disimpan");
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
              <div className="d-flex flex-wrap gap-2 my-2 fade-in">
                {[
                  { key: "year", label: " Tahun" },
                  { key: "period", label: " Periode" },
                  { key: "nmdept", label: "K/L" },
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant="success"
                    className="text-white"
                    size="sm"
                  >
                    {`${label} : ${dataEpa[key]}`}
                  </Button>
                ))}
              </div>
            </Col>

            <Col md={12} className="mt-4">
              <div
                className={`input-container ${errors.point ? "error-border" : ""}`}
              >
                <Point
                  value={selectedPoint} // Kirim selectedPoint ke komponen
                  onChange={(value) => handleInputChange("point", value)}
                />
              </div>
            </Col>
            <Col md={12} className="mt-2">
              <div
                className={`input-container ${errors.subpoint ? "error-border" : ""}`}
              >
                <SubPoint
                  value={selectedSubPoint} // Kirim nilai dari state
                  point={selectedPoint} // Agar data subpoint sesuai dengan point terpilih
                  onChange={(value) => handleInputChange("subpoint", value)}
                />
              </div>
            </Col>
            <Col md={12} className="mt-2">
              <div
                className={`input-container ${errors.program ? "error-border" : ""}`}
              >
                <KdProgramEpa
                  value={selectedProgram} // Ambil nilai dari editData
                  point={selectedPoint} // Agar program sesuai dengan point terpilih
                  subpoint={selectedSubPoint} // Agar program sesuai dengan subpoint terpilih
                  onChange={(value) => handleInputChange("program", value)}
                />
              </div>
            </Col>
            <Col md={12} className="mt-2">
              <div
                className={`input-container ${errors.ro ? "error-border" : ""}`}
              >
                <KdRoEpa
                  value={selectedRo} // Ambil nilai dari editData
                  kdprogram={selectedProgram} // Agar RO sesuai dengan program terpilih
                  point={selectedPoint} // Agar RO sesuai dengan point terpilih
                  subpoint={selectedSubPoint} // Agar RO sesuai dengan subpoint terpilih
                  onChange={(value) => handleInputChange("ro", value)}
                />
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={12} className="mt-2">
              <TabAnalisaRekam
                onDataChange={(tabKey, data) =>
                  setTabData((prev) => ({ ...prev, [tabKey]: data }))
                }
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          size="md"
          onClick={handleSubmit}
          disabled={isSaveDisabled()}
        >
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
