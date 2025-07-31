// components/SolidColorfulSpinner.js
import React from "react";
import { Spinner } from "react-bootstrap";

const SolidColorfulSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="d-flex gap-2">
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="success" />
        <Spinner animation="grow" variant="danger" />
        <Spinner animation="grow" variant="warning" />
        <Spinner animation="grow" variant="info" />
      </div>
    </div>
  );
};

export default SolidColorfulSpinner;
