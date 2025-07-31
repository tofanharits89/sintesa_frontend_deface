export const getSQLTematikApbd = (queryParams) => {
  const {
    // tema,
    // temaradio,
    inflasiapbdradio,
    // stuntingradio,
    // mbgradio,
    // mp,
    // mpradio,
    // px,
    // pxradio,
    // kp,
    // kpradio,
    // pn,
    // pnradio,
    // prioritas,
    // ppradio,
    thang,
    jenlapapbd,
    role,
    kodekppn,
    kodekanwil,
    // deptradio,
    // dept,
    // deptkondisi,
    // kdunit,
    // unitkondisi,
    // unitradio,
    // dekon,
    // dekonradio,
    prov,
    provradio,
    kabkota,
    kabkotaradio,
    kanwil,
    kanwilradio,
    kppn,
    kppnradio,
    kppnkondisi,
    satker,
    satkerradio,
    satkerkondisi,
    fungsi,
    fungsiradio,
    sfungsi,
    subfungsiradio,
    program,
    programradio,
    giat,
    kegiatanradio,
    subgiat,
    subkegiatanradio,
    urusan,
    urusanradio,
    bidurusan,
    bidurusanradio,
    // output,
    // outputradio,
    // soutput,
    // soutputradio,
    // suboutputkondisipilih,
    // suboutputkondisi,
    // opsisuboutput,
    // opsikatasuboutput,
    // akun,
    // akunradio,
    level,
    levelradio,
    // sdana,
    // sdanaradio,
    select,
    from,
    // opsidept,
    // opsikatadept,
    // opsiunit,
    // opsikataunit,
    // opsidekon,
    // dekonkondisi,
    opsiprov,
    opsikataprov,
    provkondisi,
    opsikdkabkota,
    kdkabkotakondisi,
    opsikppn,
    opsikatakppn,
    kanwilkondisi,
    opsikanwil,
    opsikatakanwil,
    opsisatker,
    opsikatasatker,
    fungsikondisi,
    opsifungsi,
    opsikatafungsi,
    subfungsikondisi,
    opsisubfungsi,
    opsikatasubfungsi,
    programkondisi,
    opsiprogram,
    opsikataprogram,
    giatkondisi,
    opsigiat,
    opsikatagiat,
    subgiatkondisi,
    opsisubgiat,
    opsikatasubgiat,
    urusankondisi,
    opsiurusan,
    opsikataurusan,
    bidurusankondisi,
    opsibidurusan,
    opsikatabidurusan,
    // outputkondisi,
    // opsioutput,
    // opsikataoutput,
    // akunkondisi,
    // opsiakun,
    // opsikataakun,
    levelkondisi,
    opsilevel,
    opsikatalevel,
    // sdanakondisi,
    // opsisdana,
    pembulatan,
    // opsitema,
    opsiinflasiapbd,
    // opsistunting,
    // opsimbg,
    inf,
    stun,
    // mbg,
    miskin,
    // pemilu,
    // ikn,
    // pangan,
    // banper,
  } = queryParams;

  // KONDISI AWAL

  let query = "";
  let whereClause = "";
  let whereConditions = [];
  let groupByClause = "";
  let defaultSelect = ` sum(a.real1)/${pembulatan} as JAN, sum(a.real2)/${pembulatan} as FEB, 
  sum(a.real3)/${pembulatan} as MAR, sum(a.real4)/${pembulatan} as APR, sum(a.real5)/${pembulatan} as MEI, 
  sum(a.real6)/${pembulatan} as JUN, sum(a.real7)/${pembulatan} as JUL, sum(a.real8)/${pembulatan} as AGS, 
  sum(a.real9)/${pembulatan} as SEP, sum(a.real10)/${pembulatan} as OKT, sum(a.real11)/${pembulatan} as NOV, 
  sum(a.real12)/${pembulatan} as DES `;
  // console.log(thang);
  // LIMITASI USER ROLE

  // FUNGSI GENERATE SQL
  function buatQuery() {
    // FUNGSI DEPT

    // if (dept !== "XXX") {
    //   kolom.push("a.kddept");
    //   group.push("a.kddept");
    // }

    // if (deptradio === "2") {
    //   kolom.push("b.nmdept");
    //   query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.kddept=b.kddept`;
    // }
    // if (deptradio === "3") {
    //   kolom.pop("a.kddept");
    //   kolom.push("b.nmdept");
    //   query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.kddept=b.kddept`;
    // }
    // if (deptradio === "4") {
    //   kolom = [];
    //   query += ` `;
    // }

    // const nilaiawal = deptkondisi.split(",");
    // const format = nilaiawal.map((str) => `'${str}'`);
    // const hasilFormat = format.join(",");

    // if (opsidept === "pilihdept") {
    //   if (dept !== "XXX") {
    //     whereConditions.push(
    //       dept && dept !== "000" ? `a.kddept = '${dept}'` : ``
    //     );
    //   }
    // } else if (opsidept === "kondisidept") {
    //   if (deptkondisi.substring(0, 1) === "!") {
    //     whereConditions.push(
    //       `  a.kddept NOT IN (${hasilFormat
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   } else {
    //     whereConditions.push(
    //       dept !== "XXX" ? ` a.kddept IN (${hasilFormat})` : ""
    //     );
    //   }
    // } else if (opsidept === "katadept") {
    //   opsikatadept &&
    //     whereConditions.push(` b.nmdept like '%${opsikatadept}%'`);
    // }

    // // FUNGSI KDUNIT

    // if (kdunit !== "XX") {
    //   kolom.push("a.kdunit");
    //   group.push("a.kdunit");
    // }

    // if (unitradio === "2" && kdunit !== "XX") {
    //   kolom.push("c.nmunit");
    //   query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.kddept=c.kddept and a.kdunit=c.kdunit`;
    // }
    // if (unitradio === "3" && kdunit !== "XX") {
    //   kolom.pop("a.kdunit");
    //   kolom.push("c.nmunit");
    //   query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.kddept=c.kddept and a.kdunit=c.kdunit`;
    // }

    // const nilaiawalunit = unitkondisi.split(",");
    // const formatunit = nilaiawalunit.map((str) => `'${str}'`);
    // const hasilFormatunit = formatunit.join(",");

    // if (opsiunit === "pilihunit") {
    //   if (kdunit !== "XX") {
    //     whereConditions.push(
    //       kdunit && kdunit !== "00" ? `a.kdunit = '${kdunit}'` : ``
    //     );
    //   }
    // } else if (opsiunit === "kondisiunit") {
    //   if (unitkondisi.substring(0, 1) === "!") {
    //     whereConditions.push(
    //       `  a.kdunit NOT IN (${hasilFormatunit
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   } else {
    //     whereConditions.push(
    //       kdunit !== "XX" ? ` a.kdunit IN (${hasilFormatunit})` : ""
    //     );
    //   }
    // } else if (opsiunit === "kataunit") {
    //   opsikataunit &&
    //     whereConditions.push(` c.nmunit like '%${opsikataunit}%'`);
    // }

    // // FUNGSI DEKON

    // if (dekon !== "XX") {
    //   kolom.push("a.kddekon");
    //   group.push("a.kddekon");
    // }

    // if (dekonradio === "2" && dekon !== "XX") {
    //   kolom.push("cc.nmdekon");
    //   query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
    // }
    // if (dekonradio === "3" && dekon !== "XX") {
    //   kolom.pop("a.kddekon");
    //   kolom.push("cc.nmdekon");
    //   query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
    // }

    // const nilaiawaldekon = dekonkondisi.split(",");
    // const formatdekon = nilaiawaldekon.map((str) => `'${str}'`);
    // const hasilFormatdekon = formatdekon.join(",");

    // if (opsidekon === "pilihdekon") {
    //   if (dekon !== "XX") {
    //     whereConditions.push(
    //       dekon && dekon !== "00" ? `a.kddekon = '${dekon}'` : ``
    //     );
    //   }
    // } else if (opsidekon === "kondisidekon") {
    //   if (dekonkondisi.substring(0, 1) === "!") {
    //     whereConditions.push(
    //       `  a.kddekon NOT IN (${hasilFormatdekon
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   } else {
    //     whereConditions.push(
    //       dekon !== "XX" ? ` a.kddekon IN (${hasilFormatdekon})` : ""
    //     );
    //   }
    // }

    // FUNGSI PROVINSI

    if (prov !== "00") {
      kolom.push("a.kdprov");
      group.push("a.kdprov");
    }

    if (provradio === "2" && prov !== "00") {
      kolom.push("e.nmprov");
      query += ` LEFT JOIN dbref.t_provinsi_apbd e ON a.kdprov=e.kdprov`;
    }
    if (provradio === "3" && prov !== "00") {
      kolom.pop("a.kdprov");
      kolom.push("e.nmprov");
      query += ` LEFT JOIN dbref.t_provinsi_apbd e ON a.kdprov=e.kdprov`;
    }
    if (provradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalprov = provkondisi.split(",");
    const formatprov = nilaiawalprov.map((str) => `'${str}'`);
    const hasilFormatprov = formatprov.join(",");

    if (opsiprov === "pilihprov") {
      if (prov !== "00") {
        whereConditions.push(
          prov && prov !== "XX" ? `a.kdprov = '${prov}'` : ``
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
          prov !== "00" ? ` a.kdprov IN (${hasilFormatprov})` : ""
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
      query += ` LEFT JOIN dbref.t_kabkota_apbd f on a.kdprov=f.kdprov and a.kdkabkota=f.kdkabkota`;
    }
    if (kabkotaradio === "3" && kabkota !== "XX") {
      kolom.pop("a.kdkabkota");
      kolom.push("f.nmkabkota");
      query += ` LEFT JOIN dbref.t_kabkota_apbd f on a.kdprov=f.kdprov and a.kdkabkota=f.kdkabkota`;
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

    // if (satker !== "XX") {
    //   kolom.push("a.kdsatker");
    //   group.push("a.kdsatker");
    // }

    // if (satkerradio === "2" && satker !== "XX") {
    //   kolom.push("i.nmsatker");
    //   query += ` LEFT JOIN dbref.t_satker_apbd i ON a.kdsatker=i.kdsatker`;
    // }
    // if (satkerradio === "3" && satker !== "XX") {
    //   kolom.pop("a.kdsatker");
    //   kolom.push("i.nmsatker");
    //   query += ` LEFT JOIN dbref.t_satker_apbd i ON a.kdsatker=i.kdsatker`;
    // }
    // if (satkerradio === "4") {
    //   kolom = [];
    //   query += ` `;
    // }
    // //console.log(satker);
    // const nilaiawalsatker = satkerkondisi.split(",");
    // const formatsatker = nilaiawalsatker.map((str) => `'${str}'`);
    // const hasilFormatsatker = formatsatker.join(",");

    // if (opsisatker === "pilihsatker") {
    //   if (satker !== "XX") {
    //     whereConditions.push(
    //       satker && satker !== "SEMUASATKER" ? `a.kdsatker = '${satker}'` : ``
    //     );
    //   }
    // } else if (opsisatker === "kondisisatker") {
    //   if (satkerkondisi.substring(0, 1) === "!") {
    //     whereConditions.push(
    //       `  a.kdsatker NOT IN (${hasilFormatsatker
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   } else {
    //     whereConditions.push(
    //       satker !== "XX" ? ` a.kdsatker IN (${hasilFormatsatker})` : ""
    //     );
    //   }
    // } else if (opsisatker === "katasatker") {
    //   opsikatasatker &&
    //     whereConditions.push(` i.nmsatker like '%${opsikatasatker}%'`);
    // }

    // FUNGSI KDSATKER (SKPD)

    if (satker !== "XX") {
      kolom.push("a.nmsatker");
      group.push("a.kdsatker,a.nmsatker");
    }

    // if (satkerradio === "2" && satker !== "XX") {
    //   // kolom.push("a.nmsatker");
    //   // query += ` LEFT JOIN dbref.t_satker_apbd i ON a.kdsatker=i.kdsatker`;
    // }
    // if (satkerradio === "3" && satker !== "XX") {
    //   // kolom.pop("a.kdsatker");
    //   kolom.push("a.kdsatker,a.nmsatker");
    //   // query += ` LEFT JOIN dbref.t_satker_apbd i ON a.kdsatker=i.kdsatker`;
    // }
    // if (satkerradio === "4") {
    //   kolom = [];
    //   query += ` `;
    // }
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
        whereConditions.push(` a.nmsatker like '%${opsikatasatker}%'`);
    }

    // FUNGSI KDFUNGSI

    if (fungsi !== "XX") {
      kolom.push("a.kdfungsi");
      group.push("a.kdfungsi");
    }

    if (fungsiradio === "2" && fungsi !== "XX") {
      kolom.push("j.nmfungsi");
      query += ` LEFT JOIN dbref.t_fungsi_2014 j ON a.kdfungsi=j.kdfungsi`;
    }
    if (fungsiradio === "3" && fungsi !== "XX") {
      kolom.pop("a.kdfungsi");
      kolom.push("j.nmfungsi");
      query += ` LEFT JOIN dbref.t_fungsi_2014 j ON a.kdfungsi=j.kdfungsi`;
    }
    if (fungsiradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalfungsi = fungsikondisi.split(",");
    const formatfungsi = nilaiawalfungsi.map((str) => `'${str}'`);
    const hasilFormatfungsi = formatfungsi.join(",");

    if (opsifungsi === "pilihfungsi") {
      if (fungsi !== "XX") {
        whereConditions.push(
          fungsi && fungsi !== "SEMUAFUNGSI" ? `a.kdfungsi = '${fungsi}'` : ``
        );
      }
    } else if (opsifungsi === "kondisifungsi") {
      if (fungsikondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdfungsi NOT IN (${hasilFormatfungsi
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          fungsi !== "XX" ? ` a.kdfungsi IN (${hasilFormatfungsi})` : ""
        );
      }
    } else if (opsifungsi === "katafungsi") {
      opsikatafungsi &&
        whereConditions.push(` j.nmfungsi like '%${opsikatafungsi}%'`);
    }

    // FUNGSI KD SUB FUNGSI

    if (sfungsi !== "XX") {
      kolom.push("a.kdsfung");
      group.push("a.kdsfung");
    }

    if (subfungsiradio === "2" && sfungsi !== "XX") {
      kolom.push("k.nmsfung");
      query += ` LEFT JOIN dbref.t_sfung k on a.kdfungsi=k.kdfungsi and a.kdsfung=k.kdsfung`;
    }
    if (subfungsiradio === "3" && sfungsi !== "XX") {
      kolom.pop("a.kdsfung");
      kolom.push("k.nmsfung");
      query += ` LEFT JOIN dbref.t_sfung k on a.kdfungsi=k.kdfungsi and a.kdsfung=k.kdsfung`;
    }
    if (subfungsiradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(subfungsi);
    const nilaiawalsubfungsi = subfungsikondisi.split(",");
    const formatsubfungsi = nilaiawalsubfungsi.map((str) => `'${str}'`);
    const hasilFormatsubfungsi = formatsubfungsi.join(",");

    if (opsisubfungsi === "pilihsubfungsi") {
      if (sfungsi !== "XX") {
        whereConditions.push(
          sfungsi && sfungsi !== "SEMUASUBFUNGSI"
            ? `a.kdsfung = '${sfungsi}'`
            : ``
        );
      }
    } else if (opsisubfungsi === "kondisisubfungsi") {
      if (subfungsikondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdsfung NOT IN (${hasilFormatsubfungsi
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          sfungsi !== "XX" ? ` a.kdsfung IN (${hasilFormatsubfungsi})` : ""
        );
      }
    } else if (opsisubfungsi === "katasubfungsi") {
      opsikatasubfungsi &&
        whereConditions.push(` k.nmsfung like '%${opsikatasubfungsi}%'`);
    }

    // FUNGSI KDURUSAN

    if (urusan !== "XX") {
      kolom.push("a.kdurusan");
      group.push("a.kdurusan");
    }

    if (urusanradio === "2" && urusan !== "XX") {
      kolom.push("ur.nmurusan");
      query += ` LEFT JOIN dbref.t_urusan_apbd ur ON a.kdurusan=ur.kdurusan`;
    }
    if (urusanradio === "3" && urusan !== "XX") {
      kolom.pop("a.kdurusan");
      kolom.push("ur.nmurusan");
      query += ` LEFT JOIN dbref.t_urusan_apbd ur ON a.kdurusan=ur.kdurusan`;
    }
    if (urusanradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalurusan = urusankondisi.split(",");
    const formaturusan = nilaiawalurusan.map((str) => `'${str}'`);
    const hasilFormaturusan = formaturusan.join(",");

    if (opsiurusan === "pilihurusan") {
      if (urusan !== "XX") {
        whereConditions.push(
          urusan && urusan !== "SEMUAURUSAN" ? `a.kdurusan = '${urusan}'` : ``
        );
      }
    } else if (opsiurusan === "kondisiurusan") {
      if (urusankondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdurusan NOT IN (${hasilFormaturusan
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          urusan !== "XX" ? ` a.kdurusan IN (${hasilFormaturusan})` : ""
        );
      }
    } else if (opsiurusan === "kataurusan") {
      opsikataurusan &&
        whereConditions.push(` ur.nmurusan like '%${opsikataurusan}%'`);
    }

    // FUNGSI KD BID URUSAN

    if (bidurusan !== "XX") {
      kolom.push("a.kdbidurusan");
      group.push("a.kdbidurusan");
    }

    if (bidurusanradio === "2" && bidurusan !== "XX") {
      kolom.push("br.nmbidurusan");
      query += ` LEFT JOIN dbref.t_bidurusan_apbd br on a.kdurusan=br.kdurusan and a.kdbidurusan=br.kdbidurusan`;
    }
    if (bidurusanradio === "3" && bidurusan !== "XX") {
      kolom.pop("a.kdbidurusan");
      kolom.push("br.nmbidurusan");
      query += ` LEFT JOIN dbref.t_bidurusan_apbd br on a.kdurusan=br.kdurusan and a.kdbidurusan=br.kdbidurusan`;
    }
    if (bidurusanradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(subfungsi);
    const nilaiawalbidurusan = bidurusankondisi.split(",");
    const formatbidurusan = nilaiawalbidurusan.map((str) => `'${str}'`);
    const hasilFormatbidurusan = formatbidurusan.join(",");

    if (opsibidurusan === "pilihbidurusan") {
      if (bidurusan !== "XX") {
        whereConditions.push(
          bidurusan && bidurusan !== "SEMUABIDURUSAN"
            ? `a.kdbidurusan = '${bidurusan}'`
            : ``
        );
      }
    } else if (opsibidurusan === "kondisibidurusan") {
      if (bidurusankondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdbidurusan NOT IN (${hasilFormatbidurusan
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          bidurusan !== "XX"
            ? ` a.kdbidurusan IN (${hasilFormatbidurusan})`
            : ""
        );
      }
    } else if (opsibidurusan === "katabidurusan") {
      opsikatabidurusan &&
        whereConditions.push(` br.nmbidurusan like '%${opsikatabidurusan}%'`);
    }

    // FUNGSI KD PROGRAM

    if (program !== "XX") {
      kolom.push("a.kdprogram");
      group.push("a.kdprogram");
    }

    if (programradio === "2" && program !== "XX") {
      kolom.push("a.nmprogram");
      // query += ` LEFT JOIN dbref.t_program_${thang} l on a.kddept = l.kddept and a.kdunit = l.kdunit and a.kdprogram =l.kdprogram`;
    }
    if (programradio === "3" && program !== "XX") {
      kolom.pop("a.kdprogram");
      kolom.push("a.nmprogram");
      // query += ` LEFT JOIN dbref.t_program_${thang} l on a.kddept = l.kddept and a.kdunit = l.kdunit and a.kdprogram =l.kdprogram`;
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
        whereConditions.push(` a.nmprogram like '%${opsikataprogram}%'`);
    }

    // FUNGSI KD GIAT

    if (giat !== "XX") {
      kolom.push("a.kdgiat");
      group.push("a.kdgiat");
    }

    if (kegiatanradio === "2" && giat !== "XX") {
      kolom.push("a.nmgiat");
      // query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
    }
    if (kegiatanradio === "3" && giat !== "XX") {
      kolom.pop("a.kdgiat");
      kolom.push("a.nmgiat");
      // query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
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
        whereConditions.push(` a.nmgiat like '%${opsikatagiat}%'`);
    }

    // FUNGSI SUB KD GIAT
    if (subgiat !== "XX") {
      kolom.push("a.kdsubgiat");
      group.push("a.kdsubgiat");
    }

    if (subkegiatanradio === "2" && subgiat !== "XX") {
      kolom.push("a.nmsubgiat");
      // query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
    }
    if (subkegiatanradio === "3" && subgiat !== "XX") {
      kolom.pop("a.kdsubgiat");
      kolom.push("a.nmsubgiat");
      // query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
    }
    if (subkegiatanradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(giat);
    const nilaiawalsubgiat = subgiatkondisi.split(",");
    const formatsubgiat = nilaiawalsubgiat.map((str) => `'${str}'`);
    const hasilFormatsubgiat = formatsubgiat.join(",");

    if (opsisubgiat === "pilihsubgiat") {
      if (subgiat !== "XX") {
        whereConditions.push(
          subgiat && subgiat !== "00" ? `a.kdsubgiat = '${subgiat}'` : ``
        );
      }
    } else if (opsisubgiat === "kondisisubgiat") {
      if (subgiatkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdsubgiat NOT IN (${hasilFormatsubgiat
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          subgiat !== "XX" ? ` a.kdsubgiat IN (${hasilFormatsubgiat})` : ""
        );
      }
    } else if (opsisubgiat === "katasubgiat") {
      opsikatasubgiat &&
        whereConditions.push(` a.nmsubgiat like '%${opsikatasubgiat}%'`);
    }

    // // FUNGSI KD OUTPUT

    // if (output !== "XX") {
    //   kolom.push("a.kdoutput");
    //   group.push("a.kdoutput");
    // }

    // if (outputradio === "2" && output !== "XX") {
    //   kolom.push("n.nmoutput");
    //   query += ` LEFT JOIN dbref.t_output_${thang} n on  a.kdoutput = n.kdoutput and a.kdgiat=n.kdgiat`;
    // }
    // if (outputradio === "3" && output !== "XX") {
    //   kolom.pop("a.kdoutput");
    //   kolom.push("n.nmoutput");
    //   query += ` LEFT JOIN dbref.t_output_${thang} n on  a.kdoutput = n.kdoutput and a.kdgiat=n.kdgiat`;
    // }
    // if (outputradio === "4") {
    //   kolom = [];
    //   query += ` `;
    // }
    // // console.log(opsioutput);
    // const nilaiawaloutput = outputkondisi.split(",");
    // const formatoutput = nilaiawaloutput.map((str) => `'${str}'`);
    // const hasilFormatoutput = formatoutput.join(",");

    // if (opsioutput === "pilihoutput") {
    //   if (output !== "XX") {
    //     whereConditions.push(
    //       output && output !== "SEMUAOUTPUT" ? `a.kdoutput = '${output}'` : ``
    //     );
    //   }
    // } else if (opsioutput === "kondisioutput") {
    //   if (outputkondisi.substring(0, 1) === "!") {
    //     whereConditions.push(
    //       `  a.kdoutput NOT IN (${hasilFormatoutput
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   } else {
    //     whereConditions.push(
    //       output !== "XX" ? ` a.kdoutput IN (${hasilFormatoutput})` : ""
    //     );
    //   }
    // } else if (opsioutput === "kataoutput") {
    //   opsikataoutput &&
    //     whereConditions.push(` n.nmoutput like '%${opsikataoutput}%'`);
    // }
    // // FUNGSI SUB OUTPUT

    // let tahunrkakl = thang.toString().slice(-2);
    // if (soutput !== "XX") {
    //   kolom.push("a.kdsoutput");
    //   group.push("a.kdsoutput");
    // }

    // if (soutputradio === "2" && soutput !== "XX") {
    //   kolom.push("aa.ursoutput");
    //   query += ` LEFT JOIN dbdipa${tahunrkakl}.d_soutput aa ON a.kdsatker=aa.kdsatker AND a.kddept=aa.kddept AND a.kdunit=aa.kdunit AND a.kdprogram=aa.kdprogram AND a.kdgiat=aa.kdgiat AND a.kdoutput=aa.kdoutput AND a.kdsoutput=aa.kdsoutput`;
    // }
    // if (soutputradio === "3" && soutput !== "XX") {
    //   kolom.pop("a.kdsoutput");
    //   kolom.push("aa.ursoutput");
    //   query += ` LEFT JOIN dbdipa${tahunrkakl}.d_soutput aa ON a.kdsatker=aa.kdsatker AND a.kddept=aa.kddept AND a.kdunit=aa.kdunit AND a.kdprogram=aa.kdprogram AND a.kdgiat=aa.kdgiat AND a.kdoutput=aa.kdoutput AND a.kdsoutput=aa.kdsoutput`;
    // }
    // if (soutputradio === "4") {
    //   kolom = [];
    //   query += ` `;
    // }
    // //console.log(soutput);
    // const nilaiawalsoutput = suboutputkondisi.split(",");
    // const formatsoutput = nilaiawalsoutput.map((str) => `'${str}'`);
    // const hasilFormatsoutput = formatsoutput.join(",");

    // if (opsisuboutput === "pilihsuboutput") {
    //   if (soutput !== "XX") {
    //     whereConditions.push(
    //       soutput && soutput !== "SEMUASUBOUTPUT"
    //         ? `a.kdsoutput = '${soutput}'`
    //         : ``
    //     );
    //   }
    // } else if (opsisuboutput === "kondisisuboutput") {
    //   if (suboutputkondisi.substring(0, 1) === "!") {
    //     whereConditions.push(
    //       `  a.kdsoutput NOT IN (${hasilFormatsoutput
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   } else {
    //     whereConditions.push(
    //       soutput !== "XX" ? ` a.kdsoutput IN (${hasilFormatsoutput})` : ""
    //     );
    //   }
    // } else if (opsisuboutput === "katasuboutput") {
    //   opsikatasuboutput &&
    //     whereConditions.push(` aa.ursoutput like '%${opsikatasuboutput}%'`);
    // }
    // FUNGSI KDAKUN
    // if (akun === "AKUN") {
    //   kolom.push("a.kdakun");
    //   group.push("a.kdakun");
    // } else if (akun === "BKPK") {
    //   kolom.push("LEFT(a.kdakun,4) as KDBKPK");
    //   group.push("LEFT(a.kdakun,4)");
    // } else if (akun === "JENBEL") {
    //   kolom.push("LEFT(a.kdakun,2) as JENBEL");
    //   group.push("LEFT(a.kdakun,2) ");
    // }

    // if (akunradio === "2" && akun === "AKUN") {
    //   kolom.push(" p.nmakun");
    //   query += ` LEFT JOIN dbref.t_akun_${thang} p on a.kdakun=p.kdakun`;
    // } else if (akunradio === "2" && akun === "BKPK") {
    //   kolom.push("  o.nmbkpk");
    //   query += ` LEFT JOIN dbref.t_bkpk_${thang} o on a.kdbkpk=o.kdbkpk`;
    // } else if (akunradio === "2" && akun === "JENBEL") {
    //   kolom.push("  q.nmgbkpk");
    //   query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.kdakun,2)=q.kdgbkpk`;
    // }

    // if (akunradio === "3" && akun === "AKUN") {
    //   kolom.pop("a.kdakun");
    //   kolom.push(" p.nmakun");
    //   query += ` LEFT JOIN dbref.t_akun_${thang} p on a.kdakun=p.kdakun`;
    // } else if (akunradio === "3" && akun === "BKPK") {
    //   kolom.pop("LEFT(a.kdakun,4)");
    //   kolom.push("  o.nmbkpk");
    //   query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.kdbkpk,4)=o.kdbkpk`;
    // } else if (akunradio === "3" && akun === "JENBEL") {
    //   kolom.pop("LEFT(a.kdakun,2)");
    //   kolom.push("  q.nmgbkpk");
    //   query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.kdakun,2)=q.kdgbkpk`;
    // }
    // if (akunradio === "4") {
    //   kolom = [];
    //   query += ` `;
    // }

    // const nilaiawalakun = akunkondisi.split(",");
    // const formatakun = nilaiawalakun.map((str) => `'${str}'`);
    // const hasilFormatakun = formatakun.join(",");
    // const panjangAkun =
    //   akunkondisi.substring(0, 1) === "!"
    //     ? akunkondisi.substring(1).indexOf(",") !== -1
    //       ? akunkondisi.substring(1).indexOf(",") + 1 // Menambahkan 1 untuk menghitung karakter "!"
    //       : akunkondisi.substring(1).length
    //     : akunkondisi.indexOf(",") !== -1
    //       ? akunkondisi.indexOf(",")
    //       : akunkondisi.length;

    // if (opsiakun === "kondisiakun") {
    //   if (akunkondisi.substring(0, 1) === "!") {
    //     whereConditions.push(
    //       `${akun === "AKUN"
    //         ? `LEFT(a.kdbkpk,${panjangAkun})`
    //         : akun === "BKPK"
    //           ? `LEFT(a.kdbkpk,${panjangAkun})`
    //           : `LEFT(a.kdbkpk,${panjangAkun})`
    //       } not in (${hasilFormatakun
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   } else {
    //     whereConditions.push(
    //       `${akun === "AKUN"
    //         ? `LEFT(a.kdbkpk,${panjangAkun})`
    //         : akun === "BKPK"
    //           ? `LEFT(a.kdbkpk,${panjangAkun})`
    //           : `LEFT(a.kdbkpk,${panjangAkun})`
    //       }  in (${hasilFormatakun
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   }
    // } else if (opsiakun === "kataakun") {
    //   if (akun === "AKUN") {
    //     opsikataakun &&
    //       whereConditions.push(` p.nmakun like '%${opsikataakun}%'`);
    //   } else if (akun === "BKPK") {
    //     opsikataakun &&
    //       whereConditions.push(` o.nmbkpk like '%${opsikataakun}%'`);
    //   } else {
    //     opsikataakun &&
    //       whereConditions.push(` q.nmgbkpk like '%${opsikataakun}%'`);
    //   }
    // }

    // FUNGSI LEVEL
    if (level === "LEVEL6") {
      kolom.push("a.kdlevel6");
      group.push("a.kdlevel6");
    } else if (level === "LEVEL5") {
      kolom.push("a.kdlevel5");
      group.push("a.kdlevel5");
    } else if (level === "LEVEL4") {
      kolom.push("a.kdlevel4");
      group.push("a.kdlevel4");
    } else if (level === "LEVEL3") {
      kolom.push("a.kdlevel3");
      group.push("a.kdlevel3");
    } else if (level === "LEVEL2") {
      kolom.push("a.kdlevel2");
      group.push("a.kdlevel2");
    } else if (level === "LEVEL1") {
      kolom.push("a.kdlevel1");
      group.push("a.kdlevel1");
    }

    if (levelradio === "2" && level === "LEVEL6") {
      kolom.push(" p.nmlevel6");
      query += ` LEFT JOIN dbref.t_level6_apbd p on a.kdlevel6=p.kdlevel6`;
    } else if (levelradio === "2" && level === "LEVEL5") {
      kolom.push("  o.nmlevel5");
      query += ` LEFT JOIN dbref.t_level5_apbd o on a.kdlevel5=o.kdlevel5`;
    } else if (levelradio === "2" && level === "LEVEL4") {
      kolom.push("  o.nmlevel4");
      query += ` LEFT JOIN dbref.t_level4_apbd o on a.kdlevel4=o.kdlevel4`;
    } else if (levelradio === "2" && level === "LEVEL3") {
      kolom.push("  o.nmlevel3");
      query += ` LEFT JOIN dbref.t_level3_apbd o on a.kdlevel3=o.kdlevel3`;
    } else if (levelradio === "2" && level === "LEVEL2") {
      kolom.push("  q.nmlevel2");
      query += ` LEFT JOIN dbref.t_level2_apbd q on a.kdlevel2=q.kdlevel2`;
    } else if (levelradio === "2" && level === "LEVEL1") {
      kolom.push("  q.nmlevel1");
      query += ` LEFT JOIN dbref.t_level1_apbd q on a.kdlevel1=q.kdlevel1`;
    }

    if (levelradio === "3" && level === "LEVEL6") {
      kolom.pop("a.kdlevel6");
      kolom.push(" p.nmlevel6");
      query += ` LEFT JOIN dbref.t_level6_apbd p on a.kdlevel6=p.kdlevel6`;
    } else if (levelradio === "3" && level === "LEVEL5") {
      kolom.pop("a.kdlevel5");
      kolom.push("  o.nmlevel5");
      query += ` LEFT JOIN dbref.t_level5_apbd o on a.kdlevel5=o.kdlevel5`;
    } else if (levelradio === "3" && level === "LEVEL4") {
      kolom.pop("a.kdlevel4");
      kolom.push("  o.nmlevel4");
      query += ` LEFT JOIN dbref.t_level4_apbd o on a.kdlevel4=o.kdlevel4`;
    } else if (levelradio === "3" && level === "LEVEL3") {
      kolom.pop("a.kdlevel3");
      kolom.push("  o.nmlevel3");
      query += ` LEFT JOIN dbref.t_level3_apbd o on a.kdlevel3=o.kdlevel3`;
    } else if (levelradio === "3" && level === "LEVEL2") {
      kolom.pop("a.kdlevel2");
      kolom.push("  q.nmlevel2");
      query += ` LEFT JOIN dbref.t_level2_apbd q on a.kdlevel2=q.kdlevel2`;
    } else if (levelradio === "3" && level === "LEVEL1") {
      kolom.pop("a.kdlevel1");
      kolom.push("  q.nmlevel1");
      query += ` LEFT JOIN dbref.t_level1_apbd q on a.kdlevel1=q.kdlevel1`;
    }
    if (levelradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawallevel = levelkondisi.split(",");
    const formatlevel = nilaiawallevel.map((str) => `'${str}'`);
    const hasilFormatlevel = formatlevel.join(",");

    const panjangLevel = levelkondisi.startsWith("!")
      ? levelkondisi.substring(1).indexOf(",") !== -1
        ? levelkondisi.substring(1).indexOf(",") + 1
        : levelkondisi.substring(1).length
      : levelkondisi.indexOf(",") !== -1
        ? levelkondisi.indexOf(",")
        : levelkondisi.length;

    // Mapping level dengan kolom yang sesuai
    const levelMapping = {
      LEVEL6: "a.kdlevel6",
      LEVEL5: "a.kdlevel5",
      LEVEL4: "a.kdlevel4",
      LEVEL3: "a.kdlevel3",
      LEVEL2: "a.kdlevel2",
      LEVEL1: "a.kdlevel1",
    };

    const selectedColumn = levelMapping[level] || "a.kdlevel1"; // Default ke LEVEL1 jika level tidak valid

    if (opsilevel === "kondisilevel") {
      if (levelkondisi.startsWith("!")) {
        whereConditions.push(
          `LEFT(${selectedColumn}, ${panjangLevel}) NOT IN (${hasilFormatlevel
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          `LEFT(${selectedColumn}, ${panjangLevel}) IN (${hasilFormatlevel
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      }
    } else if (opsilevel === "katalevel") {
      if (level === "LEVEL6") {
        opsikatalevel &&
          whereConditions.push(` p.nmlevel6 like '%${opsikatalevel}%'`);
      } else if (level === "LEVEL5") {
        opsikatalevel &&
          whereConditions.push(` o.nmlevel5 like '%${opsikatalevel}%'`);
      } else if (level === "LEVEL4") {
        opsikatalevel &&
          whereConditions.push(` o.nmlevel4 like '%${opsikatalevel}%'`);
      } else if (level === "LEVEL3") {
        opsikatalevel &&
          whereConditions.push(` o.nmlevel3 like '%${opsikatalevel}%'`);
      } else if (level === "LEVEL2") {
        opsikatalevel &&
          whereConditions.push(` q.nmlevel2 like '%${opsikatalevel}%'`);
      } else {
        opsikatalevel &&
          whereConditions.push(` q.nmlevel1 like '%${opsikatalevel}%'`);
      }
    }
    //     //Ketika jenlapapbd yg dipilih 11 (banper), maka muncul kondisi akun berikut
    //     if (jenlapapbd === "11") {
    //       whereConditions.push(`a.kdakun IN ('511521','511522','511529','521231','521232','521233','521234','526111',
    // '526112','526113','526114','526115','526121','526122','526123','526124','526131','526132','526311','526312','526313',
    // '526321','526322','526323')`);
    //     }

    // FUNGSI SUMBER DANA

    // if (sdana !== "XX") {
    //   kolom.push("a.kdsdana");
    //   group.push("a.kdsdana");
    // }

    // if (sdanaradio === "2" && sdana !== "XX") {
    //   kolom.push("d.nmsdana2");
    //   query += ` LEFT JOIN dbref.t_sdana_${thang} d on  a.kdsdana = d.kdsdana`;
    // }
    // if (sdanaradio === "3" && sdana !== "XX") {
    //   kolom.pop("a.kdsdana");
    //   kolom.push("d.nmsdana2");
    //   query += ` LEFT JOIN dbref.t_sdana_${thang} d on  a.kdsdana = d.kdsdana`;
    // }
    // if (sdanaradio === "4") {
    //   kolom = [];
    //   query += ` `;
    // }
    // // console.log(opsioutput);
    // const nilaiawalsdana = sdanakondisi.split(",");
    // const formatsdana = nilaiawalsdana.map((str) => `'${str}'`);
    // const hasilFormatsdana = formatsdana.join(",");

    // if (opsisdana === "pilihsdana") {
    //   if (sdana !== "XX") {
    //     whereConditions.push(
    //       sdana && sdana !== "SEMUASUMBERDANA" ? `a.kdsdana = '${sdana}'` : ``
    //     );
    //   }
    // } else if (opsisdana === "kondisisdana") {
    //   if (sdanakondisi.substring(0, 1) === "!") {
    //     whereConditions.push(
    //       `  a.kdsdana NOT IN (${hasilFormatsdana
    //         .replace(/[!'']/g, "")
    //         .split(",")
    //         .map((str) => `'${str}'`)
    //         .join(",")})`
    //     );
    //   } else {
    //     whereConditions.push(
    //       sdana !== "XX" ? ` a.kdsdana IN (${hasilFormatsdana})` : ""
    //     );
    //   }
    // }

    // else if (opsisdana === "katasdana") {
    //   opsikatasdana &&
    //     whereConditions.push(` n.nmsdana like '%${opsikatasdana}%'`);
    // }

    // if (jenlapapbd === "1") {
    //   // PRIORITAS NASIONAL

    //   if (pn !== "XX") {
    //     kolom.push("a.kdpn");
    //     group.push("a.kdpn");
    //     whereConditions.push(pn && `a.kdpn not in ('00','')`);
    //   }

    //   if (pnradio === "2") {
    //     kolom.push("pn.nmpn");
    //     query += " left join dbref.t_prinas_" + thang + " pn on a.kdpn=pn.kdpn";
    //   }
    //   if (pnradio === "3") {
    //     kolom.pop("a.kdpn");
    //     kolom.push("pn.nmpn");
    //     query += " left join dbref.t_prinas_" + thang + " pn on a.kdpn=pn.kdpn";
    //   }
    //   if (pnradio === "4") {
    //     kolom = [];
    //     query += ` `;
    //   }
    //   if (pn !== "XX") {
    //     whereConditions.push(pn && pn !== "00" ? `a.kdpn = '${pn}'` : ` `);
    //   }
    //   // PROGRAM PRIORITAS

    //   if (prioritas !== "XX") {
    //     kolom.push("a.kdpp");
    //     group.push("a.kdpp");
    //   }

    //   if (ppradio === "2") {
    //     kolom.push("pp.nmpp");
    //     query +=
    //       " left join dbref.t_priprog_" +
    //       thang +
    //       " pp on a.kdpn=pp.kdpn  and a.kdpp=pp.kdpp";
    //   }
    //   if (ppradio === "3") {
    //     kolom.pop("a.kdpp");
    //     kolom.push("pp.nmpp");
    //     query +=
    //       " left join dbref.t_priprog_" +
    //       thang +
    //       " pp on a.kdpn=pp.kdpn  and a.kdpp=pp.kdpp";
    //   }
    //   if (ppradio === "4") {
    //     kolom = [];
    //     query += ` `;
    //   }
    //   if (prioritas !== "XX") {
    //     whereConditions.push(
    //       prioritas && prioritas !== "00" ? `a.kdpp = '${prioritas}'` : ` `
    //     );
    //   }

    //   // KEGIATAN PRIORITAS

    //   if (kp !== "XX") {
    //     kolom.push("a.kdkp");
    //     group.push("a.kdkp");
    //   }

    //   if (kpradio === "2") {
    //     kolom.push("kp.nmkp");
    //     query +=
    //       " left join dbref.t_prigiat_" +
    //       thang +
    //       " kp on a.kdpn=kp.kdpn and a.kdpp=kp.kdpp and a.kdkp=kp.kdkp";
    //   }
    //   if (kpradio === "3") {
    //     kolom.pop("a.kdkp");
    //     kolom.push("kp.nmkp");
    //     query +=
    //       " left join dbref.t_prigiat_" +
    //       thang +
    //       " kp on a.kdpn=kp.kdpn and a.kdpp=kp.kdpp and a.kdkp=kp.kdkp";
    //   }
    //   if (kpradio === "4") {
    //     kolom = [];
    //     query += ` `;
    //   }
    //   if (kp !== "XX") {
    //     whereConditions.push(kp && kp !== "00" ? `a.kdkp = '${kp}'` : ` `);
    //   }

    //   // PROYEK PRIORITAS

    //   if (px !== "XX") {
    //     kolom.push("a.kdproy");
    //     group.push("a.kdproy");
    //   }

    //   if (pxradio === "2") {
    //     kolom.push("px.nmproy");
    //     query +=
    //       " left join dbref.t_priproy_" +
    //       thang +
    //       " px on a.kdpn=px.kdpn and a.kdpp=px.kdpp and a.kdkp=px.kdkp and a.kdproy=px.kdproy";
    //   }
    //   if (pxradio === "3") {
    //     kolom.pop("a.kdproy");
    //     kolom.push("px.nmproy");
    //     query +=
    //       " left join dbref.t_priproy_" +
    //       thang +
    //       " px on a.kdpn=px.kdpn and a.kdpp=px.kdpp and a.kdkp=px.kdkp and a.kdproy=px.kdproy";
    //   }
    //   if (pxradio === "4") {
    //     kolom = [];
    //     query += ` `;
    //   }
    //   if (px !== "XX") {
    //     whereConditions.push(px && px !== "00" ? `a.kdproy = '${px}'` : ` `);
    //   }
    // } else if (jenlapapbd === "2") {
    //   if (mp !== "XX") {
    //     kolom.push("a.kdmp");
    //     group.push("a.kdmp");
    //     whereConditions.push(mp && `a.kdmp not in ('00','0','-','')`);
    //   }

    //   if (mpradio === "2") {
    //     kolom.push("mp.nmmp");
    //     query += "  left join dbref.t_mp mp on a.kdmp=mp.kdmp";
    //   }
    //   if (mpradio === "3") {
    //     kolom.pop("a.kdmp");
    //     kolom.push("mp.nmmp");
    //     query += "  left join dbref.t_mp mp on a.kdmp=mp.kdmp";
    //   }
    //   if (mpradio === "4") {
    //     kolom = [];
    //     query += ` `;
    //   }
    //   if (mp !== "XX") {
    //     whereConditions.push(mp && mp !== "00" ? `a.kdmp = '${mp}'` : ` `);
    //   }
    // } else if (jenlapapbd === "3") {
    //   // TEMATIK
    //   if (tema !== "XX") {
    //     kolom.push(" A.KDTEMA");
    //     group.push(" A.KDTEMA");
    //   }

    //   if (temaradio === "2") {
    //     kolom.push("TEMA.NMTEMA");
    //     query +=
    //       "   LEFT JOIN DBREF" +
    //       thang +
    //       ".T_TEMA TEMA ON A.KDTEMA=TEMA.KDTEMA ";
    //   }
    //   if (temaradio === "3") {
    //     kolom.pop(" A.KDTEMA");
    //     kolom.push("TEMA.NMTEMA");
    //     query +=
    //       "   LEFT JOIN DBREF" +
    //       thang +
    //       ".T_TEMA TEMA ON A.KDTEMA=TEMA.KDTEMA ";
    //   }
    //   if (temaradio === "4") {
    //     kolom = [];
    //     query += ` `;
    //   }
    //   if (tema !== "XX") {
    //     whereConditions.push(
    //       opsitema && opsitema !== "00" ? ` A.KDTEMA like '%${opsitema}%'` : ` `
    //     );
    //   }
    // }
    else if (jenlapapbd === "1") {
      // console.log(inflasiradio);
      // INFLASI

      if (inflasiapbdradio === "1") {
        kolom.push(" A.inflasi");
        group.push(" A.inflasi");
      }

      if (inflasiapbdradio === "2") {
        kolom.push("A.inflasi,bb.ur_inf_intervensi");
        query +=
          "   LEFT JOIN DBREF.ref_inf_intervensi bb  ON A.inflasi=bb.inf_intervensi";
        group.push(" A.inflasi");
      }
      if (inflasiapbdradio === "3") {
        kolom.push("bb.ur_inf_intervensi");
        query +=
          "   LEFT JOIN DBREF.ref_inf_intervensi bb  ON A.inflasi=bb.inf_intervensi";
        group.push(" A.inflasi");
      }
      if (inflasiapbdradio === "4") {
        kolom = [];
        query += ` `;
      }

      whereConditions.push(
        inflasiapbdradio && inflasiapbdradio !== "00"
          ? ` (A.inflasi <> 'NULL')`
          : ` `
      );
    }
    // else if (jenlapapbd === "2") {
    //   // STUNTING
    //   if (stun !== "XX") {
    //     kolom.push(" A.STUN_INTERVENSI");
    //     group.push(" A.STUN_INTERVENSI");
    //     whereConditions.push(stun && `A.STUN_INTERVENSI IS NOT NULL`);
    //   }

    //   if (stuntingradio === "2") {
    //     kolom.push("STUN.UR_STUN_INTERVENSI");
    //     query +=
    //       "   LEFT JOIN DBREF.REF_STUNTING_INTERVENSI STUN ON A.STUN_INTERVENSI=STUN.STUN_INTERVENSI";
    //   }
    //   if (stuntingradio === "3") {
    //     kolom.pop(" A.STUN_INTERVENSI");
    //     kolom.push("STUN.UR_STUN_INTERVENSI");
    //     query +=
    //       "   LEFT JOIN DBREF.REF_STUNTING_INTERVENSI STUN ON A.STUN_INTERVENSI=STUN.STUN_INTERVENSI ";
    //   }
    //   if (stuntingradio === "4") {
    //     kolom = [];
    //     query += ` `;
    //   }
    //   if (stun !== "XX") {
    //     whereConditions.push(stun && stun !== "00" ? `A.STUN_INTERVENSI = '${stun}'` : ` `);
    //   }
    // }
    else if (jenlapapbd === "2") {
      // console.log(inflasiradio);
      // STUNTING
      if (stun !== "XX") {
        kolom.push(" a.stunting");
        group.push(" a.stunting");
      }
      whereConditions.push(
        stun && stun === "00" ? ` a.stunting <> 'NULL'` : ` `
      );
    } else if (jenlapapbd === "3") {
      // console.log(inflasiradio);
      // KEMISKINAN EKSTRIM
      if (miskin !== "XX") {
        kolom.push(" a.kemiskinan");
        group.push(" a.kemiskinan");
      }
      whereConditions.push(
        miskin && miskin === "00" ? ` a.kemiskinan <> 'NULL'` : ` `
      );
    }

    // else if (jenlapapbd === "10") {
    //   // console.log(inflasiradio);
    //   // BELANJA KETAHANAN PANGAN
    //   if (pangan !== "XX") {
    //     group.push(" a.pangan");
    //   }
    //   whereConditions.push(
    //     pangan && pangan === "00"
    //       ? ` a.pangan <> 'NULL'`
    //       : ` `
    //   );
    // }

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

  const sqlQuery = buatQuery(
    kolom,
    // dept,
    // kdunit,
    prov,
    kabkota,
    kppn,
    kanwil,
    satker,
    fungsi,
    sfungsi,
    urusan,
    bidurusan,
    program,
    giat,
    subgiat,
    // output,
    // soutput,
    // akun,
    level
  );

  return sqlQuery;
};
