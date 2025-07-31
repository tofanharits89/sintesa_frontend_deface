import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";
import { Button, Container, Spinner, Form } from "react-bootstrap";

const CekKppn25 = (props) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");

  useEffect(() => {
    props.no_kmk && getData();
  }, [props.no_kmk, props.kppn]);

  const getData = async () => {
    setLoading(true);
    let filterKanwil = "";
    if (role === "2") {
      filterKanwil =
        props.where +
        (props.where ? " AND " : "") +
        `a.kdkanwil = '${kdkanwil}'`;
    } else {
      filterKanwil = props.where;
    }

    const encodedQuery =
      encodeURIComponent(`SELECT a.kdkppn AS KDKPPN, c.nmkppn AS NMKPPN, a.no_kmk
        FROM tkd25.ref_kmk_penundaan a INNER JOIN tkd25.alokasi_bulanan c ON a.kdkppn = c.kdkppn 
        where a.no_kmk='${props.no_kmk}'
        GROUP BY a.kdkppn, a.no_kmk`);

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
          ? `${
              import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      setLoading(false);
    }
  };
  return (
    <Form.Group controlId="inputState">
      <Form.Control
        value={props.kppn}
        as="select"
        className="form-select form-select-md text-select"
        name={props.name}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">-- Pilih KPPN --</option>
        {data.map((dau, index) => (
          <option key={index} value={dau.KDKPPN}>
            {dau.NMKPPN} ({dau.KDKPPN})
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CekKppn25;
