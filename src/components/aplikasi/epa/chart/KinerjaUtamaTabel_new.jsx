import React, { useContext, useState, useEffect } from "react";
import { Table, Card, Spinner, Container } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import { EPANOTIF } from "../../notifikasi/Omspan";
import Eselon1New from "../KinerjaUtama/eselon1_new";
import ProgramNew from "../KinerjaUtama/program_new";
import RoNew from "../KinerjaUtama/ro_new";
import SatkerNew from "../KinerjaUtama/satker_new";
import numeral from "numeral";
// Removed duplicate import of EditModalKinerja
import EditModalKinerja from "../modal/editModalKinerjaUtama";
import Encrypt from "../../../../auth/Random";

const EpaKinerjaUtama_new = ({
  thang,
  periode,
  dept,
  kdkanwil,
  kdkppn,
  kdsatker,
}) => {
  const { axiosJWT, token, username, dataEpa } = useContext(MyContext);
  // State untuk data dan loading/error tiap tabel
  const [satkerData, setSatkerData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [roData, setRoData] = useState([]);
  const [eselonData, setEselonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data untuk setiap tabel
  useEffect(() => {
    const fetchAll = async () => {
      // console.log("EpaKinerjaUtama_new props:", {
      //   thang,
      //   periode,
      //   dept,
      //   kdkanwil,
      //   kdkppn,
      //   kdsatker,
      // });

      setLoading(true);
      setError("");
      try {
        const satkerApi = import.meta.env.VITE_REACT_APP_LOCAL_PAGU_REAL_UTAMA;

        // Filter clauses
        let filterClause = "WHERE a.thang IN (2024, 2025)";
        // Apply dept filter if provided (no default value to skip)
        if (dept && dept !== "") {
          filterClause += ` AND a.kddept = '${dept}'`;
          // console.log("Applied dept filter:", dept);
        } else {
          // console.log("Skipped dept filter (value:", dept, ")");
        }
        // Only apply kdkanwil filter if it's not default values like "00" or empty
        if (kdkanwil && kdkanwil !== "" && kdkanwil !== "00") {
          filterClause += ` AND a.kdkanwil = '${kdkanwil}'`;
          // console.log("Applied kdkanwil filter:", kdkanwil);
        } else {
          // console.log("Skipped kdkanwil filter (value:", kdkanwil, ")");
        }
        // Only apply kdkppn filter if it's not default values like "000" or empty
        if (kdkppn && kdkppn !== "" && kdkppn !== "000") {
          filterClause += ` AND a.kdkppn = '${kdkppn}'`;
          // console.log("Applied kdkppn filter:", kdkppn);
        } else {
          // console.log("Skipped kdkppn filter (value:", kdkppn, ")");
        }
        if (kdsatker && kdsatker !== "") {
          filterClause += ` AND a.kdsatker = '${kdsatker}'`;
          // console.log("Applied kdsatker filter:", kdsatker);
        }

        // console.log("Final filterClause:", filterClause);

        // Satker - limit to top 10 by pagu terbesar
        const satkerQuery = `SELECT a.kdsatker AS KDSATKER, a.nmsatker AS NMSATKER, ROUND(SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2024, ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2024, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2024, ROUND(SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2025, ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2025, CASE WHEN SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2025, ROUND(SUM(a.blokir) / 10000000000, 2) AS blokir, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) > 0 THEN ROUND(((SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) - SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) / SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) * 100, 2) ELSE 0 END AS growth_yoy, '' AS keterangan FROM pagu_real_utama a ${filterClause} GROUP BY a.kdsatker, a.nmsatker ORDER BY SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) DESC LIMIT 10`;
        const satkerEncrypted = Encrypt(
          satkerQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
        );
        const satkerRes = await axiosJWT.get(
          `${satkerApi}?query=${satkerEncrypted}&user=${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000,
          }
        );
        setSatkerData(satkerRes.data.result || []);
        // console.log("Satker API Response:", satkerRes.data);
        // console.log("Satker Data Set:", satkerRes.data.result || []);

        // Program
        const programQuery = `SELECT a.kdprogram AS KDProgram, a.nmprogram AS NMProgram, ROUND(SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2024, ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2024, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2024, ROUND(SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2025, ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2025, CASE WHEN SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2025, ROUND(SUM(a.blokir) / 10000000000, 2) AS blokir, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) > 0 THEN ROUND(((SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) - SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) / SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) * 100, 2) ELSE 0 END AS growth_yoy, '' AS keterangan FROM pagu_real_utama a ${filterClause} GROUP BY a.kdprogram, a.nmprogram ORDER BY a.kdprogram`;
        const programEncrypted = Encrypt(
          programQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
        );
        const programRes = await axiosJWT.get(
          `${satkerApi}?query=${programEncrypted}&user=${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000,
          }
        );
        setProgramData(programRes.data.result || []);
        // console.log("Program API Response:", programRes.data);

        // RO
        const roApi = import.meta.env.VITE_REACT_APP_LOCAL_PAGU_REAL_SOUTPUT;

        // For soutput table, we need to join with pagu_real_utama to get filtering columns
        let roQuery;
        // Only apply filters if they have meaningful values (not default values)
        if (
          (dept && dept !== "") ||
          (kdkanwil && kdkanwil !== "" && kdkanwil !== "00") ||
          (kdsatker && kdsatker !== "")
        ) {
          // Use JOIN when filters are applied
          let joinFilterClause = "WHERE b.thang IN (2024, 2025)";
          if (dept && dept !== "") {
            joinFilterClause += ` AND b.kddept = '${dept}'`;
          }
          if (kdkanwil && kdkanwil !== "" && kdkanwil !== "00") {
            joinFilterClause += ` AND b.kdkanwil = '${kdkanwil}'`;
          }
          if (kdkppn && kdkppn !== "" && kdkppn !== "000") {
            joinFilterClause += ` AND b.kdkppn = '${kdkppn}'`;
          }
          if (kdsatker && kdsatker !== "") {
            joinFilterClause += ` AND b.kdsatker = '${kdsatker}'`;
          }

          roQuery = `SELECT COALESCE(a.ursoutput, 'Data tidak tersedia') AS RO, ROUND(SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2024, ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2024, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2024, ROUND(SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2025, ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2025, CASE WHEN SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2025, ROUND(SUM(a.blokir) / 10000000000, 2) AS blokir, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) > 0 THEN ROUND(((SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) - SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) / SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) * 100, 2) ELSE 0 END AS growth_yoy, '' AS keterangan FROM pagu_real_utama_soutput a INNER JOIN pagu_real_utama b ON a.thang = b.thang AND SUBSTRING(a.kdsoutput_gab, 1, 6) = b.kdsatker ${joinFilterClause} GROUP BY a.ursoutput ORDER BY a.ursoutput`;
        } else {
          // Use simple query when no filters applied
          roQuery = `SELECT COALESCE(a.ursoutput, 'Data tidak tersedia') AS RO, ROUND(SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2024, ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2024, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2024, ROUND(SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2025, ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2025, CASE WHEN SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2025, ROUND(SUM(a.blokir) / 10000000000, 2) AS blokir, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) > 0 THEN ROUND(((SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) - SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) / SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) * 100, 2) ELSE 0 END AS growth_yoy, '' AS keterangan FROM pagu_real_utama_soutput a WHERE a.thang IN (2024, 2025) GROUP BY a.ursoutput ORDER BY a.ursoutput`;
        }

        const roEncrypted = Encrypt(
          roQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
        );
        const roRes = await axiosJWT.get(
          `${roApi}?query=${roEncrypted}&user=${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000,
          }
        );
        setRoData(roRes.data.result || []);
        // console.log("RO API Response:", roRes.data);

        // Eselon1
        const eselonQuery = `SELECT a.kdunit AS KDUNIT, a.nmunit AS NMUNIT, ROUND(SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2024, ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2024, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2024, ROUND(SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2025, ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2025, CASE WHEN SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2025, ROUND(SUM(a.blokir) / 10000000000, 2) AS blokir, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) > 0 THEN ROUND(((SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) - SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) / SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) * 100, 2) ELSE 0 END AS growth_yoy, '' AS keterangan FROM pagu_real_utama a ${filterClause} GROUP BY a.kdunit, a.nmunit ORDER BY a.kdunit`;
        const eselonEncrypted = Encrypt(
          eselonQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
        );
        const eselonRes = await axiosJWT.get(
          `${satkerApi}?query=${eselonEncrypted}&user=${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000,
          }
        );
        setEselonData(eselonRes.data.result || []);
        // console.log("Eselon API Response:", eselonRes.data);
      } catch (err) {
        setError(err.message || "Gagal fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [
    thang,
    periode,
    dept,
    kdkanwil,
    kdkppn,
    kdsatker,
    token,
    axiosJWT,
    username,
  ]);

  return (
    <Container fluid>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          padding: "12px 0",
          borderBottom: "1px solid #eee",
        }}
      >
        <h5 className="fw-bold mb-0">Kinerja Utama</h5>
      </div>
      {/* Area scroll komponen */}
      <div style={{ height: "80vh", overflow: "auto", marginTop: 8 }}>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" /> Memuat data...
          </div>
        )}
        {error && <div className="text-danger text-center py-2">{error}</div>}
        <SatkerNew data={satkerData} />
        <ProgramNew data={programData} />
        <RoNew data={roData} />
        <Eselon1New data={eselonData} />
        <EditModalKinerja />
      </div>
    </Container>
  );
};

export default EpaKinerjaUtama_new;
