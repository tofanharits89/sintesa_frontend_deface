import React, { useState, useContext, useEffect } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import Notifikasi from "../notifikasi/notif";
import { handleHttpError } from "../notifikasi/toastError";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import NotifikasiSukses from "../notifikasi/notifsukses";

const UploadSPM = (props) => {
  const { axiosJWT, token, url } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState(null);
  const [processSuccess, setProcessSuccess] = useState(null);
  const expectedColumns = ["tgspm", "nospm", "nilai_spm", "tgbast", "nobast"];
  const maxRows = 200;
  const [formData, setFormData] = useState([]);
  const [fileName, setFileName] = useState("Pilih File Excell");
  const [formatDispen, setFormatDispen] = useState("Template Excel");

  useEffect(() => {
    props.cekupload && getData();
  }, [props.cekupload, props.id]);

  const getData = async () => {
    const encodedQuery = encodeURIComponent(
      `SELECT id,thang,kddept,kdunit,kdkanwil,kdlokasi,kdsatker,tgpermohonan,nopermohonan,kd_dispensasi,rpata FROM  laporan_2023.dispensasi_spm WHERE id='${props.id}' GROUP BY id`
    );
    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData(response.data);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const fileUrl = `${
    import.meta.env.VITE_REACT_APP_LOCAL_FORMATDISPEN
  }/format_dispen/format_dispen_spm.xlsx`;
  // console.log(fileUrl);

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const handleFileUpload = (e) => {
    setLoading(true);
    setError(null);
    const file = e.target.files[0];
    setFileName(file.name); // Set nama file yang dipilih
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Validasi jumlah kolom dan header
      const headers = jsonData[0];
      if (
        !headers ||
        headers.length !== expectedColumns.length ||
        !headers.every((header, index) => header === expectedColumns[index])
      ) {
        setError(
          `Header tidak valid. Susunan kolom: ${expectedColumns.join(", ")}`
        );
        setLoading(false);
        setData([]);
        return;
      }

      // Remove the header row
      jsonData.shift();

      // Convert back to an object array for further processing
      const processedData = jsonData.map((row) =>
        Object.fromEntries(
          row.map((cell, index) => [expectedColumns[index], cell])
        )
      );

      // Validasi jumlah baris
      if (processedData.length > maxRows) {
        setError(
          `Jumlah baris [${processedData.length}] Error : Maksimum 500 baris yang diizinkan`
        );
        setLoading(false);
        setData([]);
        return;
      }

      // Validasi format tanggal pada kolom 1 dan 4
      const invalidRows = processedData.filter((row) => {
        return !isValidDate(row.tgspm) || !isValidDate(row.tgbast);
      });

      if (invalidRows.length > 0) {
        setError(
          `Data pada kolom tgspm atau tgbast harus berformat tanggal (yyyy-mm-dd).`
        );
        setLoading(false);
        setData([]);
        return;
      }

      setData(processedData);
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleProcessData = () => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin ingin upload data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Upload Data",
      cancelButtonText: "Batal",
      position: "top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.post(
            `${
              import.meta.env.VITE_REACT_APP_LOCAL_BASIC
            }dispensasi/uploadspm/`,
            { ...formData, data },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          NotifikasiSukses("Data berhasil di Upload.");
        } catch (error) {
          const { status, data } = error.response || {};
          handleHttpError(
            status,
            (data && data.error) ||
              "Terjadi Permasalahan Koneksi atau Server Backend"
          );
        }
      }
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12" className="my-1 mb-3 text-danger fw-bold">
          *) Catatan :<br /> 1. excell berisi 5 kolom
          (tgspm|nospm|nilai_spm|tgbast|nobast)
          <br />
          2. Maksimal 200 baris data per upload
          <br />
          3. baris header diabaikan
          <br /> 4. Gunakan format TEXT pada setiap kolom, apabila mengandung
          angka hilangkan koma atau titik
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="12">
          <Form>
            <Col md="3">
              <Form.Group
                controlId="formFile"
                className="mb-3 d-flex justify-content-between"
              >
                <Button
                  onClick={() => (window.location.href = fileUrl)}
                  className="btn btn-danger"
                >
                  {formatDispen}
                </Button>

                <label htmlFor="file-upload" className="btn btn-primary">
                  {fileName}
                </label>

                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  id="file-upload"
                  style={{ display: "none" }} // Sembunyikan input file asli
                />
              </Form.Group>
            </Col>
          </Form>
          {loading && (
            <div className="d-flex justify-content-center mt-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading data...</span>
              </Spinner>
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && data.length > 0 && (
            <div style={{ height: "200px", overflowY: "scroll" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((cell, i) => (
                        <td key={i}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
      {data.length > 0 && (
        <div className="my-1 d-flex justify-content-between my-2 mt-4">
          Jumlah data : {data.length}
          <Button
            variant="danger"
            className="my-1 mx-1 fade-in"
            onClick={handleProcessData}
            disabled={processing}
          >
            {processing ? (
              <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden">Processing...</span>
              </Spinner>
            ) : (
              "Upload Data"
            )}
          </Button>
        </div>
      )}
      {processSuccess && <Alert variant="success">{processSuccess}</Alert>}
      {processError && <Alert variant="danger">{processError}</Alert>}
    </Container>
  );
};

export default UploadSPM;
