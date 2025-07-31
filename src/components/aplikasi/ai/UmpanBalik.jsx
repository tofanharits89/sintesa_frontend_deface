import React, { useEffect, useState, useContext } from "react";
import MyContext from "../../../auth/Context";
import UmpanBalikDetail from "./UmpanBalikDetail";
import { Modal, Button } from "react-bootstrap"; // Import modal dan button dari react-bootstrap
import Encrypt from "../../../auth/Random";

const UmpanBalik = () => {
  const { axiosJWT, token } = useContext(MyContext);
  const [messageData, setMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State untuk kontrol modal
  const [idChat, setidChat] = useState(null); // State untuk menyimpan chat yang dipilih
  const [sessionChat, setsessionChat] = useState(null); // State untuk menyimpan chat yang dipilih
  const [data, setData] = useState(null); // State for API data

  // Get the API data first
  const getData = async () => {
    const query = `SELECT id, api, jenis FROM bot.api WHERE jenis='flowise'`;
    const encryptedQuery = Encrypt(query.trim());

    try {
      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
        }${encryptedQuery}&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result[0].api); // Save the API
    } catch (error) {
      console.error("Error fetching data", error);
      setError(error);
    }
  };

  // Fetch messages only after data is set
  const fetchMessages = async () => {
    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_FLOWISE_FEEDBACK}&order=DESC&feedback=true&api=${data}`
      );
      setMessageData(
        response.data.filter((message) => message.role === "userMessage")
      ); // Filter by userMessage
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(); // Get API data first
  }, []);

  useEffect(() => {
    if (data) {
      fetchMessages(); // Only fetch messages after the API data is ready
    }
  }, [data]); // Trigger fetchMessages when 'data' changes

  if (loading) {
    return <p className="fw-bold mt-4">Mengambil data chat aisiteru...</p>; // Show loading message
  }

  if (error) {
    return <p className="fw-bold mt-4 text-danger">Error: {error.message}</p>; // Show error message
  }

  // Function to open modal and store selected chat
  const handleShowModal = (idchat, session) => {
    setidChat(idchat);
    setsessionChat(session);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {messageData.map((chat) => (
        <div
          key={chat.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Chat ID:</strong> {chat.id}
          </p>
          <p>
            <strong>Pertanyaan:</strong> {chat.content}
          </p>
          <p>
            <strong>Waktu:</strong>{" "}
            {new Date(chat.createdDate).toLocaleString()}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleShowModal(chat.chatflowid, chat.sessionId)}
            className="mt-2"
          >
            Details
          </Button>
        </div>
      ))}

      <Modal
        show={showModal}
        animation={false}
        backdrop="static"
        keyboard={false}
        size="lg"
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Feedback </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "300px", overflow: "scroll" }}>
          {idChat && (
            <UmpanBalikDetail
              chatId={idChat} // Send chat ID to UmpanBalikDetail
              sessionId={sessionChat} // Send session ID to UmpanBalikDetail
              api={data} // Send API data
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UmpanBalik;
