import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Card,
  InputGroup,
} from "react-bootstrap";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import MyContext from "../../auth/Context";
import { handleHttpError } from "../aplikasi/notifikasi/toastError";

const PopupKirimPesan = ({ show, onHide, toUser }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [message, setMessage] = useState("");
  const [judul, setJudul] = useState("");
  const [prioritas, setPrioritas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [defaultUserOptions, setDefaultUserOptions] = useState([]);

  // Custom Option component with user icon
  const CustomOption = (props) => (
    <components.Option {...props}>
      <div className="d-flex align-items-center">
        <i
          className="fas fa-user-circle me-2 text-muted"
          style={{ fontSize: "14px" }}
        ></i>
        <span>{props.label}</span>
      </div>
    </components.Option>
  );

  // Custom SingleValue component with user icon
  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <div className="d-flex align-items-center">
        <i
          className="fas fa-user-circle me-2 text-muted"
          style={{ fontSize: "14px" }}
        ></i>
        <span>{props.children}</span>
      </div>
    </components.SingleValue>
  );
  // Load default user options saat komponen dimuat
  useEffect(() => {
    const loadDefaultUsers = async () => {
      try {
        const res = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_USERS,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const options = res.data.map((user) => ({
          value: user.username,
          label: `${user.name} (${user.username})`,
        }));
        setDefaultUserOptions(options);
      } catch (err) {
        console.error("Error loading default users:", err);
      }
    };

    if (token && show) {
      loadDefaultUsers();
    }
  }, [token, show]);
  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      setMessage("");
      setJudul("");
      setPrioritas("");
      setSelectedUser(null);
      setError("");
      setSuccess(false);
      setDefaultUserOptions([]);
    }
  }, [show]); 
  
  // Fungsi untuk load user dari API
  const loadUserOptions = async (inputValue, callback) => {
    try {
      
      // Jika input kosong, return defaultUserOptions atau empty array
      if (!inputValue || inputValue.trim() === "") {
        callback(defaultUserOptions);
        return;
      }

      const searchParam = inputValue.trim();

      const res = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_USERS,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: searchParam },
        }
      );


      const options = res.data
        .sort((a, b) => {
          // Pencocokan tidak case sensitive
          if (
            a.username.toLowerCase() === searchParam.toLowerCase() ||
            a.name.toLowerCase() === searchParam.toLowerCase()
          )
            return -1;
          if (
            b.username.toLowerCase() === searchParam.toLowerCase() ||
            b.name.toLowerCase() === searchParam.toLowerCase()
          )
            return 1;
          // Jika input adalah substring dari username/nama, letakkan lebih atas
          if (
            a.username.toLowerCase().includes(searchParam.toLowerCase()) ||
            a.name.toLowerCase().includes(searchParam.toLowerCase())
          )
            return -1;
          if (
            b.username.toLowerCase().includes(searchParam.toLowerCase()) ||
            b.name.toLowerCase().includes(searchParam.toLowerCase())
          )
            return 1;
          return 0;
        })
        .map((user) => ({
          value: user.username,
          label: `${user.name} (${user.username})`,
        }));

      callback(options);
    } catch (err) {
      console.error("DEBUG KIRIM PESAN - Error loading users:", err);
      console.error("DEBUG KIRIM PESAN - Error response:", err.response?.data);
      callback([]);
    }
  };
  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!message.trim() || !selectedUser || !judul.trim() || !prioritas) {
      setError("Semua field harus diisi.");
      setLoading(false);
      return;
    }
    const formData = {
      title: judul,
      content: message,
      messageType: prioritas,
      destination: selectedUser.value,
      pinned: false,
      username: username,
      sendAs: "pesan", // Backend memerlukan nilai ini tidak kosong
    };

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANNOTIFIKASI,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("");
      setJudul("");
      setPrioritas("");
      setSelectedUser(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      if (onHide) onHide();
    } catch (error) {
      handleHttpError(
        error?.response?.status,
        error?.response?.data?.error || "Gagal mengirim pesan."
      );
    }
    setLoading(false);
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      animation={false}
      className="kirim-pesan-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center">
          <i className="fas fa-paper-plane me-2 text-primary"></i>
          Kirim Pesan
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <Form onSubmit={handleSend}>
              {/* Tujuan Section */}
              <div className="mb-4">
                <Form.Label className="fw-bold mb-3 d-flex align-items-center">
                  <i className="fas fa-user me-2 text-muted"></i>
                  Kepada
                </Form.Label>
                <div className="select-wrapper">
                  {" "}
                  <AsyncSelect
                    cacheOptions={false}
                    loadOptions={(inputValue, callback) => {
                      loadUserOptions(inputValue, (options) => {
                        callback(options);
                      });
                    }}
                    defaultOptions={defaultUserOptions}
                    value={selectedUser}
                    onChange={setSelectedUser}
                    placeholder="🔍 Cari nama atau username..."
                    isClearable
                    className="custom-select"
                    classNamePrefix="select"
                    noOptionsMessage={() => "Tidak ada user ditemukan"}
                    loadingMessage={() => "Mencari user..."}
                    filterOption={null}
                    components={{
                      Option: CustomOption,
                      SingleValue: CustomSingleValue,
                    }}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        border: "1px solid #e9ecef",
                        borderColor: state.isFocused ? "#0d6efd" : "#e9ecef",
                        borderRadius: "6px",
                        padding: "2px 4px",
                        minHeight: "34px",
                        boxShadow: state.isFocused
                          ? "0 0 0 0.1rem rgba(13, 110, 253, 0.15)"
                          : "none",
                        "&:hover": {
                          borderColor: "#0d6efd",
                        },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#6c757d",
                        fontSize: "13px",
                        fontWeight: "400",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#212529",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#0d6efd"
                          : state.isFocused
                          ? "#f8f9fa"
                          : "white",
                        color: state.isSelected ? "white" : "#495057",
                        padding: "8px 12px",
                        fontSize: "13px",
                        fontWeight: "400",
                        lineHeight: "1.3",
                        borderRadius: "4px",
                        margin: "1px 4px",
                        width: "calc(100% - 8px)",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: state.isSelected
                            ? "#0d6efd"
                            : "#e9ecef",
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "1px solid #e9ecef",
                      }),
                      menuList: (base) => ({
                        ...base,
                        padding: "4px",
                      }),
                    }}
                  />{" "}
                </div>
              </div>
              {/* Judul Section */}
              <div className="mb-4">
                <Form.Label className="fw-bold mb-2">Judul:</Form.Label>
                <Form.Control
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul pesan"
                  style={{
                    border: "1px solid #e9ecef",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    fontSize: "14px",
                  }}
                />
              </div>
              {/* Prioritas Section */}
              <div className="mb-4">
                <Form.Label className="fw-bold mb-2">Prioritas:</Form.Label>
                <Form.Select
                  value={prioritas}
                  onChange={(e) => setPrioritas(e.target.value)}
                  style={{
                    border: "1px solid #e9ecef",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">--- Pilih ---</option>
                  <option value="biasa">Biasa</option>
                  <option value="penting">Penting</option>
                  <option value="sangat_penting">Sangat Penting</option>
                </Form.Select>
              </div>{" "}
              {/* Pesan Section */}
              <div className="mb-4">
                <Form.Label className="fw-bold mb-2">Isi :</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="✏️ Tulis pesan Anda di sini..."
                    autoFocus
                    className="custom-textarea"
                    style={{
                      border: "2px solid #e9ecef",
                      borderRadius: "12px",
                      padding: "16px",
                      fontSize: "14px",
                      resize: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0d6efd";
                      e.target.style.boxShadow =
                        "0 0 0 0.2rem rgba(13, 110, 253, 0.25)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e9ecef";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <div className="position-absolute bottom-0 end-0 me-3 mb-2">
                    <small className="text-muted">{message.length}/500</small>
                  </div>
                </div>
              </div>
              {/* Status Messages */}
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center mb-4"
                  role="alert"
                >
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              {success && (
                <div
                  className="alert alert-success d-flex align-items-center mb-4"
                  role="alert"
                >
                  <i className="fas fa-check-circle me-2"></i>
                  Pesan berhasil terkirim!
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 px-4 pb-4">
        <div className="d-flex gap-3 w-100">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            disabled={loading}
            className="px-4 py-2 rounded-pill"
            style={{ minWidth: "100px" }}
          >
            <i className="fas fa-times me-2"></i>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={loading || !message.trim() || !selectedUser}
            className="px-4 py-2 rounded-pill flex-grow-1"
            style={{
              background: "linear-gradient(45deg, #0d6efd, #6610f2)",
              border: "none",
              minWidth: "120px",
            }}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Mengirim...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Kirim Pesan
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupKirimPesan;
