import React, { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate } from "react-router-dom";
import { handleHttpError } from "../notifikasi/toastError";
import MyContext from "../../../auth/Context";
import Notifikasi from "../notifikasi/notif";

const SearchBar = ({ data }) => {
  const { role, kdkppn, kdlokasi } = useContext(MyContext);

  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let filteredData = data;

    if (role === "3") {
      filteredData = data.filter((item) => item.kdkppn === kdkppn);
    } else if (role === "2") {
      filteredData = data.filter((item) => item.kdlokasi === kdlokasi);
    }

    setOptions(filteredData);
  }, [data, role, kdkppn, kdlokasi]);

  const handleInputChange = async (input) => {
    setLoading(true);

    try {
      let filteredData = data;

      if (role === "3") {
        filteredData = data.filter((item) => item.kdkppn === kdkppn);
      } else if (role === "2") {
        filteredData = data.filter((item) => item.kdlokasi === kdlokasi);
      }

      if (input.length >= 1) {
        filteredData = filteredData.filter(
          (item) =>
            item.kdsatker.includes(input) ||
            item.nmsatker.toLowerCase().includes(input.toLowerCase())
        );
      }

      setOptions(filteredData);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }

    setLoading(false);
  };

  const handleSelected = (selectedItems) => {
    setSelected(selectedItems);
  };

  useEffect(() => {
    if (selected.length > 0) {
      const selectedSatker = selected[0].kdsatker;
      const isSatkerInOptions = options.some(
        (option) => option.kdsatker === selectedSatker
      );

      if (isSatkerInOptions) {
        navigate("v3/Satker/Detail/" + selectedSatker);
      } else {
        Notifikasi("Satker ini diluar kewenangan Anda");
        setSelected([]);
      }
    }
  }, [selected]);

  const clearSearch = () => {
    setSelected([]);
    let filteredData = data;

    if (role === "3") {
      filteredData = data.filter((item) => item.kdkppn === kdkppn);
    } else if (role === "2") {
      filteredData = data.filter((item) => item.kdlokasi === kdlokasi);
    }

    setOptions(filteredData);
  };

  const renderOption = (option) => {
    return (
      <div className="fade-in">
        <div>{option.nmsatker}</div>
        <div>Kode Satker: {option.kdsatker}</div>
      </div>
    );
  };

  return (
    <>
      <Form className="search-form my-2 mx-4">
        <div className="position-relative w-100">
          <Typeahead
            id="search-autocomplete"
            labelKey={(option) => option.nmsatker}
            options={options}
            onInputChange={handleInputChange}
            onChange={handleSelected}
            placeholder="ketik kode atau nama satker ..."
            selected={selected}
            minLength={1}
            emptyLabel="data tidak ditemukan."
            renderMenuItemChildren={renderOption}
            filterBy={(option, props) =>
              option.kdsatker.includes(props.text) ||
              option.nmsatker.toLowerCase().includes(props.text.toLowerCase())
            }
          />
          {selected.length > 0 && (
            <div
              className="position-absolute top-0 end-0 p-2"
              onClick={clearSearch}
            >
              <i className="bi bi-x-circle-fill text-danger"></i>
            </div>
          )}
        </div>
      </Form>
      {loading && <span>Loading...</span>}
    </>
  );
};

export default SearchBar;
