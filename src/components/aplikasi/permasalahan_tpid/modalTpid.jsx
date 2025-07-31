import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import NotifikasiSukses from "../notifikasi/notifsukses";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";

export default function Rekam({
  show,
  onHide,
  id,
  jenis,
  pilihan,
  keteranganpilih,
  rekomendasipilih,
  onSaveSuccess,
}) {
  const [selectedClusters, setSelectedClusters] = useState("");
  const [clusterOptions, setClusterOptions] = useState("");
  const [keterangan, setKeterangan] = useState(keteranganpilih || ""); // Initialize keterangan3
  const [rekomendasi, setRekomendasi] = useState(rekomendasipilih || ""); // Initialize rekomendasi3
  const [tema, setTema] = useState("");
  const [error, setError] = useState("");
  const { axiosJWT, token, kdkanwil } = useContext(MyContext);

  useEffect(() => {
    const clusters = [pilihan].filter(Boolean);
  }, [id, jenis]);

  const handleClusterChange = (event) => {
    setError("");
    const value = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedClusters([...selectedClusters, value]);
    } else {
      setSelectedClusters(selectedClusters.filter((id) => id !== value));
    }
  };

  useEffect(() => {
    setKeterangan(keteranganpilih);
    if (jenis === "1") {
      setTema("Tantangan Penganggaran K/L");
    } else if (jenis === "2") {
      setTema("Tantangan Pengadaan Barang Dan Jasa K/L");
    } else if (jenis === "3") {
      setTema("Tantangan Eksekusi Kegiatan K/L");
    } else if (jenis === "4") {
      setTema("Tantangan Regulasi Dalam Pelaksanaan Anggaran K/L");
    } else if (jenis === "5") {
      setTema("Tantangan SDM K/L");
    } else if (jenis === "6") {
      setTema("Tantangan Lainnya K/L");
    }
  }, [id, jenis]);

  useEffect(() => {
    setRekomendasi(rekomendasipilih);
    if (jenis === "7") {
      setTema("Tantangan Penganggaran TKD");
    } else if (jenis === "8") {
      setTema("Tantangan Pengadaan Barang Dan Jasa TKD");
    } else if (jenis === "9") {
      setTema("Tantangan Eksekusi Kegiatan TKD");
    } else if (jenis === "10") {
      setTema("Tantangan Regulasi Dalam Pelaksanaan Anggaran TKD");
    } else if (jenis === "11") {
      setTema("Tantangan SDM TKD");
    } else if (jenis === "12") {
      setTema("Tantangan Lainnya TKD");
    }
  }, [id, jenis]);

  const handleKeteranganChange = (event) => {
    setKeterangan(event.target.value);
  };
  const handleRekomendasiChange = (event) => {
    setRekomendasi(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_PERMASALAHANTPID,
        { id, jenis, keterangan, rekomendasi },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      NotifikasiSukses("Data Berhasil Disimpan");
      onSaveSuccess(keterangan, rekomendasi);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
        "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };
  // console.log(rekomendasipilih);
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      size="xl"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>
          <i className="bi bi-chat-text-fill text-success mx-3"></i>
          Clustering {tema}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center text-danger mb-3 mt-1">{error}</div>
        <Form onSubmit={handleSubmit}>
          {clusterOptions && (
            <div>
              {clusterOptions.map((option, index) => (
                <div key={option.id} className="mt-2">
                  <Form.Check
                    type="checkbox"
                    label={option.label}
                    value={option.id}
                    onChange={handleClusterChange}
                    checked={selectedClusters.includes(option.id)}
                  />
                  {index < clusterOptions.length - 1 && (
                    <hr style={{ margin: "5px 0" }} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="mt-4">
              <h5>Keterangan:</h5>
            </label>
            <Form.Control
              as="textarea"
              placeholder="Isikan keterangan tantangan/kendala tpid"
              value={keterangan}
              onChange={handleKeteranganChange}
              style={{ height: "100px" }}
              required
            />
          </div>
          <div>
            <label className="mt-4">
              <h5>Rekomendasi:</h5>
            </label>
            <Form.Control
              as="textarea"
              placeholder="Isikan rekomendasi tantangan/kendala tpid"
              value={rekomendasi}
              onChange={handleRekomendasiChange}
              style={{ height: "100px" }}
              required
            />
          </div>
          <div className="mt-4 d-flex justify-content-end">
            <Button variant="danger" type="submit">
              Simpan
            </Button>
            &nbsp;
            <Button variant="secondary" onClick={onHide}>
              Tutup
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
