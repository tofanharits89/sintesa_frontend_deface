import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import Notifikasi from "../../aplikasi/notifikasi/notif";
import Encrypt from "../../../auth/Random";
import { LoadingTable } from "../../layout/LoadingTable";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";

const Program = (props) => {
  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");

  useEffect(() => {
    props.query && getData();
  }, [props.query]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(props.query);
    const encryptedQuery = Encrypt(encodedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
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
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  return (
    <div className="scrollbar1" style={{ height: "275px", overflow: "scroll" }}>
      <div className="card">
        <div className="card-body">
          <div className="sticky-header-program1 is-sticky-program1 ">
            <h6 className="card-title text-center">REALISASI PER PROGRAM</h6>
          </div>
          {loading ? (
            <>
              <br /> <LoadingTable />
              <br /> <LoadingTable />
            </>
          ) : (
            <>
              {dataerror ? (
                <>
                  {Notifikasi(dataerror)}
                  <h6 className="text-danger text-center">{dataerror}</h6>
                </>
              ) : (
                <>
                  <table
                    className="table table-bordered table-striped table-hover table-responsive"
                    style={{ overflow: "scroll" }}
                  >
                    <thead className="text-center sticky-header-program1 is-sticky-program1 text-bold">
                      <tr>
                        <th className="col ikpa">TA</th>
                        <th className="col ikpa">KODE PROGRAM</th>
                        <th className="col ikpa">NAMA PROGRAM</th>
                        <th className="col ikpa">PERSENTASE</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {data.map((row, index) => (
                        <tr key={index}>
                          <td>{row.thang}</td>
                          <td>{row.kdprogram}</td>
                          <td>-</td>
                          <td className="text-end">
                            {numeral(row.realisasi).format("0,0.0")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Program;
