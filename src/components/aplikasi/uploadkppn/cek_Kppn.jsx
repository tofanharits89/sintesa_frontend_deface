import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";
import { Form } from "react-bootstrap";

const CekKppn = (props) => {
  const { axiosJWT, token, username, role, kdkppn } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");
  // console.log(props.editkppn);
  useEffect(() => {
    getData();
  }, [props.kppn]);

  const getData = async () => {
    setLoading(true);
    let filterKppn = "";
    if (role === "3") {
      filterKppn = `WHERE kdkppn = '${kdkppn}'`;
    } else {
      filterKppn = "";
    }

    const encodedQuery = encodeURIComponent(
      `SELECT a.kdsatker, a.nmsatker, a.nmkppn, d.kdkppn 
      FROM tkd.t_satker_dtu a 
      INNER JOIN tkd.t_satker_lengkap d ON a.nmkppn = d.nmkppn 
      ${filterKppn}
      
      UNION ALL
      
      SELECT b.kdsatker, b.nmsatker, b.nmkppn, e.kdkppn 
      FROM tkd.t_satker_dtk b 
      INNER JOIN tkd.t_satker_lengkap e ON b.nmkppn = e.nmkppn 
      ${filterKppn}
      
      UNION ALL
      
      SELECT c.kdsatker, c.nmsatker, c.nmkppn, f.kdkppn 
      FROM tkd.t_satker_tkd c 
      INNER JOIN tkd.t_satker_lengkap f ON c.nmkppn = f.nmkppn 
      ${filterKppn}
      
      ORDER BY kdkppn;`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    //console.log(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
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
  // console.log(props.kppn);
  return (
    <Form.Group controlId="inputState">
      <Form.Control
        value={props.kppn}
        as="select"
        className="form-select form-select-md text-select"
        name={props.name}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">-- Pilih KPPN/ Satker --</option>
        {data.map((dau, index) => (
          <option key={index} value={`${dau.kdkppn}-${dau.kdsatker}`}>
            {dau.kdkppn} - {dau.nmsatker} ({dau.kdsatker})
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CekKppn;
