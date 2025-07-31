import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Card,
  Table,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";

import numeral from "numeral";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import { ModalRekamKomoditas } from "./ModalRekamKomoditas";
import { EPANOTIF } from "../../notifikasi/Omspan";
import Swal from "sweetalert2";
import { TabKanwil } from "./TabKanwil";
export const LandingMbgKanwil = ({ show, onClose, onSuccess, tabdata }) => {
  const { axiosJWT, token, username, dataEpa } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        animation={false}
        size="xl"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Rekam Data</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <TabKanwil tabdata={tabdata} />
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};
