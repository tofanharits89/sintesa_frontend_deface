import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import { Loading2 } from "../../layout/LoadingTable";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

export default function Ikpa(props) {
  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");
  const [selisihData, setSelisihData] = useState([]); // State untuk data selisih

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
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };
  useEffect(() => {
    const selisih = [];
    for (let i = 1; i < data.length; i++) {
      const selisihTahun = {
        thang: data[i].thang,
        selisih_renc:
          parseInt(data[i - 1].aspek_kualitas_renc) -
          parseInt(data[i].aspek_kualitas_renc),
        selisih_pelaksanaan:
          data[i - 1].aspek_kualitas_pelaksanaan -
          data[i].aspek_kualitas_pelaksanaan,
        selisih_hasil:
          data[i - 1].aspek_kualitas_hasil - data[i].aspek_kualitas_hasil,
      };
      selisih.push(selisihTahun);
    }
    setSelisihData(selisih); // Set data selisih ke state
    setLoading(false);
  }, [data]);
  return (
    <div>
      <div className="card" style={{ height: "275px", overflow: "scroll" }}>
        <div className="card-body">
          <h6 className="card-title text-center">
            NILAI INDIKATOR PELAKSANAAN ANGGARAN
          </h6>
          {/* </h6> {dataerror ? <ToastError message={dataerror} /> : null} */}

          {loading ? (
            <>
              <Loading2 />
              <br /> <Loading2 />
              <br /> <Loading2 />
            </>
          ) : (
            <>
              <table
                className="table table-bordered table-striped table-hover table-responsive"
                style={{ overflow: "scroll" }}
              >
                <thead className="text-center">
                  <tr>
                    <th className="col ikpa">TA</th>
                    <th className="col ikpa">PERENCANAAN</th>
                    <th className="col ikpa">EFISIENSI</th>
                    <th className="col ikpa">EFEKTIFITAS</th>
                    <th className="col ikpa">NILAI</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.thang}</td>
                      <td>{row.aspek_kualitas_renc}</td>
                      <td>{row.aspek_kualitas_pelaksanaan}</td>
                      <td>{row.aspek_kualitas_hasil}</td>
                      <td>null</td>
                    </tr>
                  ))}
                  {/* Menampilkan selisih */}
                  {selisihData.map((tahun, index) => (
                    <tr key={index}>
                      <td></td>
                      <td>
                        {tahun.selisih_renc > 0 ? (
                          <i className="bi bi-arrow-up-circle-fill text-primary mx-1"></i>
                        ) : (
                          <i className="bi bi-arrow-down-circle-fill text-danger mx-1"></i>
                        )}
                        {numeral(tahun.selisih_renc).format("0.00")}
                      </td>
                      <td>
                        {tahun.selisih_pelaksanaan > 0 ? (
                          <i className="bi bi-arrow-up-circle-fill text-primary mx-1"></i>
                        ) : (
                          <i className="bi bi-arrow-down-circle-fill text-danger mx-1"></i>
                        )}
                        {numeral(tahun.selisih_pelaksanaan).format("0.00")}
                      </td>
                      <td>
                        {tahun.selisih_hasil > 0 ? (
                          <i className="bi bi-arrow-up-circle-fill text-primary mx-1"></i>
                        ) : (
                          <i className="bi bi-arrow-down-circle-fill text-danger mx-1"></i>
                        )}
                        {numeral(tahun.selisih_hasil).format("0.00")}
                      </td>
                      <td>null</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <h6 className="text-end ">
            {props.kanwil !== "00" && "*) data hanya untuk kanwil ybs"}
          </h6>
        </div>
      </div>
    </div>
  );
}
