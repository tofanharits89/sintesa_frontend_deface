// ChatbotForm.js
import React, { useState } from "react";

const ChatbotComponent = () => {
  const [userMessage, setUserMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://localhost:88/api/vectara/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!res.ok) {
        throw new Error("Error fetching data from the server");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "400px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h3>Chatbot</h3>

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ketik pertanyaan disini..."
          style={{ width: "80%", padding: "10px", borderRadius: "5px" }}
        />
        <button
          type="submit"
          style={{ width: "18%", padding: "10px", marginLeft: "2%" }}
        >
          Kirim
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div
          style={{
            marginTop: "10px",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h4>Response:</h4>
          <p>{JSON.stringify(response, null, 2)}</p>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;
