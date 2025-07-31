import React, { useContext } from "react";
import MyContext from "./Context";
import { Navigate } from "react-router-dom";

const HanyaPusat = ({ children }) => {
  const { role } = useContext(MyContext);

  if (role === "2" || role === "3") {
    return <Navigate to="/v3/landing/dashboard" replace />;
  }

  return children;
};

export default HanyaPusat;
