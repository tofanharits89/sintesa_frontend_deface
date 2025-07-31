import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const Lokasi = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: null,
    error: null,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      try {
        // Mendapatkan informasi lokasi melalui IP menggunakan ipinfo.io
        const ipResponse = await fetch("https://ipinfo.io/json");
        const ipData = await ipResponse.json();

        // Mendapatkan koordinat geografis dari respons IP
        const [latitude, longitude] = ipData.loc.split(",");
        setLocation((prevState) => ({
          ...prevState,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }));

        // Mendapatkan alamat dari koordinat menggunakan Nominatim
        const addressResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`
        );
        const addressData = await addressResponse.json();
        const city =
          addressData.address.city ||
          addressData.address.town ||
          addressData.address.village;
        setLocation((prevState) => ({
          ...prevState,
          city,
        }));
      } catch (error) {
        console.error("Gagal mendapatkan lokasi:", error);
        setLocation((prevState) => ({
          ...prevState,
          error: "Lokasi gagal didapatkan.",
        }));
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return (
    <div className="text-light">
      {loading ? (
        <p className="text-light">Loading...</p>
      ) : location.error ? (
        <p className="text-light">{location.error}</p>
      ) : (
        <div>
          {location.city && (
            <p className="text-light">
              {location.city} [{location.latitude}, {location.longitude}]
            </p>
          )}
        </div>
      )}

      <Modal
        show={showModal}
        backdrop="static"
        keyboard={false}
        size="md"
        animation={false}
        dialogClassName="custom-modal"
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-map-fill text-success mx-2"></i>Konfirmasi Izin
            Akses Lokasi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Untuk meningkatkan layanan dan pengalaman yang lebih baik, Sintesa v3
          memerlukan izin untuk mengakses lokasi Anda.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            size="md"
            onClick={() => setShowModal(false)}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Lokasi;
