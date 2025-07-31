import React, { useState, useEffect } from "react";

import { ListGroup, Button, Spinner, Alert, Container } from "react-bootstrap";

const SftpMenu = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil daftar file dari API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sftp/list");
        setFiles(response.data.files);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data dari server SFTP.");
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  // Fungsi untuk mengunduh file
  const handleDownload = (filePath) => {
    window.location.href = `http://localhost:5000/sftp/download?filePath=${filePath}`;
  };

  //   if (loading)
  //     return (
  //       <div className="text-center mt-5">
  //         <Spinner animation="border" variant="primary" />
  //         <p className="mt-3">Loading files...</p>
  //       </div>
  //     );

  //   if (error)
  //     return (
  //       <Alert variant="danger" className="mt-3 text-center">
  //         {error}
  //       </Alert>
  //     );

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Remote SFTP DIPA</h1>
        </div>
        <section className="section dashboard">
          <Container fluid>
            <ListGroup>
              {files.map((file, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{file.filename}</span>
                  <Button
                    variant="success"
                    onClick={() => handleDownload(file.filename)}
                    className="ml-3"
                  >
                    Download
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Container>
        </section>
      </main>
    </>
  );
};

export default SftpMenu;
