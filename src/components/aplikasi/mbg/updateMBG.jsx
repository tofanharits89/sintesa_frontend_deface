import React, { useState } from "react";
import { Button } from "react-bootstrap";

import { UpdateMbg } from "./overview/tgUpdate";
import DownloadData from "./modal/DownloadData";
import UpdateModal from "./modal/updateData";

const UpdateDataMbg = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModaldata, setShowModaldata] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleCloseData = () => setShowModaldata(false);
  const handleData = () => {
    // Logika pengambilan atau pengolahan data
    // console.log("Data dikonfirmasi");
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        {/* <h5 className="card-title">Data MBG TA 2025</h5> */}
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <i className="bi bi-star me-4 text-success"></i>
            Sumber Data: Badan Gizi Nasional (
            <a
              href="https://dialur.bgn.go.id/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://dialur.bgn.go.id/
            </a>
            )
          </li>
          <li className="list-group-item">
            <i className="bi bi-collection me-4 text-primary"></i>
            Periode: -
          </li>
          <li className="list-group-item">
            <i className="bi bi-check-circle me-4 text-danger"></i>
            Jenis Data: Penyaluran Makan Bergizi Gratis
          </li>
          <li className="list-group-item">
            <i className="bi bi-exclamation-octagon me-4 text-warning"></i>
            Update:{" "}
            <span className="mx-1">
              <UpdateMbg />
            </span>
          </li>
        </ul>
        <div className="mt-3">
          <Button
            onClick={() => setShowModal(true)}
            variant="danger"
            size="sm"
            style={{ width: "130px" }}
          >
            Update Data
          </Button>{" "}
          <Button
            onClick={() => setShowModaldata(true)}
            variant="primary"
            size="sm"
            style={{ width: "130px" }}
          >
            Dataset
          </Button>
        </div>

        {/* Modal Komponen */}
        <DownloadData
          show={showModaldata}
          onClose={handleCloseData}
          onConfirm={handleData}
        />
        <UpdateModal show={showModal} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default UpdateDataMbg;
