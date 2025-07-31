import { useContext, useEffect, useState } from "react";
import MyContext from "../../../auth/Context";
import Papa from "papaparse";
import { handleHttpError } from "../notifikasi/toastError";
import numeral from "numeral";

const GenerateCSV = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataerr, setErr] = useState(false);

  useEffect(() => {
    if (props.query3) {
      getData();
    }
  }, [props.query3]);

  const getData = async () => {
    setLoading(true);
    setErr(false);
    try {
      const encodedQuery = encodeURIComponent(props.query3);
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_CSV}${encodedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setLoading(false);
      props.status(true, data.length);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
      setErr(true);

      props.status(false);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      handleExportCSV();
      props.status(loading);
    }
  }, [data]);

  const handleExportCSV = () => {
    const config = {
      delimiter: ";", // Replace with the desired delimiter, e.g., ","
    };

    const keys = Object.keys(data[0]).map((key) => key.toUpperCase());

    const csvData = data.map((item) => {
      const row = Object.keys(item).map((key) => {
        let value = item[key];

        // Wrap in single quotes if the first character is '0'
        if (typeof value === "string" && value.charAt(0) === "0") {
          value = `'${value}`;
        }

        // List of columns to format as numbers
        const columnsToFormatAsNumber = [
          "pagu_dipa",
          "pagu",
          "blokir",
          "realisasi",
          "pagu_apbn",
          "jan",
          "feb",
          "mar",
          "apr",
          "mei",
          "jun",
          "jul",
          "ags",
          "sep",
          "okt",
          "nov",
          "des",
          "renc1",
          "real1",
          "renc2",
          "real2",
          "renc3",
          "real3",
          "renc4",
          "real4",
          "renc5",
          "real5",
          "renc6",
          "real6",
          "renc7",
          "real7",
          "renc8",
          "real8",
          "renc9",
          "real9",
          "renc10",
          "real10",
          "renc11",
          "real11",
          "renc12",
          "real12",
        ];

        // Check if the column should be formatted as a number
        if (
          columnsToFormatAsNumber.includes(key.toLowerCase()) &&
          typeof value === "string"
        ) {
          value = numeral(value).format(0); // Format as two decimal places
        }

        return value;
      });
      return row;
    });

    const formattedData = [keys, ...csvData];

    const csv = Papa.unparse(formattedData, config);

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = props.namafile ? `${props.namafile}.csv` : "data.csv";

    a.click();
    URL.revokeObjectURL(url);
  };

  return null;
};

export default GenerateCSV;
