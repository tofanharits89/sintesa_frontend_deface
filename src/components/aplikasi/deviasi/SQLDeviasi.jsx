export const getSQLDeviasi = (queryParams) => {
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

    program,
    programradio,
    giat,
    kegiatanradio,
    output,
    outputradio,

    akun,
    akunradio,

    select,
    from,

    opsidept,
    opsikatadept,
    opsiunit,
    opsikataunit,
    opsidekon,
    dekonkondisi,

    opsikppn,
    opsikatakppn,
    kanwilkondisipilih,
    kanwilkondisi,
    opsikanwil,
    opsikatakanwil,
    opsisatker,
    opsikatasatker,

    programkondisipilih,
    programkondisi,
    opsiprogram,
    opsikataprogram,
    giatkondisipilih,
    giatkondisi,
    opsigiat,
    opsikatagiat,
    outputkondisipilih,
    outputkondisi,
    opsioutput,
    opsikataoutput,

    akunkondisipilih,
    akunkondisi,
    opsiakun,
    opsikataakun,

    pembulatan,
  } = queryParams;

  // KONDISI AWAL
  let query = "";
  let whereClause = "";
  let whereConditions = [];
  let groupByClause = "";
  let defaultSelect = `  `;

  // FUNGSI GENERATE SQL
  function buatQuery() {
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

    // FUNGSI KD PROGRAM

    if (program !== "XX") {
      kolom.push("a.kdprogram");
      group.push("a.kdprogram");
    }

    if (programradio === "2" && program !== "XX") {
      kolom.push("l.nmprogram");
      query += ` LEFT JOIN dbref.t_program_${thang} l on a.kddept = l.kddept and a.kdunit = l.kdunit and a.kdprogram =l.kdprogram`;
    }
    if (programradio === "3" && program !== "XX") {
      kolom.pop("a.kdprogram");
      kolom.push("l.nmprogram");
      query += ` LEFT JOIN dbref.t_program_${thang} l on a.kddept = l.kddept and a.kdunit = l.kdunit and a.kdprogram =l.kdprogram`;
    }
    if (programradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(program);
    const nilaiawalprogram = programkondisi.split(",");
    const formatprogram = nilaiawalprogram.map((str) => `'${str}'`);
    const hasilFormatprogram = formatprogram.join(",");

    if (opsiprogram === "pilihprogram") {
      if (program !== "XX") {
        whereConditions.push(
          program && program !== "00" ? `a.kdprogram = '${program}'` : ``
        );
      }
    } else if (opsiprogram === "kondisiprogram") {
      if (programkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdprogram NOT IN (${hasilFormatprogram
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          program !== "XX" ? ` a.kdprogram IN (${hasilFormatprogram})` : ""
        );
      }
    } else if (opsiprogram === "kataprogram") {
      opsikataprogram &&
        whereConditions.push(` l.nmprogram like '%${opsikataprogram}%'`);
    }

    // FUNGSI KD GIAT

    if (giat !== "XX") {
      kolom.push("a.kdgiat");
      group.push("a.kdgiat");
    }

    if (kegiatanradio === "2" && giat !== "XX") {
      kolom.push("m.nmgiat");
      query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
    }
    if (kegiatanradio === "3" && giat !== "XX") {
      kolom.pop("a.kdgiat");
      kolom.push("m.nmgiat");
      query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
    }
    if (kegiatanradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(giat);
    const nilaiawalgiat = giatkondisi.split(",");
    const formatgiat = nilaiawalgiat.map((str) => `'${str}'`);
    const hasilFormatgiat = formatgiat.join(",");

    if (opsigiat === "pilihgiat") {
      if (giat !== "XX") {
        whereConditions.push(
          giat && giat !== "00" ? `a.kdgiat = '${giat}'` : ``
        );
      }
    } else if (opsigiat === "kondisigiat") {
      if (giatkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdgiat NOT IN (${hasilFormatgiat
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          giat !== "XX" ? ` a.kdgiat IN (${hasilFormatgiat})` : ""
        );
      }
    } else if (opsigiat === "katagiat") {
      opsikatagiat &&
        whereConditions.push(` m.nmgiat like '%${opsikatagiat}%'`);
    }

    // FUNGSI KD OUTPUT

    if (output !== "XX") {
      kolom.push("a.kdoutput");
      group.push("a.kdoutput");
    }

    if (outputradio === "2" && output !== "XX") {
      kolom.push("n.nmoutput");
      query += ` LEFT JOIN dbref.t_output_${thang} n on  a.kdoutput = n.kdoutput and a.kdgiat=n.kdgiat`;
    }
    if (outputradio === "3" && output !== "XX") {
      kolom.pop("a.kdoutput");
      kolom.push("n.nmoutput");
      query += ` LEFT JOIN dbref.t_output_${thang} n on  a.kdoutput = n.kdoutput and a.kdgiat=n.kdgiat`;
    }
    if (outputradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(output);
    const nilaiawaloutput = outputkondisi.split(",");
    const formatoutput = nilaiawaloutput.map((str) => `'${str}'`);
    const hasilFormatoutput = formatoutput.join(",");

    if (opsioutput === "pilihoutput") {
      if (output !== "XX") {
        whereConditions.push(
          output && output !== "SEMUAOUTPUT" ? `a.kdoutput = '${output}'` : ``
        );
      }
    } else if (opsioutput === "kondisioutput") {
      if (outputkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdoutput NOT IN (${hasilFormatoutput
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          output !== "XX" ? ` a.kdoutput IN (${hasilFormatoutput})` : ""
        );
      }
    } else if (opsioutput === "kataoutput") {
      opsikataoutput &&
        whereConditions.push(` n.nmoutput like '%${opsikataoutput}%'`);
    }

    // FUNGSI KDAKUN
    // console.log(akun);
    if (akun === "AKUN") {
      if (jenlap !== "1") {
        kolom.push("a.kdakun");
        group.push("a.kdakun");
      } else {
        kolom.push("a.jnsbelanja as JENBEL");
        group.push("a.jnsbelanja");
      }
    } else if (akun === "BKPK") {
      kolom.push("LEFT(a.kdakun,4) as KDBKPK");
      group.push("LEFT(a.kdakun,4)");
    } else if (akun === "JENBEL") {
      if (jenlap !== "1") {
        group.push("LEFT(a.kdakun,2) ");
        kolom.push("LEFT(a.kdakun,2) as JENBEL");
      } else {
        group.push("LEFT(a.jnsbelanja,2) ");
        kolom.push("LEFT(a.jnsbelanja,2) as JENBEL");
      }
    }

    if (akunradio === "2" && akun === "AKUN") {
      if (jenlap !== "1") {
        kolom.push(" p.nmakun");
        query += ` LEFT JOIN dbref.t_akun_${thang} p on a.kdakun=p.kdakun`;
      } else {
        kolom.push("  q.nmgbkpk");
        query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.jnsbelanja,2)=q.kdgbkpk`;
      }
    } else if (akunradio === "2" && akun === "BKPK") {
      kolom.push("  o.nmbkpk");
      query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.kdakun,4)=o.kdbkpk`;
    } else if (akunradio === "2" && akun === "JENBEL") {
      kolom.push("  q.nmgbkpk");
      query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.kdakun,2)=q.kdgbkpk`;
    }

    if (akunradio === "3" && akun === "AKUN") {
      if (jenlap !== "1") {
        kolom.pop("a.kdakun");
        kolom.push(" p.nmakun");
        query += ` LEFT JOIN dbref.t_akun_${thang} p on a.kdakun=p.kdakun`;
      } else {
        kolom.pop("LEFT(a.jnsbelanja,2)");
        kolom.push("  q.nmgbkpk");
        query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.jnsbelanja,2)=q.kdgbkpk`;
      }
    } else if (akunradio === "3" && akun === "BKPK") {
      kolom.pop("LEFT(a.kdakun,4)");
      kolom.push("  o.nmbkpk");
      query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.kdakun,4)=o.kdbkpk`;
    } else if (akunradio === "3" && akun === "JENBEL") {
      kolom.pop("LEFT(a.kdakun,2)");
      kolom.push("  q.nmgbkpk");
      query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.kdakun,2)=q.kdgbkpk`;
    }
    if (akunradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalakun = akunkondisi.split(",");
    const formatakun = nilaiawalakun.map((str) => `'${str}'`);
    const hasilFormatakun = formatakun.join(",");
    const panjangAkun =
      akunkondisi.substring(0, 1) === "!"
        ? akunkondisi.substring(1).indexOf(",") !== -1
          ? akunkondisi.substring(1).indexOf(",") + 1 // Menambahkan 1 untuk menghitung karakter "!"
          : akunkondisi.substring(1).length
        : akunkondisi.indexOf(",") !== -1
          ? akunkondisi.indexOf(",")
          : akunkondisi.length;

    if (opsiakun === "kondisiakun") {
      if (akunkondisi.substring(0, 1) === "!") {
        if (jenlap !== "1") {
          whereConditions.push(
            `${
              akun === "AKUN"
                ? `LEFT(a.kdakun,${panjangAkun})`
                : akun === "BKPK"
                  ? `LEFT(a.kdakun,${panjangAkun})`
                  : `LEFT(a.kdakun,${panjangAkun})`
            } not in (${hasilFormatakun
              .replace(/[!'']/g, "")
              .split(",")
              .map((str) => `'${str}'`)
              .join(",")})`
          );
        } else {
          whereConditions.push(
            `${
              akun === "AKUN"
                ? `LEFT(a.jnsbelanja,${panjangAkun})`
                : akun === "BKPK"
                  ? `LEFT(a.jnsbelanja,${panjangAkun})`
                  : `LEFT(a.jnsbelanja,${panjangAkun})`
            } not in (${hasilFormatakun
              .replace(/[!'']/g, "")
              .split(",")
              .map((str) => `'${str}'`)
              .join(",")})`
          );
        }
      } else {
        if (jenlap !== "1") {
          whereConditions.push(
            `${
              akun === "AKUN"
                ? `LEFT(a.kdakun,${panjangAkun})`
                : akun === "BKPK"
                  ? `LEFT(a.kdakun,${panjangAkun})`
                  : `LEFT(a.kdakun,${panjangAkun})`
            }  in (${hasilFormatakun
              .replace(/[!'']/g, "")
              .split(",")
              .map((str) => `'${str}'`)
              .join(",")})`
          );
        } else {
          whereConditions.push(
            `${
              akun === "AKUN"
                ? `LEFT(a.jnsbelanja,${panjangAkun})`
                : akun === "BKPK"
                  ? `LEFT(a.jnsbelanja,${panjangAkun})`
                  : `LEFT(a.jnsbelanja,${panjangAkun})`
            }  in (${hasilFormatakun
              .replace(/[!'']/g, "")
              .split(",")
              .map((str) => `'${str}'`)
              .join(",")})`
          );
        }
      }
    } else if (opsiakun === "kataakun") {
      if (akun === "AKUN") {
        if (jenlap !== "1") {
          opsikataakun &&
            whereConditions.push(` p.nmakun like '%${opsikataakun}%'`);
        } else {
          opsikataakun &&
            whereConditions.push(` q.nmgbkpk like '%${opsikataakun}%'`);
        }
      } else if (akun === "BKPK") {
        opsikataakun &&
          whereConditions.push(` o.nmbkpk like '%${opsikataakun}%'`);
      } else {
        opsikataakun &&
          whereConditions.push(` q.nmgbkpk like '%${opsikataakun}%'`);
      }
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
    )}${select} FROM ${from} ${query} ${finalWhereClause}  ${groupByClause}`;
  }

  // PEMANGGIAN FUNGSI SQL SECARA MENYELURUH

  let kolom = [];
  let group = [];
  let tabel = "";

  const sqlQuery = buatQuery(
    kolom,
    dept,
    kdunit,
    akun,
    kppn,
    kanwil,
    satker,

    program,
    giat,
    output
  );

  return sqlQuery;
};
