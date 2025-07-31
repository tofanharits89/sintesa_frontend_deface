import React, { useState } from "react";
import { Modal, Button, Badge, Alert } from "react-bootstrap";
import moment from "moment";

const DownloadModal = ({ show, onHide, fileInfo, onDownload, onGetInfo }) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);

  const handleGetInfo = async () => {
    setLoading(true);
    try {
      const data = await onGetInfo(fileInfo.id);
      setInfo(data);
    } catch (error) {
      console.error("Error getting file info:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  React.useEffect(() => {
    if (show && fileInfo) {
      handleGetInfo();
    }
  }, [show, fileInfo]);

  return (
    <Modal show={show} onHide={onHide} size="md" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h6>
            <i className="bi bi-download me-2"></i>
            Download File
          </h6>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Mengambil informasi file...</p>
          </div>
        ) : info ? (
          <div>
            <div className="row mb-2">
              <div className="col-4">
                <strong>Nama File:</strong>
              </div>
              <div className="col-8">{info.originalName}</div>
            </div>

            <div className="row mb-2">
              <div className="col-4">
                <strong>Tipe:</strong>
              </div>
              <div className="col-8">
                <Badge bg={info.type === ".zip" ? "primary" : "secondary"}>
                  {info.type?.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-4">
                <strong>Ukuran:</strong>
              </div>
              <div className="col-8">{formatFileSize(info.size)}</div>
            </div>

            <div className="row mb-2">
              <div className="col-4">
                <strong>Upload:</strong>
              </div>
              <div className="col-8">
                {moment(info.uploadTime).format("DD-MM-YYYY HH:mm:ss")}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-4">
                <strong>Status:</strong>
              </div>
              <div className="col-8">
                {info.fileExists ? (
                  <Badge bg="success">
                    <i className="bi bi-check-circle me-1"></i>
                    File Tersedia
                  </Badge>
                ) : (
                  <Badge bg="danger">
                    <i className="bi bi-x-circle me-1"></i>
                    File Tidak Ditemukan
                  </Badge>
                )}
              </div>
            </div>

            {!info.fileExists && (
              <Alert variant="warning" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                File tidak ditemukan di server. Hubungi administrator.
              </Alert>
            )}
          </div>
        ) : (
          <Alert variant="danger">
            <i className="bi bi-x-circle me-2"></i>
            Gagal mengambil informasi file
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>
          Batal
        </Button>
        {info && info.fileExists && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onDownload(info.id, info.originalName);
              onHide();
            }}
          >
            <i className="bi bi-download me-1"></i>
            Download File
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DownloadModal;
