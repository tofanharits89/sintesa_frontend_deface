export const getSQL = (queryParams) => {
  const {
    transaksi,
    transaksiradio,
    kecamatan,
    kecamatanradio,
    desa,
    desaradio,
    bansos,
    bansosradio,
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
    unitradio,
    dekon,
    dekonradio,
    prov,
    provradio,
    kabkota,
    kabkotaradio,
    kanwil,
    kanwilradio,
    kppn,
    kppnradio,
    kppnkondisipilih,
    kppnkondisi,
    satker,
    satkerradio,
    satkerkondisipilih,
    satkerkondisi,
    fungsi,
    fungsiradio,
    subfungsiradio,
    program,
    programradio,
    giat,
    kegiatanradio,
    output,
    outputradio,
    akun,
    akunradio,
    sdana,
    sdanaradio,
    sfungsi,
    select,
    from,
    pembulatan,
    opsidept,
    opsikatadept,
    opsiunit,
    opsikataunit,
    opsidekon,
    dekonkondisi,
    opsiprov,
    opsikataprov,
    provkondisipilih,
    provkondisi,
    opsikdkabkota,
    kdkabkotakondisi,
    unitkondisipilih,
    unitkondisi,
    opsikatasatker,
    opsisatker,
  } = queryParams;

  // KONDISI AWAL
  let query = "";
  let whereClause = "";
  let whereConditions = [];
  let groupByClause = "";
  let defaultSelect = `  FORMAT(SUM(a.pagu) / ${pembulatan}, 0) AS pagu,  FORMAT(SUM(a.blokir) / ${pembulatan}, 0) AS blokir `;

  // FUNGSI GENERATE SQL
  // console.log(bansos);
  function buatQuery() {
    // FUNGSI JENIS BANSOS

    if (bansos !== "XX") {
      kolom.push("a.kdjenis_transaksi");
      group.push("a.kdjenis_transaksi");
    }

    if (bansosradio === "2") {
      kolom.push("a.jenis_transaksi");
      query += ` LEFT JOIN dbref.t_jenis_bansos k ON a.kdjenis_transaksi=k.kdjenis_transaksi`;
    }
    if (bansosradio === "3") {
      kolom.pop("a.jenis_transaksi");
      kolom.push("a.jenis_transaksi");
      query += ` LEFT JOIN dbref.t_jenis_bansos k ON a.kdjenis_transaksi=k.kdjenis_transaksi`;
    }
    if (bansosradio === "4") {
      kolom = [];
      query += ` `;
    }

    if (bansos !== "XX") {
      whereConditions.push(
        bansos && bansos !== "00" ? `a.kdjenis_transaksi = '${bansos}'` : ``
      );
    }

    // FUNGSI DEPT

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

    // FUNGSI PROVINSI

    if (prov !== "XX") {
      kolom.push(" a.kdprov");
      group.push(" a.kdprov");
    }

    if (provradio === "2" && prov !== "XX") {
      kolom.push("e.nmprov");
      query += ` LEFT JOIN dbref.t_provinsi e on a.kdprov=e.kdprov`;
    }
    if (provradio === "3" && prov !== "XX") {
      kolom.pop(" a.kdprov");
      kolom.push("e.nmprov");
      query += ` LEFT JOIN dbref.t_provinsi e on a.kdprov=e.kdprov`;
    }
    if (provradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalprov = provkondisi.split(",");
    const formatprov = nilaiawalprov.map((str) => `'${str}'`);
    const hasilFormatprov = formatprov.join(",");

    if (opsiprov === "pilihprov") {
      if (prov !== "XX") {
        whereConditions.push(
          prov && prov !== "00" ? `a.kdprov = '${prov}'` : ``
        );
      }
    } else if (opsiprov === "kondisiprov") {
      if (provkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdprov NOT IN (${hasilFormatprov
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          prov !== "XX" ? ` a.kdprov IN (${hasilFormatprov})` : ""
        );
      }
    } else if (opsiprov === "kataprov") {
      opsikataprov &&
        whereConditions.push(` e.nmprov like '%${opsikataprov}%'`);
    }

    // FUNGSI KDKABKOTA

    if (kabkota !== "XX") {
      kolom.push("a.kdkabkota");
      group.push("a.kdkabkota");
    }

    if (kabkotaradio === "2" && kabkota !== "XX") {
      kolom.push("f.nmkabkota");
      query += ` LEFT JOIN dbref.t_kabkota_bansos f  on a.kdprov=f.kdprov AND a.kdkabkota=f.kdkabkota`;
    }
    if (kabkotaradio === "3" && kabkota !== "XX") {
      kolom.pop("a.kdkabkota");
      kolom.push("f.nmkabkota");
      query += ` LEFT JOIN dbref.t_kabkota_bansos f on  a.kdprov=f.kdprov AND a.kdkabkota=f.kdkabkota`;
    }

    const nilaiawalkdkabkota = kdkabkotakondisi.split(",");
    const formatkdkabkota = nilaiawalkdkabkota.map((str) => `'${str}'`);
    const hasilFormatkdkabkota = formatkdkabkota.join(",");

    if (opsikdkabkota === "pilihkdkabkota") {
      if (kabkota !== "XX") {
        whereConditions.push(
          kabkota && kabkota !== "ALL" ? `a.kdkabkota = '${kabkota}'` : ``
        );
      }
    } else if (opsikdkabkota === "kondisikdkabkota") {
      if (kdkabkotakondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdkabkota NOT IN (${hasilFormatkdkabkota
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          kabkota !== "XX" ? ` a.kdkabkota IN (${hasilFormatkdkabkota})` : ""
        );
      }
    }
    // console.log(kabkota);

    // FUNGSI KECAMATAN

    if (kecamatan !== "XX") {
      kolom.push("a.kdkec");
      group.push("a.kdkec");
    }

    if (kecamatanradio === "2") {
      kolom.push("h.nmkec");
      query += ` LEFT JOIN  dbref.t_kecamatan h on a.kdprov=h.kdprov and a.kdkabkota=h.kdkabkota and a.kdkec=h.kdkec`;
    }
    if (kecamatanradio === "3") {
      kolom.pop("h.nmkec");
      kolom.push("h.nmkec");
      query += ` LEFT JOIN  dbref.t_kecamatan h on a.kdprov=h.kdprov and a.kdkabkota=h.kdkabkota and a.kdkec=h.kdkec`;
    }
    if (kecamatanradio === "4") {
      kolom = [];
      query += ` `;
    }

    if (kecamatan !== "XX") {
      whereConditions.push(
        kecamatan && kecamatan !== "00" ? `a.kdkec = '${kecamatan}'` : ``
      );
    }

    // FUNGSI DESA

    if (desa !== "XX") {
      kolom.push("a.kddesa");
      group.push("a.kddesa");
    }

    if (desaradio === "2") {
      kolom.push("ii.nmdesa");
      query += ` LEFT JOIN  dbref.t_desa ii on a.kdprov=ii.kdprov and a.kdkabkota=ii.kdkabkota and a.kdkec=ii.kdkec and a.kddesa=ii.kddesa`;
    }
    if (desaradio === "3") {
      kolom.pop("ii.nmdesa");
      kolom.push("ii.nmdesa");
      query += ` LEFT JOIN  dbref.t_desa ii on a.kdprov=ii.kdprov and a.kdkabkota=ii.kdkabkota and a.kdkec=ii.kdkec and a.kddesa=ii.kddesa`;
    }
    if (desaradio === "4") {
      kolom = [];
      query += ` `;
    }

    if (desa !== "XX") {
      whereConditions.push(desa && desa !== "00" ? `a.kddesa = '${desa}'` : ``);
    }

    // FUNGSI TRANSAKSI

    if (transaksi !== "XX") {
      kolom.push("a.return_code");
      group.push("a.return_code");
    }

    if (transaksiradio === "2") {
      kolom.push("dd.nmreturn");
      query += ` LEFT JOIN dbref.t_return_status dd on a.return_code=dd.return_code`;
    }
    if (transaksiradio === "3") {
      kolom.pop("dd.nmreturn");
      kolom.push("dd.nmreturn");
      query += ` LEFT JOIN dbref.t_return_status dd on a.return_code=dd.return_code`;
    }
    if (transaksiradio === "4") {
      kolom = [];
      query += ` `;
    }

    if (transaksi !== "XX") {
      whereConditions.push(
        transaksi && transaksi !== "00" ? `a.return_code = '${transaksi}'` : ``
      );
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

      groupByClause = ` GROUP BY ${cleanKolom.join(
        ","
      )},a.kdjenis_transaksi ,a.tahap`;
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
    )}${select} FROM ${from} ${query} ${finalWhereClause} ${groupByClause}`;
  }
  //console.log(transaksi);
  // PEMANGGIAN FUNGSI SQL SECARA MENYELURUH

  let kolom = [];
  let group = [];

  const sqlQuery = buatQuery(
    kolom,
    dept,
    kdunit,
    prov,
    kabkota,
    kppn,
    kanwil,
    satker
  );

  return sqlQuery;
};
