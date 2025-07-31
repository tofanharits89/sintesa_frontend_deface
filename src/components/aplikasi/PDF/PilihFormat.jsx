import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const PilihFormat = ({ selectedFormat, setSelectedFormat }) => {
  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  return (
    <div className="mb-3 d-flex justify-content-center align-items-center flex-column">
      <ButtonGroup>
        <Button
          variant={selectedFormat === "pdf" ? "primary" : "outline-secondary"}
          onClick={() => setSelectedFormat("pdf")}
        >
          PDF
        </Button>
        <Button
          variant={selectedFormat === "excel" ? "primary" : "outline-secondary"}
          onClick={() => setSelectedFormat("excel")}
        >
          Excel
        </Button>
        <Button
          variant={selectedFormat === "json" ? "primary" : "outline-secondary"}
          onClick={() => setSelectedFormat("json")}
        >
          JSON
        </Button>
        <Button
          variant={selectedFormat === "text" ? "primary" : "outline-secondary"}
          onClick={() => setSelectedFormat("text")}
        >
          Text
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default PilihFormat;
