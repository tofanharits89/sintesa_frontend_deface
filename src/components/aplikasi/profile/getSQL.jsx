export const getSQL = (queryParams) => {
  const { thang, dept, unit, prov, role, kodekppn, kodekanwil, select, from } =
    queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += select + fromClause + from;
  query += " WHERE kddept<>'999' and thang='" + thang + "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  if (groupByClause !== "") {
    query += " GROUP BY thang" + groupByClause;
  }
  return `${query}`;
};

export const getSQLJenbel = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectJenbel,
    fromJenbel,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectJenbel + fromClause + fromJenbel;
  query += " WHERE kddept<>'999' and thang='" + thang + "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  if (groupByClause !== "") {
    query += " GROUP BY thang, left(kdbkpk,2)" + groupByClause;
  } else {
    query += " GROUP BY thang, left(kdbkpk,2)";
  }
  return `${query}`;
};

export const getSQLProgram = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectProgram,
    fromProgram,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectProgram + fromClause + fromProgram;
  query += " WHERE kddept<>'999' and thang='" + thang + "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  if (groupByClause !== "") {
    query += " GROUP BY  kdprogram" + groupByClause;
  } else {
    query += " GROUP BY  kdprogram";
  }
  return `${query}`;
};

export const getSqlPerbandingan = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectPerbandingan,
    fromPerbandingan,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectPerbandingan + fromClause + fromPerbandingan;
  query +=
    " WHERE kddept<>'999' and thang between '" +
    parseInt(thang - 2) +
    "' and '" +
    thang +
    "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  if (groupByClause !== "") {
    query += " GROUP BY thang" + groupByClause;
  } else {
    query += " GROUP BY thang";
  }
  return `${query}`;
};

export const getSqlRpd = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectRpd,
    fromRpd,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectRpd + fromClause + fromRpd;
  query += " WHERE kddept<>'999' and thang='" + thang + "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  if (groupByClause !== "") {
    query += " GROUP BY thang" + groupByClause;
  } else {
    query += " GROUP BY thang";
  }
  return `${query}`;
};

export const getSqlSatker = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectSatker,
    fromSatker,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectSatker + fromClause + fromSatker;
  query += " WHERE kddept<>'999' and thang='" + thang + "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  if (groupByClause !== "") {
    query +=
      " GROUP BY thang, kdsatker " +
      groupByClause +
      " ORDER BY realisasi DESC LIMIT 5";
  } else {
    query += " GROUP BY thang,kdsatker ORDER BY realisasi DESC LIMIT 5";
  }
  return `${query}`;
};

export const getSqlTren = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectTren,
    fromTren,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectTren + fromClause + fromTren;
  query +=
    " WHERE kddept<>'999' and thang between '" +
    parseInt(thang - 2) +
    "' and '" +
    thang +
    "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  if (groupByClause !== "") {
    query += " GROUP BY thang" + groupByClause;
  } else {
    query += " GROUP BY thang";
  }
  return `${query}`;
};

export const getSqlBkpk = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectBkpk,
    fromBkpk,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectBkpk + fromClause + fromBkpk;
  query += " WHERE kddept<>'999' and thang='" + thang + "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  if (groupByClause !== "") {
    query +=
      " GROUP BY thang, kdbkpk " +
      groupByClause +
      " ORDER BY realisasi DESC LIMIT 5";
  } else {
    query += " GROUP BY thang,kdbkpk ORDER BY realisasi DESC LIMIT 5";
  }
  return `${query}`;
};

export const getSqlDukman = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectDukman,
    fromDukman,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let joinClause = "  ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectDukman + fromClause + fromDukman;
  query +=
    " WHERE kddept<>'999' and thang between '" +
    parseInt(thang - 2) +
    "' and '" +
    thang +
    "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }
  query += " UNION ALL ";
  query +=
    " SELECT kddept,kdunit, kdkanwil,'pagu_non_teknis' AS jenis_pagu,SUM(CASE WHEN kdprogram <> 'WA' THEN pagu ELSE 0 END) / SUM(pagu)*100 AS nilai_pagu" +
    fromClause +
    fromDukman;
  query +=
    " WHERE kddept<>'999' and thang between '" +
    parseInt(thang - 2) +
    "' and '" +
    thang +
    "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }
  // if (groupByClause !== "") {
  //   query += " GROUP BY thang" + groupByClause;
  // } else {
  //   query += " GROUP BY thang";
  // }
  return `${query}`;
};

export const getSqlTrenJenbel = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectTrenJenbel,
    fromTrenJenbel,
  } = queryParams;

  let query = "SELECT ";
  let fromClause = " FROM ";
  let whereClause = "";
  let groupByClause = "";

  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";

  whereClause = whereClause ? whereClause + " AND " + limitakses : limitakses;

  if (dept === "000") {
    query += "kddept";
    groupByClause += "";
  } else {
    query += "kddept";
    whereClause += " kddept = '" + dept + "'";
    groupByClause += ",kddept";
  }

  query += ",kdunit";

  if (unit !== "00") {
    whereClause += dept !== "000" ? " AND " : "";
    whereClause += "kdunit = '" + unit + "'";
  }
  groupByClause += unit === "00" ? "" : ",kdunit";

  // KANWIL
  query += ", kdkanwil";
  if (prov !== "00") {
    if (whereClause !== "") {
      whereClause += " AND ";
    }
    whereClause += "kdkanwil = '" + prov + "'";
  }
  groupByClause += prov === "00" ? "" : ",kdkanwil";

  query += selectTrenJenbel + fromClause + fromTrenJenbel;
  query +=
    " JOIN (SELECT SUM(pagu) AS total_pagu FROM dashboard_v3.pagu_real_dashboard WHERE kddept <> '999' and thang between '" +
    parseInt(thang - 2) +
    "' and '" +
    thang +
    "') AS total ON 1=1  ";

  query +=
    " WHERE kddept<>'999' and LEFT(kdbkpk,1)='5' and thang between '" +
    parseInt(thang - 2) +
    "' and '" +
    thang +
    "'";
  if (whereClause !== "") {
    query += " AND " + whereClause;
  }

  query += " GROUP BY left(kdbkpk,2)";

  return `${query}`;
};

export const getSqlIkpa = (queryParams) => {
  const {
    thang,
    dept,
    unit,
    prov,
    role,
    kodekppn,
    kodekanwil,
    selectIkpa,
    fromIkpa,
  } = queryParams;
  let limitakses =
    role === "3"
      ? "  kdkppn= '" + kodekppn + "'"
      : role === "2"
      ? "  kdkanwil= '" + kodekanwil + "'"
      : "";
  let query =
    "SELECT thang, aspek_kualitas_renc, aspek_kualitas_pelaksanaan, aspek_kualitas_hasil";
  let fromClause = " FROM ";
  let whereClause = "";
  let groupByClause = "";

  if (dept === "000" && unit === "00" && prov === "00") {
    fromClause += "dashboard_v3.pa_capaian_ik_all_" + thang + "_aspek";
  } else {
    if (dept !== "000" || unit !== "00" || (prov !== "00" && prov !== "")) {
      if (prov !== "00" && prov !== "") {
        fromClause +=
          "dashboard_v3.pa_capaian_ik_kanwil_" + parseInt(thang) + "_aspek";
        whereClause += " WHERE kdkanwil = '" + prov + "'";
      } else if (unit === "00") {
        fromClause +=
          "dashboard_v3.pa_capaian_ik_kl_" + parseInt(thang) + "_aspek";
        whereClause += " WHERE kddept = '" + dept + "'";
      } else {
        fromClause +=
          "dashboard_v3.pa_capaian_ik_es1_" + parseInt(thang) + "_aspek";
        whereClause +=
          " WHERE kddept = '" + dept + "' AND kdunit = '" + unit + "'";
      }
    } else {
      fromClause +=
        "dashboard_v3.pa_capaian_ik_kanwil_" + parseInt(thang) + "_aspek";
    }
  }

  query += selectIkpa + fromClause + fromIkpa + whereClause;

  query += " GROUP BY thang UNION ALL ";
  let query2 =
    "SELECT thang, aspek_kualitas_renc, aspek_kualitas_pelaksanaan, aspek_kualitas_hasil";
  let fromClause2 = " FROM ";
  let whereClause2 = "";

  if ((dept === "000" && unit === "00") || (prov !== "00" && prov !== "")) {
    fromClause2 += "dashboard_v3.pa_capaian_ik_all_" + (thang - 1) + "_aspek";
  } else {
    fromClause2 +=
      dept !== "000" && unit === "00" && (prov === "00" || prov !== "00")
        ? "dashboard_v3.pa_capaian_ik_kl_" + parseInt(thang - 1) + "_aspek"
        : dept !== "000" && unit !== "00" && prov === "00"
        ? "dashboard_v3.pa_capaian_ik_es1_" + parseInt(thang - 1) + "_aspek"
        : "dashboard_v3.pa_capaian_ik_kanwil_" + parseInt(thang - 1) + "_aspek";

    if (prov === "00" || dept !== "000" || unit !== "00") {
      whereClause2 += " WHERE ";
      whereClause2 += prov !== "00" ? "kdkanwil = '" + prov + "'" : "";
      whereClause2 +=
        dept !== "000" && prov === "00" ? "kddept = '" + dept + "'" : "";
      whereClause2 +=
        unit !== "00" && prov === "00" ? " AND kdunit = '" + unit + "'" : "";
    }
    if (dept === "000" && unit === "00" && prov !== "00") {
      whereClause2 += whereClause2 ? " AND " : " WHERE ";
      whereClause2 += "kdkanwil = '" + prov + "'";
    }
  }

  query2 += fromClause2 + whereClause2;
  query2 += " GROUP BY thang";

  return `${query + query2}`;
};
