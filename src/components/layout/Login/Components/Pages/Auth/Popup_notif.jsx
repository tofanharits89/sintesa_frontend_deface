import React from "react";

const PopupnotifLogin = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "2.5rem",
          borderRadius: "16px",
          maxWidth: "450px",
          width: "90%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          border: "1px solid #e2e8f0",
          animation: "slideIn 0.3s ease-out",
        }}
      >
        {/* Icon Warning */}
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            borderRadius: "50%",
            margin: "0 auto 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
          }}
        >
          ⚠️
        </div>

        {/* Title */}
        <h3
          style={{
            color: "#1f2937",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "1rem",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Pemberitahuan
        </h3>

        {/* Message */}
        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
            lineHeight: "1.6",
            marginBottom: "2rem",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Saat ini sintesa sedang mengalami gangguan yang mengakibatkan
          ketidakstabilan sistem, sedang dilakukan penanganan secara berkala
          oleh tim teknis, silahkan di refresh secara berkala apabila mengalami
          masalah/gangguan.
          <br />
          Mohon maaf atas ketidaknyamanannya.
          <br />
          <b>
            TTD,
            <br />
            Tim Pengembang
          </b>
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          style={{
            padding: "12px 32px",
            border: "none",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 14px rgba(59, 130, 246, 0.3)";
          }}
        >
          Siap, Mengerti
        </button>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default PopupnotifLogin;
