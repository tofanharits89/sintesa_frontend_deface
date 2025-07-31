import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GetLokasiMap = () => {
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // Menambah waktu tunggu hingga 10 detik
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAccuracy(position.coords.accuracy);
        fetchLocationName(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setShowModal(true);
        }
      },
      geoOptions
    );
  }, []);

  const fetchLocationName = (latitude, longitude) => {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setLocationName(data.display_name);
      })
      .catch((error) => {
        console.error("Error fetching location name:", error);
      });
  };

  const handleAllowLocation = () => {
    setShowModal(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAccuracy(position.coords.accuracy);
        fetchLocationName(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Lokasi Tidak Aktif.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Menambah waktu tunggu hingga 10 detik
        maximumAge: 0,
      }
    );
  };

  const handleZoomToLocation = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView([location.latitude, location.longitude], 18);
    }
  };
  // console.log(locationName);

  return (
    <div>
      <Container fluid>
        <h1>Lokasi Anda</h1>

        {location ? (
          <div>
            <p>Latitude : {location.latitude}</p>
            <p>Longitude : {location.longitude}</p>
            <p>Akurasi : {accuracy} meters</p>
            <p>Lokasi Detail : {locationName}</p>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={15}
              style={{ height: "400px", width: "100%" }}
              zoomControl={true}
              ref={mapRef}
              className="my-2"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[location.latitude, location.longitude]}
                onClick={handleZoomToLocation}
              >
                <Popup>
                  Lokasi Anda <br />
                  {locationName}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <p>Lokasi Tidak Tersedia :-(</p>
        )}

        <Modal
          show={showModal}
          animation={false}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Ijin Akses Lokasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Sintesa v3 ingin mengakses lokasi anda. Mohon ijinkan saat popup
              konfirmasi di browser muncul. Jika lokasi terblokir, ikuti langkah
              berikut :
            </p>
            <ol>
              <li>Pilih icon kunci di alamat browser.</li>
              <li>Pilih "Site settings".</li>
              <li>Cari "Location" dan pilih "Allow".</li>
              <li>Reload browser kembali</li>
            </ol>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAllowLocation}>
              Ijinkan Akses Lokasi
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default GetLokasiMap;
