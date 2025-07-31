import React from "react";
import { Button, Modal, Offcanvas, Spinner } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  LoadingChart,
  LoadingData,
  LoadingTable,
} from "../../layout/LoadingTable";
import { useContext } from "react";
import MyContext from "../../../auth/Context";
import { useState, useEffect } from "react";
import { NotifDisclaimer } from "../notifikasi/Omspan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ModalAnalisa = ({
  showModalAnalisa,
  closeModalAnalisa,
  data,
  loading,
  onBukaChange,
  buka,
}) => {
  const { verified } = useContext(MyContext);
  const [loadingx, setLoadingx] = useState(false);
  const [isCopiedx, setIsCopiedx] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [queryExecuted, setQueryExecuted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [error, setError] = useState("");

  const handleCopyx = () => {
    setIsCopiedx(true);
  };

  const query = async (data) => {
    setLoadingx(true);
    try {
      // Ambil data dari getData

      const requestData = {
        question: data,
      };

      const requestOptions = {
        method: "POST",
        streaming: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_LOCAL_ANALISA}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Tampilkan hasil ke dalam modal kedua
      setResponseData(result.text);

      setLoadingx(false);
    } catch (error) {
      console.log(error);

      setLoadingx(false);
      setError(error.message);
    }
  };
  const length = Object.keys(data).filter((key) => !isNaN(key)).length;

  useEffect(() => {
    if (
      verified === "TRUE" &&
      !loading &&
      !queryExecuted &&
      length &&
      length > 0 &&
      length <= 20
    ) {
      query(data);
      setQueryExecuted(true);
    }
  }, [loading, queryExecuted, data]);

  const toggleDisclaimer = () => {
    setShowDisclaimer(!showDisclaimer);
    NotifDisclaimer(
      "Analisa data ini disediakan hanya untuk keperluan tambahan informasi dan bisa saja terdapat kesalahan."
    );
  };

  return (
    <>
      <Modal
        onHide={closeModalAnalisa}
        // show={showModalAnalisa}
        size="sm"
        animation={true}
        className="right-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Analisa Hasil Query</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {length && length > 20 ? (
            <p>
              Analisa data tidak dapat kami lakukan <br />
              [ERROR 500 : Object terlalu banyak]
            </p>
          ) : loadingx ? (
            <>
              <p className="mx-2">analyzing...</p>
              <LoadingChart />
            </>
          ) : responseData ? (
            <div className="response-container">
              <p style={{ textAlign: "left" }}>{responseData}</p>
            </div>
          ) : error ? (
            <div className="response-container">
              <p style={{ textAlign: "left" }}>
                Terjadi Error pada Aisiteru [{error}]
              </p>
            </div>
          ) : loading ? (
            <>
              <p>fetching data...</p>
            </>
          ) : error ? (
            <>
              <p>Terjadi Error pada Aisiteru</p>
            </>
          ) : null}
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div className="text-left">
              <Button
                variant="danger"
                size="sm"
                onClick={toggleDisclaimer}
                className="w-100"
              >
                Disclaimer
              </Button>
            </div>
            <div className="text-right d-flex">
              <CopyToClipboard
                text={responseData ? responseData : null}
                onCopy={handleCopyx}
              >
                <Button variant="primary" size="sm" className="w-100 mx-1">
                  {isCopiedx ? "Copied" : "Copy"}
                </Button>
              </CopyToClipboard>

              <Button
                variant="secondary"
                size="sm"
                onClick={closeModalAnalisa}
                className="w-100 mx-1"
              >
                Tutup
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <Offcanvas
        show={showModalAnalisa && verified === "TRUE"}
        onHide={closeModalAnalisa}
        placement="bottom"
        scroll={false}
        backdrop={false}
        // className="bg-info text-light"
      >
        <Offcanvas.Header>
          <Offcanvas.Title className="w-100">
            <div className="d-flex justify-content-between align-items-center">
              {/* Bagian Judul */}
              <div>Analisa Data | Aisiteru Experimental </div>

              <div className="d-flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={toggleDisclaimer}
                  style={{ width: "100px" }} // Tentukan lebar yang sama
                >
                  Disclaimer
                </Button>
                {responseData && (
                  <CopyToClipboard
                    text={responseData ? responseData : null}
                    onCopy={handleCopyx}
                  >
                    <Button
                      variant="primary"
                      className="fade-in"
                      size="sm"
                      style={{ width: "100px" }} // Tentukan lebar yang sama
                    >
                      {isCopiedx ? "Copied" : "Copy"}
                    </Button>
                  </CopyToClipboard>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    closeModalAnalisa();
                    onBukaChange(true);
                  }}
                  style={{ width: "100px" }} // Tentukan lebar yang sama
                >
                  Tutup
                </Button>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {length && length > 20 ? (
            <p
              className="text-danger text-center fw-bold position-absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <i
                className="bi bi-emoji-dizzy-fill"
                style={{ fontSize: "30px" }}
              ></i>
              <br /> Analisa data tidak dapat kami lakukan <br />
              [ERROR 500 : Object terlalu banyak]
            </p>
          ) : loadingx ? (
            <>
              <p className="mx-2">analyzing...</p>
              <LoadingTable />
            </>
          ) : responseData ? (
            <div className="response-container">
              <p>{responseData}</p>
            </div>
          ) : error ? (
            <div className="response-container">
              <p style={{ textAlign: "left" }}>
                Terjadi Error pada Aisiteru [{error}]
              </p>
            </div>
          ) : loading ? (
            <>
              <p>fetching data...</p>
            </>
          ) : error ? (
            <>
              <p>Terjadi Error pada Aisiteru</p>
            </>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ModalAnalisa;
