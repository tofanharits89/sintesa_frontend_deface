import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import moment from "moment";
import MyContext from "../../../../auth/Context";
import GenerateExcelMBG from "../../CSV/generateExcellMBG";
import { Pesan } from "../../notifikasi/Omspan";

const DownloadData2 = ({ show, onClose }) => {
  const { axiosJWT, token, role } = useContext(MyContext);
  const [loadingExcellX, setloadingExcellX] = useState(false);
  const [error, setError] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");

  useEffect(() => {
    if (show) fetchTables();
  }, [show]);

  const fetchTables = async () => {
    try {
      const res = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_DOWNLOAD}?db=data_bgn_2025`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTables(res.data);
    } catch {
      setError("Gagal memuat daftar tabel dari database data_bgn_2025.");
    }
  };

  const handleGenerateExcel = () => setloadingExcellX(true);

  const handleDataFetchComplete = (total) => {
    Pesan(total > 0 ? `${total} data berhasil diexport` : "Tidak Ada Data");
    setloadingExcellX(false);
  };

  const generateQuery = (tableName) => {
    return `SELECT * FROM data_bgn_2025.${tableName}`;
  };

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg" backdrop="static">
        <Modal.Header>
          <Modal.Title>
            <h5>Download Data MBG (Simple)</h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Tabel</Form.Label>
              <Form.Select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                <option value="">-- Pilih Tabel --</option>
                {tables.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
          {loadingExcellX && (
            <div className="text-center mt-3">
              <Spinner animation="border" size="sm" /> Sedang mendownload
              data...
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loadingExcellX}
          >
            Tutup
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerateExcel}
            disabled={!selectedTable}
          >
            {loadingExcellX ? "Downloading..." : "Download"}
          </Button>
        </Modal.Footer>
      </Modal>

      {loadingExcellX && (
        <GenerateExcelMBG
          query3={generateQuery(selectedTable)}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`v3_EXCELL_MBG_TABEL_${selectedTable}_${moment().format(
            "DDMMYY-HHmmss"
          )}.xlsx`}
        />
      )}
    </>
  );
};

export default DownloadData2;
