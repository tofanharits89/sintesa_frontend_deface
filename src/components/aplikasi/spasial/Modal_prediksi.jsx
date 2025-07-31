import React, { useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";

export default function Modal_prediksi() {
  const [show, setShow] = useState(true);
  const [provinsi, setProvinsi] = useState("");
  const [real_perlinsos, setReal_perlinsos] = useState(0);
  const [pertumbuhan_pdrb, setPertumbuhan_pdrb] = useState(0);
  const [rata2_lama_sekolah, setRata2_lama_sekolah] = useState(0);
  const [harapan_lama_sekolah, setHarapan_lama_sekolah] = useState(0);
  const [ipm, setIpm] = useState(0);
  const [tenaga_kerja_formal, setTenaga_kerja_formal] = useState(0);
  const [tk_informal_pertanian, setTk_informal_pertanian] = useState(0);
  const [tingkat_pengangguran, setTingkat_pengangguran] = useState(0);
  const [rasio_penggunaan_gas_rt, setRasio_penggunaan_gas_rt] = useState(0);
  const [sumber_penerangan_listrik, setSumber_penerangan_listrik] = useState(0);
  const [prediksiTingkatKemiskinan, setPrediksiTingkatKemiskinan] =
    useState(null); // Sesuai nama key dari backend
  const [loading, setLoading] = useState(false);
  const [showEvaluationImage, setShowEvaluationImage] = useState(false); // State baru untuk kontrol gambar

  // const handleClose = () => setShow(false);
  const handleClose = () => {
    setShow(false);
    setShowEvaluationImage(true); // Tampilkan gambar setelah modal ditutup
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputData = {
      real_perlinsos: Number(real_perlinsos),
      pertumbuhan_pdrb: Number(pertumbuhan_pdrb),
      rata2_lama_sekolah: Number(rata2_lama_sekolah),
      harapan_lama_sekolah: Number(harapan_lama_sekolah),
      ipm: Number(ipm),
      tenaga_kerja_formal: Number(tenaga_kerja_formal),
      tk_informal_pertanian: Number(tk_informal_pertanian),
      tingkat_pengangguran: Number(tingkat_pengangguran),
      rasio_penggunaan_gas_rt: Number(rasio_penggunaan_gas_rt),
      sumber_penerangan_listrik: Number(sumber_penerangan_listrik),
    };
    console.log("Sending data to backend: ", inputData);

    try {
      const response = await fetch(
        "https://sintesa.kemenkeu.go.id:5000/api/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPrediksiTingkatKemiskinan(data.prediksi_tingkat_kemiskinan); // Ambil hasil prediksi dari backend
      } else {
        console.error("Error in prediction response");
      }
    } catch (error) {
      console.error("Error during prediction", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Prediksi Tingkat Kemiskinan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Form fields */}
            <Row>
              <Col md={6}>
                <Form.Group controlId="formReal_perlinsos">
                  <Form.Label>Nilai Realisasi</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan Nilai Realisasi"
                    value={real_perlinsos}
                    onChange={(e) => setReal_perlinsos(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formIpm">
                  <Form.Label>Nilai IPM</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan Nilai IPM"
                    value={ipm}
                    onChange={(e) => setIpm(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPertumbuhan_pdrb">
                  <Form.Label>
                    Persentase Pertumbuhan PDRB (dalam decimal)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan % Pertumbuhan PDRB dalam bentuk decimal"
                    value={pertumbuhan_pdrb}
                    onChange={(e) => setPertumbuhan_pdrb(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formRata2_lama_sekolah">
                  <Form.Label>Rata-rata Lama Sekolah</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan Nilai Rata-rata Lama Sekolah"
                    value={rata2_lama_sekolah}
                    onChange={(e) => setRata2_lama_sekolah(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formHarapan_lama_sekolah">
                  <Form.Label>Harapan Lama Sekolah</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan Nilai Harapan Lama Sekolah"
                    value={harapan_lama_sekolah}
                    onChange={(e) => setHarapan_lama_sekolah(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTenaga_kerja_formal">
                  <Form.Label>
                    Persentase Tenaga Kerja Formal (dalam decimal)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan % Tenaga Kerja Formal dalam bentuk decimal"
                    value={tenaga_kerja_formal}
                    onChange={(e) => setTenaga_kerja_formal(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formTk_informal_pertanian">
                  <Form.Label>
                    Persentase Tenaga Kerja Informal Pertanian (dalam decimal)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan % Tenaga Kerja Informal Pertanian dalam bentuk decimal"
                    value={tk_informal_pertanian}
                    onChange={(e) => setTk_informal_pertanian(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTingkat_pengangguran">
                  <Form.Label>
                    Persentase Tingkat Pengangguran (dalam decimal)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan % Tingkat Pengangguran dalam bentuk decimal"
                    value={tingkat_pengangguran}
                    onChange={(e) => setTingkat_pengangguran(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formRasio_penggunaan_gas_rt">
                  <Form.Label>Rasio Penggunaan Gas Rumah Tangga</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan Nilai Rasio Penggunaan Gas RT"
                    value={rasio_penggunaan_gas_rt}
                    onChange={(e) => setRasio_penggunaan_gas_rt(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formSumber_penerangan_listrik">
                  <Form.Label>
                    Persentase Sumber Penerangan Listrik (dalam decimal)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan % Sumber Penerangan Listrik dalam bentuk decimal"
                    value={sumber_penerangan_listrik}
                    onChange={(e) =>
                      setSumber_penerangan_listrik(e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              disabled={loading}
            >
              {loading ? "Proses..." : "Proses"}
            </Button>
          </Form>

          {/* Menampilkan hasil prediksi jika ada */}
          {prediksiTingkatKemiskinan !== null && (
            <div className="mt-4">
              <h5>Hasil Prediksi Tingkat Kemiskinan:</h5>
              <p>{(prediksiTingkatKemiskinan * 100).toFixed(4)}%</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Gambar evaluasi muncul setelah modal ditutup */}
      {showEvaluationImage && (
        <div className="text-center mt-4">
          <h5>Evaluasi Model Gradient Boosting</h5>
          <img
            src="/foto/model_evaluation_2.PNG" // Sesuaikan path gambar sesuai dengan lokasi file
            alt="Evaluasi Model"
            className="img-fluid"
            style={{ maxWidth: "100%", height: "auto" }} // Atur ukuran sesuai kebutuhan
          />
        </div>
      )}
    </>
  );
}
