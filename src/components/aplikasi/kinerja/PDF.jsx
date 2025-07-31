import React from "react";
import jsPDF from "jspdf";

const PDF = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Hello, this is a PDF!", 10, 10);
    doc.save("generated-pdf.pdf");
  };

  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default PDF;
