import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import { LoadingTable } from "../../layout/LoadingTable";
import Encrypt from "../../../auth/Random";
import Notifikasi from "../notifikasi/notif";
import { handleHttpError } from "../notifikasi/toastError";
// import ToastError from "../notifikasi/toastError";

export const JumlahDipa = (props) => {
  const navigate = useNavigate();
  const { axiosJWT, token, setPersentase } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sql] = useState(props.query);
  const [dataerror, setError] = useState("");

  useEffect(() => {
    props.query && getData();
  }, [props.query]);

  useEffect(() => {
    if (data && data.length > 0) {
      const persentase = data.map((item) => (item.realisasi / item.pagu) * 100);
      setPersentase(numeral(persentase).format("0,0.00"));
    }
  }, [data]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(props.query);
    const encryptedQuery = Encrypt(encodedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA}${encryptedQuery}`
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
    <>
      {/* {dataerror ? <>{ToastError(dataerror)}</> : null} */}
      {data.length > 0 ? (
        <>
          {loading ? (
            <LoadingTable />
          ) : (
            <>
              <div className="jumlahdipa2 fade-in">
                {" "}
                {data.map((item, index) => (
                  <div key={index}>
                    <div>
                      {" "}
                      {numeral(item.jumlahdipa).format("0,0")} &nbsp;DIPA
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <hr className="garis-dipa" />
          {loading ? (
            <LoadingTable />
          ) : (
            <>
              <div className="item-dipa fade-in">
                <div className="subitem-dipa">PAGU</div>
                {data.map((item, index) => (
                  <div key={index}>
                    <div>{numeral(item.pagu).format("0,0.00")} Triliun</div>
                  </div>
                ))}
              </div>{" "}
            </>
          )}
          <hr className="garis-dipa" />
          {loading ? (
            <LoadingTable />
          ) : (
            <>
              <div className="item-dipa fade-in">
                <div className="subitem-dipa">REALISASI</div>
                {data.map((item, index) => (
                  <div key={index}>
                    <div>
                      {numeral(item.realisasi).format("0,0.00")} Triliun
                    </div>
                  </div>
                ))}
              </div>{" "}
            </>
          )}{" "}
          <hr className="garis-dipa" />
          {loading ? (
            <LoadingTable />
          ) : (
            <>
              <div className="item-dipa fade-in">
                <div className="subitem-dipa">BLOKIR</div>
                null
                {/* {data.map((item, index) => (
                  <div key={index}>
                    <div>
                      {numeral(item.realisasi).format("0,0.00")} Triliun
                    </div>
                  </div>
                ))} */}
              </div>{" "}
            </>
          )}
        </>
      ) : (
        <>
          <div className="pie">
            <p className="null">
              Data Tidak Ada <br />
              <i className="bi bi-emoji-frown "></i>
            </p>
          </div>
        </>
      )}
    </>
  );
};
