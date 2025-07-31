import React, { useEffect, useState } from "react";
import { useContext } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";

const UmpanBalikDetail = ({ chatId, sessionId, api }) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [messageData, setMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getData = async () => {
    const query = `SELECT chat_id, nama FROM bot.chats`;
    const encryptedQuery = Encrypt(query.trim());

    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA}${encryptedQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result); // Simpan hasil response API bot.chats
    } catch (error) {
      console.error("Error fetching data", error);
      setError(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_FLOWISE_FEEDBACK_DETAIL
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_FLOWISE_FEEDBACK_DETAIL
            }&order=DESC&feedback=true&chatId=${chatId}&sessionId=${sessionId}&api=${api}`
          : ""
      );
      setMessageData(
        response.data.filter((message) => message.role === "apiMessage")
      ); // Simpan hasil response API messages
      setLoading(false); // Set loading to false setelah data di-fetch
    } catch (error) {
      setError(error); // Tangkap error jika terjadi
      setLoading(false); // Set loading to false meskipun ada error
    }
  };

  useEffect(() => {
    getData(); // Ambil data chats
    fetchMessages(); // Ambil data messages
  }, []);

  // Fungsi untuk menggabungkan data chats dan messages
  const mergeData = () => {
    if (data && messageData) {
      const mergedData = data.map((chat) => {
        const relatedMessage = messageData.find(
          (message) => message.id === chat.chat_id
        );
        return {
          ...chat,
          messageId: relatedMessage ? relatedMessage.id : null,
          messageContent: relatedMessage ? relatedMessage.content : null,
        };
      });
      return mergedData;
    }
    return [];
  };

  // Memanggil fungsi merge dan menampilkan hasil
  const mergedResults = mergeData();
  // console.log(mergedResults);

  if (loading) {
    return <p className="fw-bold mt-4">Mengambil data chat aisiteru...</p>; // Show a loading message while waiting for the API response
  }

  if (error) {
    return <p className="fw-bold mt-4 text-danger">Error: {error.message}</p>; // Show an error message if there is an error
  }

  return (
    <div>
      {messageData.map((message) => {
        const {
          id,
          role,
          chatflowid,
          content,
          sourceDocuments,
          usedTools,
          chatId,
          sessionId,
          createdDate,
          feedback,
        } = message; // Destructuring properti dari setiap objek message

        return (
          <div
            key={id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {/* <p>
              <strong>ID:</strong> {id}
            </p> */}
            {/* <p>
              <strong>Role:</strong> {role}
            </p>
            <p>
              <strong>Chatflow ID:</strong> {chatflowid}
            </p> */}
            <p>
              <strong>Jawaban Aisiteru:</strong> {content}
            </p>
            {/* <p>
              <strong>Chat ID:</strong> {chatId}
            </p> */}
            {/* <p>
              <strong>Session ID:</strong> {sessionId}
            </p> */}
            <p>
              <strong>Waktu:</strong> {new Date(createdDate).toLocaleString()}
            </p>
            <p>
              <strong>Sumber Dokumen:</strong>{" "}
              {sourceDocuments ? sourceDocuments : "N/A"}
            </p>
            {/* <p>
              <strong>Used Tools:</strong> {usedTools ? usedTools : "N/A"}
            </p> */}
            {feedback ? (
              <div
                style={{
                  marginTop: "10px",
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "5px",
                  background:
                    feedback?.rating === "THUMBS_UP" ? "#f8fec4" : "#fcd6cd", // Background warna jika THUMBS_UP
                  fontWeight:
                    feedback?.rating === "THUMBS_UP" ? "bold" : "normal", // Tebal jika THUMBS_UP
                }}
              >
                <strong>Feedback:</strong>
                <p>
                  <strong>Rating:</strong>{" "}
                  <span>
                    {feedback?.rating === "THUMBS_UP"
                      ? "Jawaban Sesuai"
                      : "Jawaban Tidak Sesuai"}
                  </span>
                </p>
                <p>
                  <strong>Isi Feedback:</strong> {feedback.content}
                </p>
                <p>
                  <strong>Waktu:</strong>{" "}
                  {new Date(feedback.createdDate).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>
                <strong>Feedback:</strong> Belum Ada Feedback
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UmpanBalikDetail;
