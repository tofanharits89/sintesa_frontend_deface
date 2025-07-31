import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App";
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById("root"));
axios.defaults.withCredentials = true;
root.render(<App />);
