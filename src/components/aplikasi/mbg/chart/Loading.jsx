import React from "react";

// Animasi shimmer
const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// Style untuk shimmer besar
const shimmerBarStyle = {
  backgroundColor: "#e0e0e0",
  height: "24px",
  borderRadius: "12px",
  marginBottom: "26px",
  width: "78%", // Full width
  maxWidth: "600px", // Optional: batas maksimum
  position: "relative",
  overflow: "hidden",
};

// Style untuk shimmer provinsi (lebih kecil)
const shimmerProvStyle = {
  ...shimmerBarStyle,
  width: "30%",
};

const ShimmerBar = () => (
  <div style={shimmerBarStyle}>
    <style>{shimmerAnimation}</style>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background:
          "linear-gradient(to right, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%)",
        transform: "translateX(-100%)",
        animation: "shimmer 1.5s infinite",
      }}
    />
  </div>
);

const ShimmerProv = () => (
  <div style={shimmerProvStyle}>
    <style>{shimmerAnimation}</style>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background:
          "linear-gradient(to right, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%)",
        transform: "translateX(-100%)",
        animation: "shimmer 1.5s infinite",
      }}
    />
  </div>
);

export const LoadingMbg = () => (
  <div style={{ paddingTop: 16, paddingBottom: 16, marginTop: 10 }}>
    {Array.from({ length: 11 }).map((_, idx) => (
      <div
        key={idx}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ShimmerBar />
      </div>
    ))}
  </div>
);

export const LoadingProvinsi = () => (
  <div style={{ paddingTop: 16, paddingBottom: 16, marginTop: 10 }}>
    {Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ShimmerProv />
      </div>
    ))}
  </div>
);
