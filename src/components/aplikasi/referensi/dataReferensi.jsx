import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { Formik, Field, ErrorMessage } from "formik";
import Encrypt from "../../../auth/Random";
import * as Yup from "yup";
import "../referensi/ref.css";
import CopyToClipboard from "react-copy-to-clipboard";
import GenerateCSV from "../CSV/generateCSV";
import moment from "moment";

const DataReferensi = () => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [diisi, setDiisi] = useState("");
  const [data, setData] = useState([]);
  const [hasilQuery, setHasilQuery] = useState([]);
  const [dataCol, setDataCol] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [sumber, setSumber] = useState("");
  const [where, setWhere] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);
  const [showAnimation, setShowAnimation] = useState(true);
  const [checkboxes, setCheckboxes] = useState({});
  const [selectedFormat, setSelectedFormat] = useState("json"); // State untuk menyimpan nilai radio button yang dipilih
  const [isCopied, setIsCopied] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);
  const [sql, setSql] = useState("");
  const [total, setTotal] = useState(0);

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
  };

  const handleCopy = () => {
    setIsCopied(true);
  };

  const handleRadioChange = (e) => {
    setSelectedFormat(e.target.value); // Mengubah state ketika radio button dipilih
  };

  useEffect(() => {
    sumber !== "" && fetchDataDB();
  }, [sumber]);

  const fetchDataDB = async () => {
    const filterDB = [
      "dbref",
      //  "information_schema",
      "laporan_2023",
      // "monev2023",
      // "mysql",
      // "performance_schema",
      // "sys",
      "tkd",
      "data_omspan",
      //"v3"
    ];

    try {
      if (role === "X" && sumber === "DITPA") {
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_DB
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_DB}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDatabases(response.data); // Assuming the response contains data array
        setLoading(false);
      } else if (role === "X" && sumber === "SITP") {
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_DB_ORACLE
            ? `${
                import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_DB_ORACLE
              }`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDatabases(response.data.rows); // Assuming the response contains data array
        setLoading(false);
      } else {
        setDatabases(filterDB);
      }
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (selectedDatabase !== "") {
      try {
        if (sumber === "DITPA") {
          const response = await axiosJWT.get(
            import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_REF
              ? `${
                  import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_REF
                }/${selectedDatabase}`
              : "",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData(response.data); // Assuming the response contains data array
          setLoading(false);
        }
      } catch (error) {
        const { status, data } = error.response || {};
        handleHttpError(
          status,
          (data && data.error) ||
            "Terjadi Permasalahan Koneksi atau Server Backend"
        );
        setLoading(false);
      }
    }
  };

  const fetchDataColumn = async () => {
    if (selectedDatabase !== "") {
      try {
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_COL
            ? `${
                import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_COL
              }/${selectedDatabase}/${selectedTable}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDataCol(response.data); // Assuming the response contains data array
        setLoading(false);
      } catch (error) {
        const { status, data } = error.response || {};
        handleHttpError(
          status,
          (data && data.error) ||
            "Terjadi Permasalahan Koneksi atau Server Backend"
        );
        setLoading(false);
      }
    }
  };

  const handleSubmitdata = async (values, { setSubmitting }) => {
    if (sumber === "DITPA") {
      setLoading(true);
      const queryBuilder = (
        selectedDatabase,
        selectedTable,
        selectedFields
      ) => {
        // Jika selectedFields kosong, pilih semua kolom
        const fieldsToSelect =
          selectedFields.length > 0 ? selectedFields.join(", ") : "*";
        const query = `SELECT ${fieldsToSelect} FROM ${selectedDatabase}.${selectedTable} ${where} LIMIT 100000`;

        return query;
      };
      const query = queryBuilder(
        selectedDatabase,
        selectedTable,
        selectedFields
      ).toUpperCase();
      const encodedQuery = encodeURIComponent(`${query}`);

      const cleanedQuery = decodeURIComponent(encodedQuery)
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      setSql(cleanedQuery);

      const encryptedQuery = Encrypt(cleanedQuery);
      try {
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI
            ? `${
                import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI
              }${encryptedQuery}&db=${selectedDatabase}&tabel=${selectedTable}&where=${where}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasilQuery(response.data.result);
        setTotal(response.data.total);
        setLoading(false);
      } catch (error) {
        const { status, data } = error.response || {};
        handleHttpError(
          status,
          (data && data.error) ||
            "Terjadi Permasalahan Koneksi atau Server Backend"
        );
        setLoading(false);
      }

      setSubmitting(false);
    } else if (sumber === "SITP") {
      setLoading(true);

      const queryBuilder = (selectedDatabase) => {
        const query = `SELECT * FROM ${selectedDatabase}`;

        return query;
      };
      const query = queryBuilder(selectedDatabase).toUpperCase();
      const encodedQuery = encodeURIComponent(`${query}`);
      const cleanedQuery = decodeURIComponent(encodedQuery)
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      try {
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_REF_ORACLE
            ? `${
                import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_REF_ORACLE
              }/${cleanedQuery}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasilQuery(response.data.result);
        setLoading(false);
      } catch (error) {
        const { status, data } = error.response || {};
        handleHttpError(
          status,
          (data && data.error) ||
            "Terjadi Permasalahan Koneksi atau Server Backend"
        );
        setLoading(false);
      }
    }
    setSubmitting(false);
  };

  useEffect(() => {
    fetchData();
    setSelectedTable("");
    setDataCol([]);
    setCheckboxes({});
    setDiisi("");
    setHasilQuery([]);
  }, [selectedDatabase]);

  // useEffect(() => {
  //   if (sumber === "SITP") {
  //     setSelectedDatabase("");
  //     setSelectedTable("");
  //     setDataCol([]);
  //     setCheckboxes({});
  //     setDiisi("");
  //   }
  //   setHasilQuery([]);
  // }, [sumber]);

  useEffect(() => {
    selectedDatabase && selectedTable !== "" && fetchDataColumn();
    setDiisi("");
    setIsCopied(false);
  }, [selectedTable]);

  const validationSchema = Yup.object().shape({
    selectedDatabase: Yup.string().required("Database belum dipilih"),
    sumber: Yup.string().required("Sumber Data belum dipilih"),
    selectedTable: Yup.string().when("sumber", {
      is: (val) => val === "DITPA",
      then: () => Yup.string().required("Tabel belum dipilih"),
      otherwise: () => Yup.string().notRequired(),
    }),
  });

  // Di initialValues, tambahkan selectedFields
  const initialValues = {
    sumber: sumber,
    selectedTable: "",
    selectedDatabase: "",
    selectedFields: [], // Tambahkan ini sebagai bagian dari initialValues
    where: "",
  };

  const handleCheckboxChange = (event, setFieldValue) => {
    const { value, checked } = event.target;

    const updatedCheckboxes = { ...checkboxes, [value]: checked };

    const updatedSelectedFields = Object.keys(updatedCheckboxes).filter(
      (key) => updatedCheckboxes[key]
    );

    setCheckboxes(updatedCheckboxes);
    setFieldValue("selectedFields", updatedSelectedFields);
    setDiisi("1");
  };
  useEffect(() => {
    if (dataCol.length > 0) {
      const allFields = {};
      dataCol.forEach((field) => {
        allFields[field] = true;
      });

      setCheckboxes(allFields);
      setSelectedFields(Object.keys(allFields)); // Menetapkan semua field yang dipilih secara default
      setDiisi("1"); // Untuk menandakan bahwa minimal satu field terpilih
    }
  }, [dataCol]);

  const displayJSON = (data) => {
    if (!data || Object.keys(data).length === 0) {
      return "Tidak ada hasil yang ditemukan";
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Generate Data</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">DB</a>
            </li>
            <li className="breadcrumb-item active">Tabel</li>
          </ol>
        </nav>
      </div>
      <section className="section my-0">
        <Container fluid>
          <Formik
            validationSchema={validationSchema}
            onSubmit={handleSubmitdata} // Make sure this is correct
            initialValues={initialValues}
          >
            {({
              handleSubmit,
              handleChange,
              setFieldValue,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Label>Sumber </Form.Label>
                    <Form.Select
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("sumber", e.target.value);
                        setSumber(e.target.value);
                        setHasilQuery([]);
                      }}
                      className="form-select form-select-md text-select fade-in"
                      name="sumber"
                    >
                      <option value="" className="option-margin">
                        --- Pilih Sumber Data ---
                      </option>
                      <option value="DITPA" className="option-margin">
                        MYSQL (DITPA)
                      </option>
                      {role === "X" && (
                        <option value="SITP" className="option-margin">
                          ORACLE (SITP)
                        </option>
                      )}
                    </Form.Select>
                    <ErrorMessage
                      name="sumber"
                      component="div"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Database</Form.Label>
                    <Form.Select
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("selectedDatabase", e.target.value);
                        setSelectedDatabase(e.target.value);
                        setSelectedTable("");
                        setHasilQuery([]);
                      }}
                      className="form-select form-select-md text-select fade-in"
                      value={selectedDatabase}
                      name="selectedDatabase"
                    >
                      <option value="">Pilih Database</option>
                      {databases.map((database, index) => (
                        <option key={index} value={database}>
                          {database}
                        </option>
                      ))}
                    </Form.Select>
                    <ErrorMessage
                      name="selectedDatabase"
                      component="div"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Tabel</Form.Label>
                    <Form.Select
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("selectedTable", e.target.value);
                        setSelectedTable(e.target.value);
                      }}
                      className="form-select form-select-md text-select fade-in"
                      value={selectedTable}
                      name="selectedTable"
                      disabled={sumber === "SITP"}
                    >
                      <option value="">Pilih Tabel</option>
                      {data.map((table, index) => (
                        <option key={index} value={table || ""}>
                          {table || "Pilih Tabel"}
                        </option>
                      ))}
                    </Form.Select>
                    <ErrorMessage
                      name="selectedTable"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                </Row>

                <hr />

                <div>
                  <legend>
                    <h6>
                      {selectedTable && (
                        <>
                          {/* <div className="d-flex align-items-center justify-content-between  my-3">
                            <Button
                              variant="primary"
                              size="sm"
                              className="mx-0"
                              style={{ width: "150px" }}
                            >
                              Pilih Fields Data
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              style={{ width: "150px" }}
                              onClick={() => {
                                const allFields = dataCol.reduce(
                                  (acc, field) => {
                                    acc[field] = true;
                                    return acc;
                                  },
                                  {}
                                );

                                setCheckboxes(allFields); // Set semua cekbox menjadi terpilih
                                setSelectedFields(Object.keys(allFields)); // Set semua field terpilih
                                setDiisi("1"); // Untuk menunjukkan bahwa minimal satu field terpilih
                              }}
                            >
                              Pilih Semua
                            </Button>
                          </div> */}
                        </>
                      )}
                    </h6>
                  </legend>

                  <Row>
                    <div
                      style={{
                        minHeight: "300px",
                        overflow: "hidden",
                        margin: "2px",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {dataCol.map((field, index) => (
                        <Col md={4} key={index}>
                          <fieldset className={showAnimation ? "zoomIn" : ""}>
                            <label>
                              <input
                                type="checkbox"
                                value={field}
                                className="form-check-input mx-2"
                                id="flexCheckCheckedDisabled"
                                disabled
                                onChange={(e) =>
                                  handleCheckboxChange(e, setFieldValue)
                                }
                                checked={!!checkboxes[field]}
                                name="selectedFields"
                              />
                              <span></span>
                              {field.toUpperCase()}
                            </label>
                          </fieldset>
                        </Col>
                      ))}
                    </div>
                    {selectedDatabase !== "" &&
                      selectedTable !== "" &&
                      diisi === "" && (
                        <p className="text-danger fst-italic">
                          Pilih Nama Kolom
                        </p>
                      )}
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-1 mt-1">
                        <Field
                          name="where"
                          type="text"
                          placeholder="tambahkan klausa untuk memperkecil baris data ( contoh : <namakolom>='XXX' AND <namakolom>='YYY' dst ...)"
                          as={Form.Control}
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue("where", e.target.value);
                            setWhere(e.target.value);
                          }}
                          disabled={sumber === "SITP"}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                <div className="d-flex justify-content-between my-3">
                  <div>
                    <span>
                      <i
                        className="bi bi-exclude text-secondary"
                        style={{
                          fontSize: "20px",
                          fontWeight: "normal",
                          margin: "8px",
                        }}
                      ></i>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "normal",
                          margin: "0px",
                        }}
                      >
                        sintesa
                      </span>
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="inlineRadio1"
                        value="json"
                        name="fileFormat"
                        onChange={handleRadioChange}
                        checked={selectedFormat === "json"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio1"
                        style={{ marginLeft: "8px" }}
                      >
                        JSON
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="inlineRadio2"
                        value="csv"
                        name="fileFormat"
                        onChange={handleRadioChange}
                        checked={selectedFormat === "csv"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio2"
                        style={{ marginLeft: "8px" }}
                      >
                        CSV
                      </label>
                    </div>

                    {/* <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="inlineRadio3"
                        value="tampilkan"
                        name="fileFormat"
                        onChange={handleRadioChange}
                        checked={selectedFormat === "tampilkan"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio3"
                        style={{ marginLeft: "8px" }}
                      >
                        Tampilkan
                      </label>
                    </div> */}
                  </div>

                  <div className="text-end">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={loading} // Tombol akan dinonaktifkan saat loading true
                    >
                      {loading && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      {loading ? "Loading..." : "Generate"}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Container>
        <hr />
        <Container fluid className="mt-4">
          <Card>
            <CardBody
              style={{
                height: "350px",
                overflow: "scroll",
                position: "relative",
              }}
            >
              {selectedFormat === "csv" && hasilQuery.length > 0 && (
                <div className="text-center">
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-4 btn-block "
                    style={{ width: "10%" }}
                    onClick={() => {
                      setLoadingStatus(true);
                      setExport2(true);
                    }}
                    disabled={loadingStatus}
                  >
                    {loadingStatus ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                    ) : (
                      <i className="bi bi-file-earmark-excel-fill me-2"></i>
                    )}
                    {loadingStatus ? " Loading..." : "Download"}
                  </Button>
                </div>
              )}

              {selectedFormat === "json" && hasilQuery.length > 0 && (
                <>
                  {loading ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 9999,
                        backgroundColor: "rgba(255, 255, 255, 0.5)", // Set opacity
                        borderRadius: "8px",
                        padding: "20px",
                      }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {total === 0 ? (
                        <p className="text-center">Data kosong</p>
                      ) : (
                        <>
                          <Row className="d-flex justify-content-between is-sticky-datauser my-2">
                            <Col>
                              <span>
                                <h4
                                  className="bg-light text-start"
                                  style={{ padding: "10px" }}
                                >
                                  Format JSON{" "}
                                </h4>
                                <h6 className="text-end">
                                  {total} data ditemukan{" "}
                                  <CopyToClipboard
                                    text={JSON.stringify(hasilQuery, null, 2)}
                                    onCopy={handleCopy}
                                  >
                                    <i
                                      className="bi bi-subtract mx-3 text-danger fw-bold"
                                      style={{ fontSize: "20px" }}
                                    ></i>
                                  </CopyToClipboard>
                                  {isCopied ? (
                                    <span style={{ color: "green" }}>
                                      Copied!
                                    </span>
                                  ) : null}
                                </h6>
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <div>
                                {total === 0 ? (
                                  <pre>Tidak ada hasil yang ditemukan</pre>
                                ) : (
                                  <div>
                                    <textarea
                                      style={{ border: "0" }}
                                      rows={10}
                                      cols={200}
                                      value={displayJSON(hasilQuery)}
                                      readOnly
                                    />
                                  </div>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </CardBody>
          </Card>
          {export2 && (
            <GenerateCSV
              query3={sql}
              status={handleStatus}
              namafile={`v3_CSV_ROWSET_${moment().format("DDMMYY-HHmmss")}`}
            />
          )}
        </Container>
      </section>
    </main>
  );
};

export default DataReferensi;
