import React, { useContext } from "react";
import MyContext from "./Context";
import { Navigate } from "react-router-dom";

const HalamanAdmin = ({ children }) => {
  const { role } = useContext(MyContext);

  if (role !== "X") {
    return <Navigate to="/v3/landing/dashboard" replace />;
  }

  return children;
};

export default HalamanAdmin;
