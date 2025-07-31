export const getSQLRevisi = (queryParams) => {
  const {
    thang,
    jenlap,
    role,
    kodekppn,
    kodekanwil,
    deptradio,
    dept,
    deptkondisipilih,
    deptkondisi,
    kdunit,
    unitkondisipilih,
    unitkondisi,
    unitradio,
    dekon,
    dekonradio,
    satker,
    satkerradio,
    satkerkondisi,
    kanwil,
    kanwilradio,
    kppn,
    kppnradio,
    kppnkondisipilih,
    kppnkondisi,
    opsikppn,
    opsikatakppn,
    kanwilkondisipilih,
    kanwilkondisi,
    opsikanwil,
    opsikatakanwil,
    select,
    from,
    opsidept,
    opsikatadept,
    opsiunit,
    opsikataunit,
    opsidekon,
    dekonkondisi,
    cutoff,
    jenisRevisi,
    subjenisRevisi,
    kewenanganRevisi,
    opsisatker,
    opsikatasatker,
  } = queryParams;
  // console.log(kanwil);
  // KONDISI AWAL
  let query = "";
  let whereClause = "";
  let whereConditions = [];
  let groupByClause = "";
  let defaultSelect = `   `;
  let tahunkhusus =
    thang == 2023 || thang === "2023"
      ? "t_jnsrevisi_2023"
      : thang == 2024 || thang === "2024"
        ? "t_jnsrevisi_2024"
        : thang == 2025 || thang === "2025"
          ? "t_jnsrevisi_2025"
          : "t_jnsrevisi";

  // FUNGSI GENERATE SQL
  function buatQuery() {
    // FUNGSI SELECT

    if (dept !== "XXX") {
      kolom.push("a.kddept");
      group.push("a.kddept");
    }

    if (deptradio === "2") {
      kolom.push("b.nmdept");
      query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.kddept=b.kddept`;
    }
    if (deptradio === "3") {
      kolom.pop("a.kddept");
      kolom.push("b.nmdept");
      query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.kddept=b.kddept`;
    }
    if (deptradio === "4") {
      kolom = [];
      group = [];
      query += ` `;
    }

    const nilaiawal = deptkondisi.split(",");
    const format = nilaiawal.map((str) => `'${str}'`);
    const hasilFormat = format.join(",");

    if (opsidept === "pilihdept") {
      if (dept !== "XXX") {
        whereConditions.push(
          dept && dept !== "000" ? `a.kddept = '${dept}'` : ``
        );
      }
    } else if (opsidept === "kondisidept") {
      if (deptkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kddept NOT IN (${hasilFormat
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          dept !== "XXX" ? ` a.kddept IN (${hasilFormat})` : ""
        );
      }
    } else if (opsidept === "katadept") {
      opsikatadept &&
        whereConditions.push(` b.nmdept like '%${opsikatadept}%'`);
    }

    // FUNGSI KDUNIT

    if (kdunit !== "XX") {
      kolom.push("a.kdunit");
      group.push("a.kdunit");
    }

    if (unitradio === "2" && kdunit !== "XX") {
      kolom.push("c.nmunit");
      query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.kddept=c.kddept and a.kdunit=c.kdunit`;
    }
    if (unitradio === "3" && kdunit !== "XX") {
      kolom.pop("a.kdunit");
      kolom.push("c.nmunit");
      query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.kddept=c.kddept and a.kdunit=c.kdunit`;
    }

    const nilaiawalunit = unitkondisi.split(",");
    const formatunit = nilaiawalunit.map((str) => `'${str}'`);
    const hasilFormatunit = formatunit.join(",");

    if (opsiunit === "pilihunit") {
      if (kdunit !== "XX") {
        whereConditions.push(
          kdunit && kdunit !== "00" ? `a.kdunit = '${kdunit}'` : ``
        );
      }
    } else if (opsiunit === "kondisiunit") {
      if (unitkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdunit NOT IN (${hasilFormatunit
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          kdunit !== "XX" ? ` a.kdunit IN (${hasilFormatunit})` : ""
        );
      }
    } else if (opsiunit === "kataunit") {
      opsikataunit &&
        whereConditions.push(` c.nmunit like '%${opsikataunit}%'`);
    }

    // FUNGSI DEKON

    if (dekon !== "XX") {
      kolom.push("a.kddekon");
      group.push("a.kddekon");
    }

    if (dekonradio === "2" && dekon !== "XX") {
      kolom.push("cc.nmdekon");
      query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
    }
    if (dekonradio === "3" && dekon !== "XX") {
      kolom.pop("a.kddekon");
      kolom.push("cc.nmdekon");
      query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
    }

    const nilaiawaldekon = dekonkondisi.split(",");
    const formatdekon = nilaiawaldekon.map((str) => `'${str}'`);
    const hasilFormatdekon = formatdekon.join(",");

    if (opsidekon === "pilihdekon") {
      if (dekon !== "XX") {
        whereConditions.push(
          dekon && dekon !== "00" ? `a.kddekon = '${dekon}'` : ``
        );
      }
    } else if (opsidekon === "kondisidekon") {
      if (dekonkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kddekon NOT IN (${hasilFormatdekon
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          dekon !== "XX" ? ` a.kddekon IN (${hasilFormatdekon})` : ""
        );
      }
    }

    // FUNGSI KANWIL

    if (kanwil !== "XX") {
      kolom.push("a.kdkanwil");
      group.push("a.kdkanwil");
    }

    if (kanwilradio === "2" && kanwil !== "XX") {
      kolom.push("g.nmkanwil");
      query += ` LEFT JOIN dbref.t_kanwil_2014 g ON a.kdkanwil=g.kdkanwil`;
    }
    if (kanwilradio === "3" && kanwil !== "XX") {
      kolom.pop("a.kdkanwil");
      kolom.push("g.nmkanwil");
      query += ` LEFT JOIN dbref.t_kanwil_2014 g ON a.kdkanwil=g.kdkanwil`;
    }
    if (kanwilradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalkanwil = kanwilkondisi.split(",");
    const formatkanwil = nilaiawalkanwil.map((str) => `'${str}'`);
    const hasilFormatkanwil = formatkanwil.join(",");

    if (opsikanwil === "pilihkanwil") {
      if (kanwil !== "XX") {
        whereConditions.push(
          kanwil && kanwil !== "00" ? `a.kdkanwil = '${kanwil}'` : ``
        );
      }
    } else if (opsikanwil === "kondisikanwil") {
      if (kanwilkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdkanwil NOT IN (${hasilFormatkanwil
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          kanwil !== "XX" ? ` a.kdkanwil IN (${hasilFormatkanwil})` : ""
        );
      }
    } else if (opsikanwil === "katakanwil") {
      opsikatakanwil &&
        whereConditions.push(` g.nmkanwil like '%${opsikatakanwil}%'`);
    }
    // FUNGSI KPPN

    if (kppn !== "XX") {
      kolom.push("a.kdkppn");
      group.push("a.kdkppn");
    }

    if (kppnradio === "2" && kppn !== "XX") {
      kolom.push("h.nmkppn");
      query += ` LEFT JOIN dbref.t_kppn_${thang} h ON a.kdkppn=h.kdkppn`;
    }
    if (kppnradio === "3" && kppn !== "XX") {
      kolom.pop("a.kdkppn");
      kolom.push("h.nmkppn");
      query += ` LEFT JOIN dbref.t_kppn_${thang} h ON a.kdkppn=h.kdkppn`;
    }
    if (kppnradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalkppn = kppnkondisi.split(",");
    const formatkppn = nilaiawalkppn.map((str) => `'${str}'`);
    const hasilFormatkppn = formatkppn.join(",");

    if (opsikppn === "pilihkppn") {
      if (kppn !== "XX") {
        whereConditions.push(
          kppn && kppn !== "00" ? `a.kdkppn = '${kppn}'` : ``
        );
      }
    } else if (opsikppn === "kondisikppn") {
      if (kppnkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdkppn NOT IN (${hasilFormatkppn
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          kppn !== "XX" ? ` a.kdkppn IN (${hasilFormatkppn})` : ""
        );
      }
    } else if (opsikppn === "katakppn") {
      opsikatakppn &&
        whereConditions.push(` h.nmkppn like '%${opsikatakppn}%'`);
    }

    // FUNGSI KDSATKER

    if (satker !== "XX") {
      kolom.push("a.kdsatker");
      group.push("a.kdsatker");
    }

    if (satkerradio === "2" && satker !== "XX") {
      kolom.push("i.nmsatker");
      query += ` LEFT JOIN dbref.t_satker_${thang} i ON a.kdsatker=i.kdsatker`;
    }
    if (satkerradio === "3" && satker !== "XX") {
      kolom.pop("a.kdsatker");
      kolom.push("i.nmsatker");
      query += ` LEFT JOIN dbref.t_satker_${thang} i ON a.kdsatker=i.kdsatker`;
    }
    if (satkerradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(satker);
    const nilaiawalsatker = satkerkondisi.split(",");
    const formatsatker = nilaiawalsatker.map((str) => `'${str}'`);
    const hasilFormatsatker = formatsatker.join(",");

    if (opsisatker === "pilihsatker") {
      if (satker !== "XX") {
        whereConditions.push(
          satker && satker !== "SEMUASATKER" ? `a.kdsatker = '${satker}'` : ``
        );
      }
    } else if (opsisatker === "kondisisatker") {
      if (satkerkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdsatker NOT IN (${hasilFormatsatker
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          satker !== "XX" ? ` a.kdsatker IN (${hasilFormatsatker})` : ""
        );
      }
    } else if (opsisatker === "katasatker") {
      opsikatasatker &&
        whereConditions.push(` i.nmsatker like '%${opsikatasatker}%'`);
    }

    if (thang > "2023" && select === "") {
      kolom.push(`
      a.revision_number REVISI_KE,
      a.dgb_kanwil_type KEWENANGAN,
      bb.nmkewrevisi NM_KEWENANGAN,
      a.kdjnsrevisi JENIS_REVISI,
      ccc.nmjnsrevisi NM_JENIS_REVISI,
      A.TANGGAL AS TANGGAL_POSTING,
      a.pagu AS PAGU
  `);

      query += ` LEFT JOIN dbref.t_kew_revisi bb ON a.dgb_kanwil_type=bb.kdkewrevisi LEFT JOIN dbref.${tahunkhusus} ccc on a.kdjnsrevisi=ccc.kdjnsrevisi`;
    }

    if (( thang === "2024" || thang === "2025") && select === "") {
      kolom.push(`
      a.revision_number REVISI_KE,
      a.dgb_kanwil_type KEWENANGAN,
      bb.nmkewrevisi NM_KEWENANGAN,
      a.kdjnsrevisi JENIS_REVISI,
      ccc.nmjnsrevisi NM_JENIS_REVISI,
      A.TANGGAL AS TANGGAL_POSTING
  `);

      query += ` LEFT JOIN dbref.t_kew_revisi bb ON a.dgb_kanwil_type=bb.kdkewrevisi LEFT JOIN dbref.${tahunkhusus} ccc on a.kdjnsrevisi=ccc.kdjnsrevisi`;
    }

    // FUNGSI DEPT

    if (cutoff !== "XX") {
      // group.push("a.bulan");
      whereConditions.push(
        cutoff && cutoff !== "00" ? `month(a.tanggal) = '${cutoff}'` : ``
      );
    }
    if (kewenanganRevisi !== "XX") {
      // group.push("a.bulan");
      whereConditions.push(
        kewenanganRevisi && kewenanganRevisi !== "00"
          ? `a.dgb_kanwil_type = '${kewenanganRevisi}'`
          : ``
      );
    }
    if (jenisRevisi !== "XX") {
      // group.push("a.bulan");
      whereConditions.push(
        jenisRevisi && jenisRevisi !== "00"
          ? `left(a.kdjnsrevisi,1) = '${jenisRevisi}'`
          : ``
      );
    }
    if (subjenisRevisi !== "XX") {
      // group.push("a.bulan");
      whereConditions.push(
        subjenisRevisi && subjenisRevisi !== "00"
          ? `a.kdjnsrevisi = '${subjenisRevisi}'`
          : ``
      );
    }

    // MULAI generate QUERY SQL
    if (kolom.length > 0) {
      defaultSelect = "," + defaultSelect;
    }
    if (group.length > 0) {
      const cleanKolom = group
        .map((col) => {
          const cleanCol = col.replace(/\sas\s.*/i, "").trim();

          if (!cleanCol.includes("CONCAT")) {
            return cleanCol;
          }
        })
        .filter(Boolean);

      groupByClause = ` GROUP BY ${cleanKolom.join(",")}`;
    }

    whereConditions = whereConditions.filter(
      (condition) => condition.trim() !== ""
    );

    const hasWhereClause = whereConditions.length > 0;

    let limitakses = "";
    let limitaksesall = "";

    if (role === "3") {
      limitakses = " and a.kdkppn= '" + kodekppn + "'";
    } else if (role === "2") {
      limitakses = " and a.kdkanwil= '" + kodekanwil + "'";
    }
    if (role === "3") {
      limitaksesall = " where a.kdkppn= '" + kodekppn + "'";
    } else if (role === "2") {
      limitaksesall = " where a.kdkanwil= '" + kodekanwil + "'";
    }

    const whereClause = hasWhereClause
      ? ` WHERE  ${whereConditions.join(" AND ")} ${limitakses}`
      : limitaksesall;

    const finalWhereClause =
      whereConditions.length === 1
        ? ` WHERE ${whereConditions[0]} ${limitakses} `
        : whereClause;

    return `SELECT ${kolom.join(
      ","
    )}${select} FROM ${from} ${query} ${finalWhereClause} `;
  }

  // PEMANGGIAN FUNGSI SQL SECARA MENYELURUH

  let kolom = [];
  let group = [];

  const sqlQuery = buatQuery(kolom, dept, kdunit, satker);

  return sqlQuery;
};
