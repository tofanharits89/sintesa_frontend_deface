import React, { useContext, useEffect, useState } from "react";
import MyContext from "./Context";
import { Navigate } from "react-router-dom";

const OnlineMode = ({ children }) => {
  const { offline } = useContext(MyContext);
  // console.log(offline);
  if (offline) {
    return <Navigate to="/v3/about/feedback" replace />;
  }

  return children;
};

export default OnlineMode;
