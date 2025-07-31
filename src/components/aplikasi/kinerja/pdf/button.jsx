import React, { useState } from "react";
import YourComponentToExport from "./tes";
import ExportToPDFContent from "./exportpdf";
import html2pdf from "html2pdf";

const ExportButton = () => {
  const [exportClass, setExportClass] = useState(""); // State untuk class ekspor

  const handleExport = () => {
    const content = document.getElementById("content-to-export");
    if (content) {
      setExportClass("export-pdf"); // Menambahkan class saat ekspor
      const opt = {
        margin: 10,
        filename: "exported.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };
      html2pdf().from(content).set(opt).save();
      setTimeout(() => {
        setExportClass(""); // Menghapus class setelah ekspor selesai
      }, 2000);
    }
  };
  return (
    <div>
      <button onClick={handleExport}>Export to PDF</button>
      <ExportToPDFContent>
        <YourComponentToExport />
      </ExportToPDFContent>
    </div>
  );
};

export default ExportButton;
