import React from "react";

const YourComponentToExport = () => {
  return (
    <div>
      <h1>Data yang Ingin diekspor</h1>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Usia</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>30</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Doe</td>
            <td>28</td>
          </tr>
          {/* Tambahkan data Anda di sini */}
        </tbody>
      </table>
    </div>
  );
};

export default YourComponentToExport;
