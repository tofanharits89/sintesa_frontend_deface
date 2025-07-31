import React from "react";

const SintesaLogin = () => {
  return (
    <svg viewBox="0 0 300 100" style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="shimmerGradient">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="35%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.8" />
          <stop offset="65%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <mask id="shimmerMask">
          <text
            x="0"
            y="55%"
            dominantBaseline="middle"
            fontSize="35"
            fill="white"
          >
            sintesa
          </text>
        </mask>
      </defs>

      <text
        x="0"
        y="55%"
        dominantBaseline="middle"
        fontSize="35"
        fill="#3f51b5"
      >
        sintesa
      </text>

      <rect
        x="-100%"
        y="0"
        width="100%"
        height="100%"
        fill="url(#shimmerGradient)"
        mask="url(#shimmerMask)"
      >
        <animate
          attributeName="x"
          from="-100%"
          to="100%"
          dur="8s"
          repeatCount="indefinite"
          keyTimes="0;1"
          keySplines="0.25 0.1 0.25 1"
          calcMode="spline"
        />
      </rect>
    </svg>
  );
};

export default SintesaLogin;
