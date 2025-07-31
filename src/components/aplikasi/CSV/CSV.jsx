import React from "react";
import Papa from "papaparse";
import { Button } from "react-bootstrap";

const ExportCSVButton = ({ data, filename }) => {
  const exportToCSV = () => {
    const config = {
      delimiter: ";", // Ganti dengan delimiter yang diinginkan, misalnya ";"
    };

    const csv = Papa.unparse(data, config);

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="success"
      size="sm"
      className="w-15 fade-in mb-2"
      onClick={exportToCSV}
    >
      Download CSV
    </Button>
  );
};

export default ExportCSVButton;
