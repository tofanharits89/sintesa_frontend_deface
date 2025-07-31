import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
  FloatingLabel,
} from "react-bootstrap";
import { io } from "socket.io-client";
import MyContext from "../../../../auth/Context";
import { UpdateMbg } from "../overview/tgUpdate";
import { TabUpdateMBG } from "./tabUpdateData";

const UpdateModal = ({ show, onClose, onSuccess }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      animation={false}
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5>Update Data MBG</h5>
          <h6 className={`text-primary`}>
            <UpdateMbg />
          </h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TabUpdateMBG />
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;
