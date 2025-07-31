import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LoadingData } from "../../layout/LoadingTable";
import Notifikasi from "../notifikasi/notif";
import { handleHttpError } from "../notifikasi/toastError";

const Adk2019 = (props) => {
  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataError, setError] = useState("");
  const [error2, setError2] = useState(null);

  useEffect(() => {
    if (props.kdsatker) {
      getData();
    }
  }, [props.kdsatker]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      "SELECT kddept,kdunit,kdsatker,kddekon,norev,tg,jam,size,nmfile,folder,fileorpdf FROM monev2019.ftp_dipa_list_2019 WHERE kdsatker='" +
        props.kdsatker +
        "' ORDER BY tg,nmfile ASC;"
    );
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_CHART
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_CHART
            }${encodedQuery}`
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
  const handleDownload = async (file) => {
    const fileUrl = `${
      import.meta.env.VITE_REACT_APP_LOCAL_SOCKET
    }/file/download_adk?nmfile=${file}`;

    try {
      const response = await axiosJWT.get(fileUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      // Ambil nama file dari URL tanpa query parameter
      const parsedUrl = new URL(fileUrl);
      const queryFileName = parsedUrl.searchParams.get("nmfile");
      const fileName = queryFileName
        ? queryFileName.split("&")[0]
        : "downloaded_file";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError2("Terjadi kesalahan saat mendownload file. Silakan coba lagi.");
      {
        Notifikasi(error2);
      }
    }
  };

  return (
    <>
      {dataError ? (
        <>
          {Notifikasi(dataError)}
          <h6 className="text-danger text-center">{dataError}</h6>
        </>
      ) : (
        <>
          {loading ? (
            <>
              <LoadingData />
              <br />
            </>
          ) : (
            <>
              <Card style={{ height: "375px", overflow: "scroll" }}>
                <Card.Body>
                  <Card.Title>
                    <h5 className="card-title">DIPA TA. 2019</h5>
                  </Card.Title>
                  <Table
                    size="sm"
                    className="text-tengah table table-bordered table-striped table-hover table-responsive"
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama File</th>
                        <th>Revisi Ke</th>
                        <th>Folder</th>
                        <th>Tanggal</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 &&
                        data.map((column, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td>{index + 1}</td>
                              <td>{column.nmfile}</td>
                              <td>{column.norev}</td>
                              <td>{column.folder}</td>
                              <td>{column.tg}</td>
                              <td>
                                <i
                                  className="bi bi-download text-primary fw-bold"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    handleDownload(
                                      column.nmfile +
                                        "&folder=" +
                                        column.folder +
                                        "&tahun=2019"
                                    )
                                  }
                                ></i>
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Adk2019;
