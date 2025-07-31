import React, { useState } from "react";
import { Modal, Alert } from "react-bootstrap";

export const TayangQuery = (props) => {
  const { showModal, closeModal } = props;
  const [loading, setLoading] = useState(false);

  const tutupModal = () => {
    closeModal();
  };

  return (
    <>
      <Modal
        onHide={tutupModal}
        show={showModal}
        backdrop="static"
        keyboard={false}
        size="xl"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px" }}></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "auto" }}>
          {loading ? (
            <div className="text-center"></div>
          ) : (
            <>
              <Alert variant="success text-center">{props.query} </Alert>
              <div className="text-center"></div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
