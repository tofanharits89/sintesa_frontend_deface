import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import moment from "moment";
import { io } from "socket.io-client";

import MyContext from "../../../../auth/Context";
import { UpdateMbg } from "../overview/tgUpdate";
import GenerateExcelMBG from "../../CSV/generateExcellMBG";
import { Pesan } from "../../notifikasi/Omspan";

const socket = io(import.meta.env.VITE_REACT_APP_LOCAL_SOCKET);

// Kolom aman untuk role 1 dan 2 jika memilih tabel data_sppg_detail
const safeColumnsSPPG = [
  "id",
  "provinsi_sppg AS provinsi",
  "kab_kota_sppg AS kab_kota",
  "kecamatan_sppg AS kecamatan",
  "kelurahan_desa_sppg AS kelurahan_desa",
  "alamat_dapur_sppg AS alamat_dapur",
  "nama_sppg",
  "jenis",
  "tanggal_opsnal",
  "nama_kepala_sppg",
  "nama_yayasan",
  "alamat_yayasan",
  "nama_ketua_yayasan",
  "nama_bank_yayasan",
  "balita",
  "paud",
  "ra",
  "tk",
  "sd_1_3",
  "sd_4_6",
  "mi_1_3",
  "mi_4_6",
  "smp",
  "mts",
  "sma",
  "smk",
  "ma",
  "mak",
  "slb",
  "ponpes",
  "pkbm",
  "bumil",
  "busui",
  "seminari",
  "jumlah_penerima_manfaat",
  "kode_sppg",
  "id_ajuan",
];

const DownloadData = ({ show, onClose }) => {
  const { axiosJWT, token, role } = useContext(MyContext);

  const [loadingExcellX, setloadingExcellX] = useState(false);
  const [error, setError] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableColumns, setTableColumns] = useState([]);
  const [showColumns, setShowColumns] = useState(false);
  const [loadingColumns, setLoadingColumns] = useState(false);

  useEffect(() => {
    if (show) fetchTables();
  }, [show]);

  const fetchTables = async () => {
    try {
      const res = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_DOWNLOAD}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const restricted = [
        "by_TEST",
        "cookies",
        "indikator_bapanas",
        "indikator_bps",
        "indikator_bulanan",
        "indikator_triwulanan",
        "ref_komoditas",
        "data_komoditas",
      ];

      const filtered = res.data.filter((t) =>
        role === "1" || role === "2" ? !restricted.includes(t) : true
      );

      setTables(filtered);
    } catch {
      setError("Gagal memuat daftar tabel dari server.");
    }
  };

  const handleGenerateExcel = () => setloadingExcellX(true);

  const handleDataFetchComplete = (total) => {
    Pesan(total > 0 ? `${total} data berhasil diexport` : "Tidak Ada Data");
    setloadingExcellX(false);
  };

  const fetchTableColumns = async (tableName) => {
    if (!tableName) return [];
    setLoadingColumns(true);

    try {
      if ((role === "1" || role === "2") && tableName === "data_sppg_detail") {
        return safeColumnsSPPG;
      }

      const res = await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_DOWNLOAD}/columns`,
        { tableName, schema: "data_bgn" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success && Array.isArray(res.data.data))
        return res.data.data;
      if (Array.isArray(res.data)) return res.data;

      return [`Error: Gagal mengambil kolom untuk ${tableName}`];
    } catch (err) {
      return [`Error: ${err.message}`];
    } finally {
      setLoadingColumns(false);
    }
  };

  const handleTableChange = async (tableName) => {
    setSelectedTable(tableName);
    setShowColumns(!!tableName);
    setTableColumns([]);

    if (tableName) {
      const cols = await fetchTableColumns(tableName);
      setTableColumns(cols);
    }
  };

  const generateSafeQuery = (tableName) => {
    if ((role === "1" || role === "2") && tableName === "data_sppg_detail") {
      return `SELECT ${safeColumnsSPPG.join(", ")} FROM data_bgn.${tableName}`;
    }
    return `SELECT * FROM data_bgn.${tableName}`;
  };

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg" backdrop="static">
        <Modal.Header>
          <Modal.Title>
            <h5>Download Data MBG</h5>
            <h6 className="text-primary">
              <UpdateMbg />
            </h6>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Tabel</Form.Label>
              <Form.Select
                value={selectedTable}
                onChange={(e) => handleTableChange(e.target.value)}
              >
                <option value="">-- Pilih Tabel --</option>
                {tables.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {(role === "1" || role === "2") &&
              selectedTable === "data_sppg_detail" && (
                <Alert variant="warning">
                  ⚠️ Beberapa kolom sensitif tidak disertakan.
                </Alert>
              )}

            {loadingColumns && (
              <div className="text-center p-3 bg-light rounded border">
                <Spinner animation="border" size="sm" className="me-2" />
                Mengambil informasi kolom...
              </div>
            )}

            {showColumns && tableColumns.length > 0 && !loadingColumns && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3"
              >
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">📋</span>

                  <span className="ms-auto badge bg-primary">
                    {tableColumns.length} kolom
                  </span>
                </div>
                <div
                  className="columns-list"
                  style={{ maxHeight: "250px", overflowY: "auto" }}
                >
                  <ul style={{ columns: 3, columnGap: "12px" }}>
                    {tableColumns.map((col, idx) => (
                      <li key={idx}>{col}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
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
          query3={generateSafeQuery(selectedTable)}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`v3_EXCELL_MBG_TABEL_${selectedTable}_${moment().format(
            "DDMMYY-HHmmss"
          )}.xlsx`}
        />
      )}
    </>
  );
};

export default DownloadData;
