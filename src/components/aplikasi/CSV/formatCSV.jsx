import React from "react";
import ExportCSVButton from "../inquiry/CSV";

const DataExport = ({ data, filename }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Membuat baris header
  const keys = Object.keys(data[0]).map((key) => key.toUpperCase());

  // Membuat array data yang siap untuk CSV
  const csvData = data.map((item) => {
    const row = Object.keys(item).map((key) => {
      let value = item[key];
      // Jika karakter pertama adalah angka 0, ubah menjadi string
      if (typeof value === "string" && value.charAt(0) === "0") {
        value = "'" + value;
      }
      return value;
    });
    return row;
  });

  const formattedData = [keys, ...csvData];
  return (
    <div>
      <ExportCSVButton data={formattedData} filename={filename} />
    </div>
  );
};

export default DataExport;
