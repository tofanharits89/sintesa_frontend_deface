import React, { useState, useEffect, useContext, useRef } from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import {
  Button,
  Card,
  Container,
  Form,
  Modal,
  Offcanvas,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import numeral from "numeral";
import { LoadingChart } from "../../layout/LoadingTable";
import RekamInefisiensi from "./rekamInefisiensi";
import RekamEinmaligh from "./rekamEinmaligh";
import EditInefisiensi from "./editInefisiensi";
import EditEinmaligh from "./editEinmaligh";
import Swal from "sweetalert2";

import NotifikasiSukses from "../notifikasi/notifsukses";
import RekamAdm from "./rekamAdm";
import EditAdm from "./editAdm";
import { KetWarna } from "./ketWarna";

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

const RekamAlokasi = ({ kdsatker, nmsatker, show, handleClose, darkMode }) => {
  const { axiosJWT, token, role } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [status, setStatus] = useState(false);
  const [status2, setStatus2] = useState(false);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState([]);
  const [ulang, setUlang] = useState(false);
  const [ulang2, setUlang2] = useState(false);
  const [flag, setFlag] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      setIsChecked2(false); // Uncheck the second checkbox if the first one is checked
    }
  };

  const handleCheckboxChange2 = (event) => {
    setIsChecked2(event.target.checked);
    if (event.target.checked) {
      setIsChecked(false); // Uncheck the first checkbox if the second one is checked
    }
  };

  const gridRef = useRef();

  const handleCloseAlokasi = () => {
    handleClose(ulang);
    setUlang(false);
  };

  useEffect(() => {
    getData();
  }, [kdsatker, isChecked, isChecked2]);

  // useEffect(() => {
  //   getData();
  // }, [ulang]);

  useEffect(() => {
    refresh && getData();
    setHighlightedRowIndex([]);
  }, [refresh]);

  const TutupModal = () => {
    setIsModalVisible(false);
    setUlang(false);
    // console.log("tutup modal", ulang);
  };

  const TutupModal2 = () => {
    setIsModalVisible2(false);
    setUlang(false);
    // console.log("tutup modal2", ulang);

    // setStatus2(false);
  };

  const handleRefresh = () => {
    setRefresh(true);
    setSearchTerm("");
  };

  const getData = async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      const rawQuery = `
  SELECT p.status,
         p.status2 AS statuseinmaligh,
REPLACE(p.kode, ' ', '') AS kode, REPLACE(p.kdindex, '', '') AS kdindex,
         p.uraian,
         p.volkeg,
         p.satkeg,
         p.hargasat,
         p.pagu,
         p.blokir,
         p.data_level,
         p.flag_alert,
         p.header,
         r.salah_akun,
         r.salah_satuan,
         r.tidak_informatif,
         p.status_item
  FROM spending_review.dt_pok_2025 p
  LEFT JOIN spending_review.dt_review_2025 r
    ON p.kdindex = r.posisi
  WHERE p.kdsatker='${kdsatker}'
    AND p.kdindex IS NOT NULL
    AND LENGTH(p.kdindex) >= 30
    AND SUBSTR(p.kdindex, 30, 2) IN ('52', '53')
  ORDER BY p.kdindex;
`;

      // Hapus newline dan tab agar jadi 1 baris
      const cleanQuery = rawQuery.replace(/\s+/g, " ").trim();

      // Enkripsi
      const encryptedQuery1 = Encrypt(cleanQuery);

      const encryptedQuery2 = Encrypt(
        `SELECT p.status, p.status2 AS statuseinmaligh, REPLACE(p.kode, ' ', '') AS kode, REPLACE(p.kdindex, '', '') AS kdindex, p.uraian, p.volkeg, p.satkeg, p.hargasat, p.pagu, p.blokir, p.data_level, p.flag_alert, p.header,r.salah_akun,r.salah_satuan,r.tidak_informatif,p.status_item FROM spending_review.dt_pok_2025 p LEFT JOIN spending_review.dt_review_2025 r ON p.kdindex = r.posisi WHERE p.kdsatker='${kdsatker}'  AND (p.status='true' OR p.status2='true'  OR p.status_item='true') ORDER BY p.kdindex`
      );

      const encryptedQuery = Encrypt(
        `SELECT p.status, p.status2 AS statuseinmaligh, REPLACE(p.kode, ' ', '') AS kode, REPLACE(p.kdindex, '', '') AS kdindex, p.uraian, p.volkeg, p.satkeg, p.hargasat, p.pagu, p.blokir, p.data_level, p.flag_alert, p.header, r.salah_akun,r.salah_satuan,r.tidak_informatif,p.status_item FROM spending_review.dt_pok_2025 p LEFT JOIN spending_review.dt_review_2025 r ON p.kdindex = r.posisi WHERE p.kdsatker='${kdsatker}' ORDER BY p.kdindex`
      );

      const query = isChecked2
        ? encryptedQuery2
        : isChecked
        ? encryptedQuery1
        : encryptedQuery;
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI}${query}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // let queryx;
      // if (isChecked2) {
      //   queryx = encryptedQuery2;
      //   console.log("==> Menggunakan Query 2 (ada status true)");
      // } else if (isChecked) {
      //   queryx = encryptedQuery1;
      //   console.log("==> Menggunakan Query 1 (rawQuery)");
      // } else {
      //   queryx = encryptedQuery;
      //   console.log("==> Menggunakan Query Default (semua data)");
      // }

      const tree = createTree(response.data.result);
      // console.log(response.data.result);

      setRowData(tree);
      setLoading(false);
      setRefresh(false);
    } catch (error) {
      console.log(error);
      handleHttpError(
        error.response?.status,
        (error.response?.data && error.response.data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend SRX"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataStatus();
  }, [kdsatker, ulang2]);

  const getDataStatus = async () => {
    let encryptedQuery = "";

    try {
      encryptedQuery = Encrypt(
        `SELECT a.kdsatker, a.status as flag FROM spending_review.ref_satker_dipa_2025 a  WHERE  a.kdsatker = '${kdsatker}' limit 1`
      );

      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI}${
              encryptedQuery ? encryptedQuery : encryptedQuery
            }`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      response.data.result.length > 0 && setFlag(response.data.result);
    } catch (error) {
      console.log(error);
      handleHttpError(
        error.response?.status,
        (error.response?.data && error.response.data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend SR"
      );
    }
  };

  const cleanHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };
  const createTree = (data) => {
    const map = new Map();
    const tree = [];
    let parentId = null;
    let id = null;
    let kunci = null;
    data.forEach((item) => {
      if (item.kdindex.length === 14) {
        parentId = null;
        id = item.kdindex.slice(0, 14);
      } else if (item.kdindex.length === 18) {
        parentId = item.kdindex.slice(0, 14);
        id = item.kdindex.slice(0, 18);
      } else if (item.kdindex.length === 21) {
        parentId = item.kdindex.slice(0, 18);
        id = item.kdindex.slice(0, 21);
      } else if (item.kdindex.length === 24) {
        parentId = item.kdindex.slice(0, 21);
        id = item.kdindex.slice(0, 24);
      } else if (item.kdindex.length === 27) {
        parentId = item.kdindex.slice(0, 24);
        id = item.kdindex.slice(0, 27);
      } else if (item.kdindex.length === 28) {
        parentId = item.kdindex.slice(0, 27);
        id = item.kdindex.slice(0, 28);
      } else if (item.kdindex.length === 29) {
        parentId = item.kdindex.slice(0, 27);
        id = item.kdindex.slice(0, 29);
      } else if (item.kdindex.length === 34) {
        parentId = item.kdindex.slice(0, 28);
        id = item.kdindex.slice(0, 34);
      } else if (item.kdindex.length === 35) {
        parentId = item.kdindex.slice(0, 29);
        id = item.kdindex.slice(0, 35);
      } else if (item.kdindex.length > 36) {
        parentId = item.kdindex.slice(0, 29);
        // id = item.kdindex.slice(0, 36);
        id =
          item.kdindex.slice(0, 36) +
          item.kdindex.slice(36, 39).replace(/\D/g, "");
      }

      map.set(item.kdindex, {
        kode: cleanHtmlTags(item.kode),
        volkeg: item.volkeg,
        pagu: item.pagu && parseFloat(item.pagu),
        satkeg: item.satkeg,
        hargasat: item.hargasat && parseFloat(item.hargasat),
        uraian: cleanHtmlTags(item.uraian),
        jumlah: item.kdindex.length,
        id: id,
        parentId: parentId,
        data_level: item.data_level,
        status: item.status,
        statuseinmaligh: item.statuseinmaligh,
        blokir: item.blokir,
        flag_alert: item.flag_alert,
        header: item.header,
        salah_akun: item.salah_akun,
        salah_satuan: item.salah_satuan,
        tidak_informatif: item.tidak_informatif,
        status_item: item.status_item,
      });
    });
    // console.log(data, "data");

    data.forEach((item) => {
      const parentId = item.kdindex;

      if (parentId && parentId !== item.kdindex && map.has(parentId)) {
        map.get(parentId).children.push(map.get(item.kdindex));
      } else {
        tree.push(map.get(item.kdindex));
      }
    });

    return tree;
  };

  const getDataPath = ({ id, parentId, jumlah }) => {
    const result = [id];
    let row = rowData.find((row) => row.id === parentId);

    while (row) {
      result.unshift(row.id);
      row = rowData.find((r) => r.id === row.parentId);
    }

    return result;
  };
  const expandAll = () => {
    gridRef.current?.api.expandAll();
  };

  const collapseAll = () => {
    gridRef.current?.api.collapseAll();
  };

  const onButtonClick = (rowData) => {
    const { status } = rowData;

    status === "true" ? setStatus(true) : setStatus(false);

    setSelectedRowData(rowData);
    setIsModalVisible(true);
  };

  const onButtonClick2 = (rowData) => {
    const { statuseinmaligh, status_item } = rowData;

    statuseinmaligh === "true" || status_item === "true"
      ? setStatus2(true)
      : setStatus2(false);
    setSelectedRowData(rowData);
    setIsModalVisible2(true);
  };

  // MULAI PERUBAN BUTTON

  const [updateSuccessPrefixes, setUpdateSuccessPrefixes] = useState([]);
  const updateRow = (updatedRow) => {
    const newPrefix = updatedRow.id?.substring(0, 35);
    // console.log("➡️ Updated Row Input:", updatedRow);

    setRowData((prevRows) => {
      // Ambil semua baris yang terdampak (berdasarkan prefix atau id)
      const affectedRowsBefore = prevRows.filter(
        (row) => row.id === updatedRow.id || row.id.startsWith(newPrefix)
      );
      // console.log(
      //   "🟡 Sebelum Update:",
      //   JSON.stringify(affectedRowsBefore, null, 2)
      // );

      const updatedRows = prevRows.map((row) => {
        // const isInduk = row.id.length === 35;
        const isInduk = row.id.length >= 35 && row.id.length <= 38;

        const isTargetRow = row.id === updatedRow.id;
        const samePrefix = row.id.startsWith(newPrefix);

        // 1. Simpan Salah Akun (semua dengan prefix sama)
        if (updatedRow.status_simpan === "salah_akun" && samePrefix) {
          const salah_akun = updatedRow.salah_akun === "TRUE";
          const jumlahKesalahan = salah_akun ? 1 : 0;
          return {
            ...row,
            statuseinmaligh: "true",
            salah_akun: "TRUE",
            ...(isInduk && { jumlahKesalahan }),
          };
        }

        // 2. Hapus Salah Akun (semua dengan prefix sama)
        if (updatedRow.status_hapus === "salah_akun" && samePrefix) {
          return {
            ...row,
            statuseinmaligh: "false",
            salah_akun: null,
            header: "false",
            jumlahKesalahan: 0,
          };
        }

        // 3. Simpan Inefisiensi
        if (updatedRow.status_simpan === "simpan_inefisensi" && isTargetRow) {
          return {
            ...row,
            status: "true",
          };
        }

        // 4. Hapus Inefisiensi
        if (updatedRow.status_simpan === "hapus_inefisiensi" && isTargetRow) {
          return {
            ...row,
            status: "false",
          };
        }

        // 5. Simpan Salah Satuan / Tidak Informatif (anak spesifik)
        if (updatedRow.status_simpan !== "salah_akun" && isTargetRow) {
          const salah_satuan = updatedRow.salah_satuan === "TRUE";
          const tidak_informatif = updatedRow.tidak_informatif === "TRUE";
          const jumlahKesalahan =
            (salah_satuan ? 1 : 0) + (tidak_informatif ? 1 : 0);

          return {
            ...row,
            statuseinmaligh: "true",
            status_item: "true",
            salah_satuan: salah_satuan ? "TRUE" : null,
            tidak_informatif: tidak_informatif ? "TRUE" : null,
            jumlahKesalahan,
          };
        }

        // 6. Hapus Salah Satuan / Tidak Informatif (anak spesifik)
        if (updatedRow.status_hapus !== "salah_akun" && isTargetRow) {
          return {
            ...row,
            statuseinmaligh: "false",
            status_item: "false",
            salah_satuan: null,
            tidak_informatif: null,
            jumlahKesalahan: 0,
          };
        }

        return row;
      });

      const affectedRowsAfter = updatedRows.filter(
        (row) => row.id === updatedRow.id || row.id.startsWith(newPrefix)
      );
      // console.log(
      //   "🟢 Sesudah Update:",
      //   JSON.stringify(affectedRowsAfter, null, 2)
      // );

      return updatedRows;
    });

    // Tambahkan prefix ke daftar sukses jika belum ada
    setUpdateSuccessPrefixes((prev) =>
      prev.includes(newPrefix) ? prev : [...prev, newPrefix]
    );
  };

  const renderActionsCell = (params) => {
    const idLevel = parseFloat(params.data.jumlah);
    if (idLevel < 32) return null;

    const tooltip2 = (
      <Tooltip id={`tooltip-review-${params.data.id}`}>
        {params.data.statuseinmaligh === "false" &&
        params.data.header === "false"
          ? "Rekam Data Kesalahan Administrasi"
          : params.data.statuseinmaligh === "true" &&
            params.data.header === "true"
          ? "Edit/ Hapus Data Kesalahan Administrasi"
          : "Baris ini merupakan baris Kesalahan Administrasi"}
      </Tooltip>
    );

    const salah_satuan = params.data.salah_satuan?.toString().toUpperCase();
    const salah_akun = params.data.salah_akun?.toString().toUpperCase();
    const tidak_informatif = params.data.tidak_informatif
      ?.toString()
      .toUpperCase();

    let btnClass = "btn-adm-default";
    // console.log(salah_akun, salah_satuan, tidak_informatif);

    if (salah_akun && salah_satuan && tidak_informatif) {
      btnClass = "btn-adm-all";
    } else if (
      salah_akun === "TRUE" &&
      (salah_satuan === "TRUE" || tidak_informatif === "TRUE")
    ) {
      btnClass = "btn-adm-dual";
    } else if (
      salah_akun ||
      salah_satuan ||
      tidak_informatif ||
      params.data.header === "TRUE"
    ) {
      btnClass = "btn-adm-success";
    } else if (
      salah_akun === "false" &&
      salah_satuan === "false" &&
      tidak_informatif === "false" &&
      params.data.header === "false"
    ) {
      btnClass = "btn-adm-warning";
    } else {
      btnClass = "btn-adm-danger";
    }

    const id = params.data.id;
    const idPrefix = id.substring(0, 35);

    if (
      (id.length === 35 && updateSuccessPrefixes.includes(id)) ||
      (id.length > 35 &&
        updateSuccessPrefixes.includes(idPrefix) &&
        updateSuccessPrefixes.includes(id))
    ) {
      if (salah_akun && salah_satuan && tidak_informatif) {
        btnClass = "btn-adm-all";
      } else if (
        salah_akun === "TRUE" &&
        (salah_satuan === "TRUE" || tidak_informatif === "TRUE")
      ) {
        btnClass = "btn-adm-dual";
      } else if (
        salah_akun ||
        salah_satuan ||
        tidak_informatif ||
        params.data.header === "TRUE"
      ) {
        btnClass = "btn-adm-success";
      } else if (
        salah_akun === "false" &&
        salah_satuan === "false" &&
        tidak_informatif === "false" &&
        params.data.header === "false"
      ) {
        btnClass = "btn-adm-warning";
      } else {
        btnClass = "btn-adm-danger";
      }
    }
    return (
      <OverlayTrigger overlay={tooltip2} placement="top">
        <Button
          className={`btn-adm ${btnClass}`}
          size="sm"
          onClick={() => {
            onButtonClick2(params.data);
          }}
        >
          ADM
        </Button>
      </OverlayTrigger>
    );
  };
  const renderActionsCellInefisiensi = (params) => {
    // console.log(params);
    const idLevel = parseFloat(params.data.jumlah);

    if (idLevel > 36) {
      const tooltip = (
        <Tooltip id={`tooltip-review-${params.data.id}`}>
          {params.data.status === null
            ? "Rekam Data Inefisiensi"
            : params.data.status === "true"
            ? "Edit/ Hapus Data Inefisiensi"
            : "Rekam Data Inefisiensi"}
        </Tooltip>
      );

      return (
        <>
          <OverlayTrigger overlay={tooltip} placement="top">
            <Button
              variant={`${
                params.data.status === null
                  ? "danger"
                  : params.data.status === "true"
                  ? "success"
                  : params.data.status === "FALSE"
                  ? "danger"
                  : "danger"
              }`}
              size="sm"
              className=" btn rounded-pill"
              // disabled
              style={{ width: "25px", padding: "1px" }}
              onClick={() => onButtonClick(params.data)}
            >
              {params.data.status === ""
                ? "I"
                : params.data.status === ""
                ? "I"
                : "I"}
            </Button>
          </OverlayTrigger>
        </>
      );
    }
    return null;
  };
  const getRowClass = (params) => {
    const { kode, uraian, volkeg, satkeg, id } = params.data;
    const rowNode = params.node;
    const classes = [];

    // Cek pencarian
    const isSearchMatch =
      kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uraian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volkeg?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      satkeg?.toLowerCase().includes(searchTerm.toLowerCase());

    if (searchTerm && rowNode.key && isSearchMatch) {
      classes.push("highlighted");
    }

    // Highlight hanya saat update
    const prefix = id?.slice(0, 35);
    if (updateSuccessPrefixes[prefix]) {
      classes.push("row-flash");
    }

    return classes.join(" ");
  };

  // console.log(flag.length > 0 && flag[0].flag);
  const resetFilters = () => {
    const api = gridRef.current.api;
    api.setFilterModel(null);
    api.onFilterChanged();
  };

  const highlightFilterResults = (params) => {
    const api = params.api;
    const filterModel = api.getFilterModel();

    const isFilterResult = Object.keys(filterModel).some((colId) => {
      const filter = filterModel[colId];
      const value = params.data[colId];

      return value
        .toString()
        .toLowerCase()
        .includes(filter && filter.filter.toLowerCase());
    });

    if (isFilterResult) {
      setHighlightedRowIndex(params.node.key);
    }

    return isFilterResult ? { background: "#D4F9C1" } : null;
  };

  const handleSelesai = async (kdsatker) => {
    const confirmText = `${
      flag.length > 0 && flag[0].flag === "true"
        ? "SR sudah diselesaikan, apakah akan di review kembali?"
        : "Apakah SR sudah diselesaikan?"
    }`;

    Swal.fire({
      title: "Konfirmasi Penyelesaian Review",
      html: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proses",
      cancelButtonText: "Batal",
      position: "top",
      customClass: {
        confirmButton: "btn btn-sm btn-primary",
        cancelButton: "btn btn-md btn-danger",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.patch(
            `${import.meta.env.VITE_REACT_APP_LOCAL_UPDATE}/${kdsatker}/${
              flag[0].flag
            }`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          NotifikasiSukses("Status Berhasil Diupdate");
          setUlang2(true);
          setTimeout(() => {
            setUlang2(false);
          }, 2000);
        } catch (error) {
          console.log(error);
          const { status, data } = error.response || {};
          handleHttpError(
            status,
            (data && data.error) ||
              "Terjadi Permasalahan Koneksi atau Server Backend"
          );
        }
      }
    });
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setHighlightedRowIndex([]); // Clear highlighted rows when the search term changes
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleCloseAlokasi}
        fullscreen={true}
        size="xl"
        className={`${(isModalVisible || isModalVisible2) && "dark-overlay"}`}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Review Data Alokasi <br />
            {nmsatker && nmsatker} ({kdsatker && kdsatker})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={` ${darkMode ? "dark-mode" : "bg-light"} fade-in`}
        >
          <Container fluid>
            {" "}
            {/* <KetWarna /> */}
            <Form.Group controlId="formSearch">
              <Form.Control
                type="text"
                placeholder="pencarian baris data secara global ..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form.Group>
            <div
              class="d-flex justify-content-between"
              style={{ alignItems: "center" }}
            >
              <div className="my-0">
                <Button
                  size="sm"
                  onClick={expandAll}
                  variant="secondary"
                  className="my-2"
                >
                  Expand All
                </Button>{" "}
                <Button
                  size="sm"
                  onClick={collapseAll}
                  variant="secondary"
                  className="my-2"
                >
                  Collapse All
                </Button>{" "}
                <Button
                  size="sm"
                  onClick={resetFilters}
                  variant="secondary"
                  className="my-2"
                >
                  Reset Filter
                </Button>{" "}
                <Button
                  size="sm"
                  onClick={handleRefresh}
                  variant="secondary"
                  className="my-2"
                >
                  Refresh Data
                </Button>{" "}
                <Button
                  size="sm"
                  onClick={() => !ulang2 && handleSelesai(kdsatker)}
                  variant={
                    flag.length > 0 && flag[0].flag === "true"
                      ? "success"
                      : "secondary"
                  }
                  className="my-2"
                >
                  {flag.length > 0 && flag[0].flag === "true"
                    ? "Selesai"
                    : "Posting"}
                </Button>{" "}
                <span
                  style={{ marginLeft: "8px", animation: "blink 1s infinite" }}
                >
                  {flag.length > 0 && flag[0].flag === "true"
                    ? ""
                    : "Proses Review"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span>
                  <Form.Check
                    type="checkbox"
                    label={
                      <span style={{ verticalAlign: "middle" }}>
                        Belanja 52 dan 53
                      </span>
                    }
                    className="custom-checkbox4 text-bold text-secondary mx-2"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </span>

                <span>
                  <Form.Check
                    type="checkbox"
                    label={
                      <span style={{ verticalAlign: "middle" }}>
                        Data Sudah Direview
                      </span>
                    }
                    className="custom-checkbox4 text-bold text-secondary mx-2"
                    checked={isChecked2}
                    onChange={handleCheckboxChange2}
                  />
                </span>
              </div>
            </div>
            {loading ? (
              <div>
                <LoadingChart /> <br />
                <LoadingChart />
                <br />
                <LoadingChart />
              </div>
            ) : (
              <div
                className="ag-theme-alpine"
                style={{ height: "850px", width: "100%" }}
              >
                <AgGridReact
                  rowData={rowData}
                  treeData={true}
                  animateRows={true}
                  groupDefaultExpanded={100}
                  getRowStyle={highlightFilterResults}
                  getRowId={(params) => params.data.id}
                  getRowClass={getRowClass}
                  onGridReady={onGridReady}
                  columnDefs={[
                    {
                      field: "kode",
                      headerName: "Kode",
                      cellClass: "text-center text-bold",
                      headerClass: "text-center text-bold",
                      minWidth: 100,
                      filterParams: {
                        filterOptions: ["contains"],
                        suppressAndOrCondition: true,
                      },
                    },
                    {
                      field: "uraian",
                      headerName: "Uraian",
                      cellClass: "text-start text-bold",
                      filter: "agTextColumnFilter",
                      minWidth: 100,
                      filterParams: {
                        filterOptions: ["contains"],
                        suppressAndOrCondition: true,
                      },
                    },
                    {
                      field: "volkeg",
                      headerName: "Volume",
                      cellClass: "text-center text-bold",
                      minWidth: 100,
                      filterParams: {
                        filterOptions: ["contains"],
                        suppressAndOrCondition: true,
                      },
                    },
                    {
                      field: "satkeg",
                      headerName: "Satuan",
                      cellClass: "text-center text-bold",
                      minWidth: 100,
                      filterParams: {
                        filterOptions: ["contains"],
                        suppressAndOrCondition: true,
                      },
                    },
                    {
                      field: "hargasat",
                      headerName: "Harga Satuan",
                      cellClass: "text-end text-bold",
                      minWidth: 100,
                      filterParams: {
                        filterOptions: ["contains"],
                        suppressAndOrCondition: true,
                      },
                      valueFormatter: (params) => {
                        if (typeof params.value === "number") {
                          return numeral(params.value).format("0,00");
                        }
                        return params.value;
                      },
                    },
                    {
                      field: "pagu",
                      headerName: "Jumlah",
                      cellClass: "text-end text-bold ",
                      minWidth: 100,
                      filterParams: {
                        filterOptions: ["contains"],
                        suppressAndOrCondition: true,
                      },
                      valueFormatter: (params) => {
                        if (typeof params.value === "number") {
                          return numeral(params.value).format("0,00");
                        }
                        return params.value;
                      },
                    },
                    {
                      headerName: "ADM",
                      width: 80,
                      maxWidth: 100,

                      cellClass: "text-center",
                      sortable: false,
                      filter: false,
                      cellRenderer: renderActionsCell,

                      // cellStyle: function (params) {
                      //   if (params.data.statuseinmaligh === "true") {
                      //     return { backgroundColor: "#FAF5BA" };
                      //   }

                      //   return {};
                      // },
                    },
                    {
                      headerName: "INF",
                      width: 60,
                      maxWidth: 70,

                      cellClass: "text-center kecil",
                      sortable: false,
                      filter: false,
                      cellRenderer: renderActionsCellInefisiensi,

                      // cellStyle: function (params) {
                      //   if (params.data.statuseinmaligh === "true") {
                      //     return { backgroundColor: "gray" };
                      //   }
                      //   // Jika tidak memenuhi kondisi, kembalikan objek kosong
                      //   return {};
                      // },
                    },
                    // {
                    //   headerName: "Inefisiensi",
                    //   cellRenderer: renderActionsCellInefisiensi,
                    //   sortable: false,
                    //   filter: false,
                    //   width: 10,
                    // },
                  ]}
                  defaultColDef={{ flex: 1, sortable: true, filter: true }}
                  getDataPath={getDataPath}
                  ref={gridRef}
                  quickFilterText={searchTerm}
                  // gridOptions={gridOptions}
                />
              </div>
            )}
          </Container>
        </Modal.Body>
      </Modal>
      {isModalVisible && !status && (
        <RekamInefisiensi
          isModalVisible={isModalVisible}
          selectedRowData={selectedRowData}
          TutupModal={TutupModal}
          setHighlightedRowIndex={setHighlightedRowIndex}
          setStatus={setStatus}
          setUlang={setUlang}
          updateRow={updateRow}
        />
      )}
      {isModalVisible && status && (
        <EditInefisiensi
          isModalVisible={isModalVisible}
          selectedRowData={selectedRowData}
          TutupModal={TutupModal}
          setHighlightedRowIndex={setHighlightedRowIndex}
          setStatus={setStatus}
          setUlang={setUlang}
          updateRow={updateRow}
        />
      )}
      {isModalVisible2 && (
        <RekamAdm
          isModalVisible2={isModalVisible2}
          selectedRowData={selectedRowData}
          setHighlightedRowIndex={setHighlightedRowIndex}
          TutupModal2={TutupModal2}
          setStatus2={setStatus2}
          setUlang={setUlang}
          updateRow={updateRow}
        />
      )}
      {isModalVisible2 && status2 && (
        <EditAdm
          isModalVisible2={isModalVisible2}
          selectedRowData={selectedRowData}
          setHighlightedRowIndex={setHighlightedRowIndex}
          TutupModal2={TutupModal2}
          setStatus2={setStatus2}
          setUlang={setUlang}
          status2={status2}
          updateRow={updateRow}
        />
      )}
      <style>
        {`
          .highlighted {
            background-color: #E3F4FC;
          }
        `}
      </style>
    </div>
  );
};

export default RekamAlokasi;
