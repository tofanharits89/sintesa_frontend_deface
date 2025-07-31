import React, { useContext, useState } from "react";
import MyContext from "../../auth/Context";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Offline = () => {
  const { offlinest } = useContext(MyContext);
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();

  const handleToggleDetail = () => {
    setShowDetail(!showDetail);
  };

  const handleWhatsApp = () => {
    const phoneNumber = "6285230746829"; // Ganti dengan nomor WhatsApp service desk
    const message = encodeURIComponent("Halo, saya butuh bantuan.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-center px-3">
      <h1
        className="text-light"
        style={{ fontSize: "60px", marginBottom: "30px" }}
      >
        <i className="bi bi-emoji-dizzy text-light"></i>
      </h1>
      <h3 className="text-light">Sintesa v3 sedang Offline</h3>

      <div className="w-100" style={{ maxWidth: 400 }}>
        <Button
          variant="primary"
          size="sm"
          className="mt-4 w-100"
          onClick={handleReload}
        >
          Reload
        </Button>

        <Button
          variant="success"
          size="sm"
          className="w-100 my-1"
          onClick={handleWhatsApp}
        >
          Service Desk
        </Button>

        <Button
          onClick={handleToggleDetail}
          variant="secondary"
          size="sm"
          className="w-100"
        >
          {showDetail ? "Sembunyikan Detail" : "Tampilkan Detail Error"}
        </Button>

        {showDetail && (
          <div className="detail fade-in mt-3 text-center">
            <h6 className="text-light p-0">Pesan: {offlinest?.message}</h6>
            <h6 className="text-light p-0">Kode: {offlinest?.name}</h6>
            <code>
              <h6 className="text-light p-0">Stack: {offlinest?.stack}</h6>
            </code>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offline;
