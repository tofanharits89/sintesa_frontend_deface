import React, { useState, useContext, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

import { Loading2 } from "../../layout/LoadingTable";

export default function DataKmkCabut25(props) {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    props.cek && getData();
  }, [props.cek]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.kmktunda,a.thangcabut,a.no_kmkcabut,a.tglcabut,a.uraiancabut FROM tkd25.ref_kmk_cabut a ORDER BY a.id DESC`
    );
    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_DAU25
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_DAU25
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);

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
    <Container
      className="my-0 "
      style={{ height: "400px", overflow: "scroll" }}
    >
      {loading ? (
        <>
          <Loading2 />
          <br />
          <Loading2 />
          <br />
          <Loading2 />
        </>
      ) : (
        <>
          <table className="fixhead table-striped table-hover">
            <thead>
              <tr>
                <th className="text-header text-center align-middle ">No</th>
                <th className="text-header text-center align-middle">
                  KMK Penundaan
                </th>
                <th className="text-header text-center align-middle">Tahun</th>
                <th className="text-header text-center align-middle">Tgl</th>
                <th className="text-header text-center align-middle">Nomor</th>
                <th className="text-header text-center align-middle">Uraian</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="align-middle text-center">{index + 1}</td>

                  <td className="align-middle text-center">{row.kmktunda}</td>
                  <td className="align-middle text-center">{row.thangcabut}</td>
                  <td className="align-middle text-center">{row.tglcabut}</td>
                  <td className="align-middle text-center">
                    {row.no_kmkcabut}
                  </td>
                  <td className="align-middle text-center">
                    {row.uraiancabut}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Container>
  );
}
