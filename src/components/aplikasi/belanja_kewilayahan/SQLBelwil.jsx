export const getSQL = (queryParams) => {
    const {
        thang,
        jenlap,
        role,
        // blokir,
        // blokirradio,
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
        soutput,
        soutputradio,
        akun,
        akunradio,
        sdana,
        sdanaradio,
        sfungsi,
        select,
        from,
        komponen,
        komponenradio,
        subkomponen,
        subkomponenradio,
        item,
        itemradio,
        // register,
        // registerradio,
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
        opsikppn,
        opsikatakppn,
        kanwilkondisipilih,
        kanwilkondisi,
        opsikanwil,
        opsikatakanwil,
        opsisatker,
        opsikatasatker,
        fungsikondisipilih,
        fungsikondisi,
        opsifungsi,
        opsikatafungsi,
        subfungsikondisipilih,
        subfungsikondisi,
        opsisubfungsi,
        opsikatasubfungsi,
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
        suboutputkondisipilih,
        suboutputkondisi,
        opsisuboutput,
        opsikatasuboutput,
        akunkondisipilih,
        akunkondisi,
        opsiakun,
        opsikataakun,
        opsisdana,
        opsikatasdana,
        sdanakondisi,
        opsikomponen,
        opsikatakomponen,
        komponenkondisi,
        opsikatasubkomponen,
        opsisubkomponen,
        subkomponenkondisi,
        opsikataitem,
        opsiitem,
        itemkondisi,
        // opsikataregister,
        // opsiregister,
        // registerkondisi,
        pembulatan,
        jenis_lokasi,
    } = queryParams;

    // KONDISI AWAL
    let query = "";
    let whereClause = "";
    let whereConditions = [];
    let groupByClause = "";

    // let defaultSelect = `  ROUND(SUM(a.pagu) / ${pembulatan}, 0) AS pagu `;

    // LIMITASI USER ROLE

    // FUNGSI GENERATE SQL
    function buatQuery() {
        // FUNGSI DEPT

        if (dept !== "XXX") {
            kolom.push("a.KDDEPT");
            group.push("a.KDDEPT");
        }

        if (deptradio === "2") {
            kolom.push("a.DESC_DEPT");
            // query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.KDDEPT=b.kddept`;
        }
        if (deptradio === "3") {
            kolom.pop("a.KDDEPT");
            kolom.push("a.DESC_DEPT");
            // query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.KDDEPT=b.kddept`;
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
                    dept && dept !== "000" ? `a.KDDEPT = '${dept}'` : ``
                );
            }
        } else if (opsidept === "kondisidept") {
            if (deptkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDDEPT NOT IN (${hasilFormat
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    dept !== "XXX" ? ` a.KDDEPT IN (${hasilFormat})` : ""
                );
            }
        } else if (opsidept === "katadept") {
            opsikatadept &&
                whereConditions.push(` a.DESC_DEPT like '%${opsikatadept}%'`);
        }

        // FUNGSI KDUNIT

        if (kdunit !== "XX") {
            kolom.push("a.KDUNIT");
            group.push("a.KDUNIT");
        }

        if (unitradio === "2" && kdunit !== "XX") {
            kolom.push("a.DESC_UNIT");
            // query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.KDDEPT=c.kddept and a.KDUNIT=c.kdunit`;
        }
        if (unitradio === "3" && kdunit !== "XX") {
            kolom.pop("a.KDUNIT");
            kolom.push("a.DESC_UNIT");
            // query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.KDDEPT=c.kddept and a.KDUNIT=c.kdunit`;
        }

        const nilaiawalunit = unitkondisi.split(",");
        const formatunit = nilaiawalunit.map((str) => `'${str}'`);
        const hasilFormatunit = formatunit.join(",");

        if (opsiunit === "pilihunit") {
            if (kdunit !== "XX") {
                whereConditions.push(
                    kdunit && kdunit !== "00" ? `a.KDUNIT = '${kdunit}'` : ``
                );
            }
        } else if (opsiunit === "kondisiunit") {
            if (unitkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDUNIT NOT IN (${hasilFormatunit
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    kdunit !== "XX" ? ` a.KDUNIT IN (${hasilFormatunit})` : ""
                );
            }
        } else if (opsiunit === "kataunit") {
            opsikataunit &&
                whereConditions.push(` a.DESC_UNIT like '%${opsikataunit}%'`);
        }

        // FUNGSI DEKON

        if (dekon !== "XX") {
            kolom.push("a.kddekon");
            group.push("a.kddekon");
        }

        if (dekonradio === "2" && dekon !== "XX") {
            kolom.push("a.nmdekon");
            // query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
        }
        if (dekonradio === "3" && dekon !== "XX") {
            kolom.pop("a.kddekon");
            kolom.push("a.nmdekon");
            // query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
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
            kolom.push("a.KODE_LOKUS_PROVINSI");
            group.push("a.KODE_LOKUS_PROVINSI");
        }

        if (provradio === "2" && prov !== "XX") {
            kolom.push("a.LOKUS_PROVINSI");
            // query += ` LEFT JOIN dbref.t_lokasi_${thang} e ON a.KODE_LOKUS_PROVINSI=e.kdlokasi`;
        }
        if (provradio === "3" && prov !== "XX") {
            kolom.pop("a.KODE_LOKUS_PROVINSI");
            kolom.push("a.LOKUS_PROVINSI");
            // query += ` LEFT JOIN dbref.t_lokasi_${thang} e ON a.KODE_LOKUS_PROVINSI=e.kdlokasi`;
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
                    prov && prov !== "00" ? `a.KODE_LOKUS_PROVINSI = '${prov}'` : ``
                );
            }
        } else if (opsiprov === "kondisiprov") {
            if (provkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KODE_LOKUS_PROVINSI NOT IN (${hasilFormatprov
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    prov !== "XX" ? ` a.KODE_LOKUS_PROVINSI IN (${hasilFormatprov})` : ""
                );
            }
        } else if (opsiprov === "kataprov") {
            opsikataprov &&
                whereConditions.push(` a.LOKUS_PROVINSI like '%${opsikataprov}%'`);
        }

        // FUNGSI KDKABKOTA

        if (kabkota !== "XX") {
            kolom.push("a.KODE_LOKUS_KABKOTA");
            group.push("a.KODE_LOKUS_KABKOTA");
        }

        if (kabkotaradio === "2" && kabkota !== "XX") {
            kolom.push("a.LOKUS_KABKOTA");
            // query += ` LEFT JOIN dbref.t_kabkota_${thang} f on a.KODE_LOKUS_PROVINSI=f.kdlokasi and a.KODE_LOKUS_KABKOTA=f.kdkabkota`;
        }
        if (kabkotaradio === "3" && kabkota !== "XX") {
            kolom.pop("a.KODE_LOKUS_KABKOTA");
            kolom.push("a.LOKUS_KABKOTA");
            // query += ` LEFT JOIN dbref.t_kabkota_${thang} f on a.KODE_LOKUS_PROVINSI=f.kdlokasi and a.KODE_LOKUS_KABKOTA=f.kdkabkota`;
        }

        const nilaiawalkdkabkota = kdkabkotakondisi.split(",");
        const formatkdkabkota = nilaiawalkdkabkota.map((str) => `'${str}'`);
        const hasilFormatkdkabkota = formatkdkabkota.join(",");

        if (opsikdkabkota === "pilihkdkabkota") {
            if (kabkota !== "XX") {
                whereConditions.push(
                    kabkota && kabkota !== "ALL" ? `a.KODE_LOKUS_KABKOTA = '${kabkota}'` : ``
                );
            }
        } else if (opsikdkabkota === "kondisikdkabkota") {
            if (kdkabkotakondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KODE_LOKUS_KABKOTA NOT IN (${hasilFormatkdkabkota
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    kabkota !== "XX" ? ` a.KODE_LOKUS_KABKOTA IN (${hasilFormatkdkabkota})` : ""
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

        if (kppn !== "000" && kppn !== "XX") {
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
            kolom.push("a.KDSATKER");
            group.push("a.KDSATKER");
        }

        if (satkerradio === "2" && satker !== "XX") {
            kolom.push("a.DESC_SATKER");
            // query += ` LEFT JOIN dbref.t_satker_${thang} i ON a.KDSATKER=i.kdsatker`;
        }
        if (satkerradio === "3" && satker !== "XX") {
            kolom.pop("a.KDSATKER");
            kolom.push("a.DESC_SATKER");
            // query += ` LEFT JOIN dbref.t_satker_${thang} i ON a.KDSATKER=i.kdsatker`;
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
                    satker && satker !== "SEMUASATKER" ? `a.KDSATKER = '${satker}'` : ``
                );
            }
        } else if (opsisatker === "kondisisatker") {
            if (satkerkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDSATKER NOT IN (${hasilFormatsatker
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    satker !== "XX" ? ` a.KDSATKER IN (${hasilFormatsatker})` : ""
                );
            }
        } else if (opsisatker === "katasatker") {
            opsikatasatker &&
                whereConditions.push(` a.DESC_SATKER like '%${opsikatasatker}%'`);
        }

        // FUNGSI KDFUNGSI

        if (fungsi !== "XX") {
            kolom.push("a.kdfungsi");
            group.push("a.kdfungsi");
        }

        if (fungsiradio === "2" && fungsi !== "XX") {
            kolom.push("j.nmfungsi");
            query += ` LEFT JOIN dbref.t_fungsi_${thang} j ON a.kdfungsi=j.kdfungsi`;
        }
        if (fungsiradio === "3" && fungsi !== "XX") {
            kolom.pop("a.kdfungsi");
            kolom.push("j.nmfungsi");
            query += ` LEFT JOIN dbref.t_fungsi_${thang} j ON a.kdfungsi=j.kdfungsi`;
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
            query += ` LEFT JOIN dbref.t_sfung_${thang} k on a.kdfungsi=k.kdfungsi and a.kdsfung=k.kdsfung`;
        }
        if (subfungsiradio === "3" && sfungsi !== "XX") {
            kolom.pop("a.kdsfung");
            kolom.push("k.nmsfung");
            query += ` LEFT JOIN dbref.t_sfung_${thang} k on a.kdfungsi=k.kdfungsi and a.kdsfung=k.kdsfung`;
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

        // FUNGSI KD PROGRAM

        if (program !== "XX") {
            kolom.push("a.KDPROGRAM");
            group.push("a.KDPROGRAM");
        }

        if (programradio === "2" && program !== "XX") {
            kolom.push("a.DESC_PROGRAM");
            // query += ` LEFT JOIN dbref.t_program_${thang} l on a.KDDEPT = l.kddept and a.KDUNIT = l.kdunit and a.KDPROGRAM =l.kdprogram`;
        }
        if (programradio === "3" && program !== "XX") {
            kolom.pop("a.KDPROGRAM");
            kolom.push("a.DESC_PROGRAM");
            // query += ` LEFT JOIN dbref.t_program_${thang} l on a.KDDEPT = l.kddept and a.KDUNIT = l.kdunit and a.KDPROGRAM =l.kdprogram`;
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
                    program && program !== "00" ? `a.KDPROGRAM = '${program}'` : ``
                );
            }
        } else if (opsiprogram === "kondisiprogram") {
            if (programkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDPROGRAM NOT IN (${hasilFormatprogram
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    program !== "XX" ? ` a.KDPROGRAM IN (${hasilFormatprogram})` : ""
                );
            }
        } else if (opsiprogram === "kataprogram") {
            opsikataprogram &&
                whereConditions.push(` a.DESC_PROGRAM like '%${opsikataprogram}%'`);
        }

        // FUNGSI KD GIAT

        if (giat !== "XX") {
            kolom.push("a.KDGIAT");
            group.push("a.KDGIAT");
        }

        if (kegiatanradio === "2" && giat !== "XX") {
            kolom.push("a.DESC_KEGIATAN");
            // query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.KDGIAT =m.kdgiat`;
        }
        if (kegiatanradio === "3" && giat !== "XX") {
            kolom.pop("a.KDGIAT");
            kolom.push("a.DESC_KEGIATAN");
            // query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.KDGIAT =m.kdgiat`;
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
                    giat && giat !== "00" ? `a.KDGIAT = '${giat}'` : ``
                );
            }
        } else if (opsigiat === "kondisigiat") {
            if (giatkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDGIAT NOT IN (${hasilFormatgiat
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    giat !== "XX" ? ` a.KDGIAT IN (${hasilFormatgiat})` : ""
                );
            }
        } else if (opsigiat === "katagiat") {
            opsikatagiat &&
                whereConditions.push(` a.DESC_KEGIATAN like '%${opsikatagiat}%'`);
        }

        // FUNGSI KD OUTPUT

        if (output !== "XX") {
            kolom.push("a.KDKRO");
            group.push("a.KDKRO");
        }

        if (outputradio === "2" && output !== "XX") {
            kolom.push("a.DESC_KRO");
            // query += ` LEFT JOIN dbref.t_output_${thang} n on  a.KDKRO = n.kdoutput and a.KDGIAT=n.kdgiat`;
        }
        if (outputradio === "3" && output !== "XX") {
            kolom.pop("a.KDKRO");
            kolom.push("a.DESC_KRO");
            // query += ` LEFT JOIN dbref.t_output_${thang} n on  a.KDKRO = n.kdoutput and a.KDGIAT=n.kdgiat`;
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
                    output && output !== "SEMUAOUTPUT" ? `a.KDKRO = '${output}'` : ``
                );
            }
        } else if (opsioutput === "kondisioutput") {
            if (outputkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDKRO NOT IN (${hasilFormatoutput
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    output !== "XX" ? ` a.KDKRO IN (${hasilFormatoutput})` : ""
                );
            }
        } else if (opsioutput === "kataoutput") {
            opsikataoutput &&
                whereConditions.push(` a.DESC_KRO like '%${opsikataoutput}%'`);
        }

        // FUNGSI SUB OUTPUT

        let tahunrkakl = thang.toString().slice(-2);
        if (soutput !== "XX") {
            kolom.push("a.KDRO");
            group.push("a.KDRO");
        }

        if (soutputradio === "2" && soutput !== "XX") {
            kolom.push("a.DESC_RO");
            // query += ` LEFT JOIN dbref.dipa_soutput_${tahunrkakl} aa ON a.KDSATKER=aa.KDSATKER AND a.KDDEPT=aa.KDDEPT AND a.KDUNIT=aa.KDUNIT AND a.KDPROGRAM=aa.KDPROGRAM AND a.KDGIAT=aa.KDGIAT AND a.KDKRO=aa.KDKRO AND a.KDRO=aa.KDRO`;
        }
        if (soutputradio === "3" && soutput !== "XX") {
            kolom.pop("a.KDRO");
            kolom.push("a.DESC_RO");
            // query += ` LEFT JOIN dbref.dipa_soutput_${tahunrkakl} aa ON a.KDSATKER=aa.KDSATKER AND a.KDDEPT=aa.KDDEPT AND a.KDUNIT=aa.KDUNIT AND a.KDPROGRAM=aa.KDPROGRAM AND a.KDGIAT=aa.KDGIAT AND a.KDKRO=aa.KDKRO AND a.KDRO=aa.KDRO`;
        }
        if (soutputradio === "4") {
            kolom = [];
            query += ` `;
        }
        //console.log(soutput);
        const nilaiawalsoutput = suboutputkondisi.split(",");
        const formatsoutput = nilaiawalsoutput.map((str) => `'${str}'`);
        const hasilFormatsoutput = formatsoutput.join(",");

        if (opsisuboutput === "pilihsuboutput") {
            if (soutput !== "XX") {
                whereConditions.push(
                    soutput && soutput !== "SEMUASUBOUTPUT"
                        ? `a.KDRO = '${soutput}'`
                        : ``
                );
            }
        } else if (opsisuboutput === "kondisisuboutput") {
            if (suboutputkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDRO NOT IN (${hasilFormatsoutput
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    soutput !== "XX" ? ` a.KDRO IN (${hasilFormatsoutput})` : ""
                );
            }
        } else if (opsisuboutput === "katasuboutput") {
            opsikatasuboutput &&
                whereConditions.push(` a.DESC_RO like '%${opsikatasuboutput}%'`);
        }

        // FUNGSI KDAKUN

        if (akun === "AKUN") {
            kolom.push("a.KODE_AKUN");
            group.push("a.KODE_AKUN");
        }
        // else if (akun === "BKPK") {
        //     kolom.push("LEFT(a.KODE_AKUN,4) as KDBKPK");
        //     group.push("LEFT(a.KODE_AKUN,4)");
        // }
        // else if (akun === "JENBEL") {
        //     kolom.push("LEFT(a.KODE_AKUN,2) as JENBEL");
        //     group.push("LEFT(a.KODE_AKUN,2) ");
        // }

        if (akunradio === "2" && akun === "AKUN") {
            kolom.push(" a.DESC_AKUN");
            // query += ` LEFT JOIN dbref.t_akun_${thang} p on a.KODE_AKUN=p.kdakun`;
        }
        // else if (akunradio === "2" && akun === "BKPK") {
        //     kolom.push("  o.nmbkpk");
        //     query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.KODE_AKUN,4)=o.kdbkpk`;
        // }
        // else if (akunradio === "2" && akun === "JENBEL") {
        //     kolom.push("  q.nmgbkpk");
        //     query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.KODE_AKUN,2)=q.kdgbkpk`;
        // }

        if (akunradio === "3" && akun === "AKUN") {
            kolom.pop("a.KODE_AKUN");
            kolom.push(" a.DESC_AKUN");
            // query += ` LEFT JOIN dbref.t_akun_${thang} p on a.KODE_AKUN=p.kdakun`;
        }
        // else if (akunradio === "3" && akun === "BKPK") {
        //     kolom.pop("LEFT(a.KODE_AKUN,4)");
        //     kolom.push("  o.nmbkpk");
        //     query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.KODE_AKUN,4)=o.kdbkpk`;
        // }
        // else if (akunradio === "3" && akun === "JENBEL") {
        //     kolom.pop("LEFT(a.KODE_AKUN,2)");
        //     kolom.push("  q.nmgbkpk");
        //     query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.KODE_AKUN,2)=q.kdgbkpk`;
        // }
        // if (akunradio === "4") {
        //     kolom = [];
        //     query += ` `;
        // }

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
                whereConditions.push(
                    `${akun === "AKUN"
                        ? `LEFT(a.KODE_AKUN,${panjangAkun})`
                        : akun === "BKPK"
                            ? `LEFT(a.KODE_AKUN,${panjangAkun})`
                            : `LEFT(a.KODE_AKUN,${panjangAkun})`
                    } not in (${hasilFormatakun
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    `${akun === "AKUN"
                        ? `LEFT(a.KODE_AKUN,${panjangAkun})`
                        : akun === "BKPK"
                            ? `LEFT(a.KODE_AKUN,${panjangAkun})`
                            : `LEFT(a.KODE_AKUN,${panjangAkun})`
                    }  in (${hasilFormatakun
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            }
        } else if (opsiakun === "kataakun") {
            if (akun === "AKUN") {
                opsikataakun &&
                    whereConditions.push(` a.DESC_AKUN like '%${opsikataakun}%'`);
            } else if (akun === "BKPK") {
                opsikataakun &&
                    whereConditions.push(` o.nmbkpk like '%${opsikataakun}%'`);
            } else {
                opsikataakun &&
                    whereConditions.push(` q.nmgbkpk like '%${opsikataakun}%'`);
            }
        }

        // FUNGSI KDSDANA

        if (sdana !== "XX") {
            kolom.push("a.kdsdana");
            group.push("a.kdsdana");
        }

        if (sdanaradio === "2" && sdana !== "XX") {
            kolom.push("r.nmsdana2");
            query += ` LEFT JOIN dbref.t_sdana_2014 r ON a.kdsdana=r.kdsdana`;
        }
        if (sdanaradio === "3" && sdana !== "XX") {
            kolom.pop("a.kdsdana");
            kolom.push("r.nmsdana2");
            query += ` LEFT JOIN dbref.t_sdana_2014 r ON a.kdsdana=r.kdsdana`;
        }
        if (sdanaradio === "4") {
            kolom = [];
            query += ` `;
        }
        //console.log(sdana);
        const nilaiawalsdana = sdanakondisi.split(",");
        const formatsdana = nilaiawalsdana.map((str) => `'${str}'`);
        const hasilFormatsdana = formatsdana.join(",");

        if (opsisdana === "pilihsdana") {
            if (sdana !== "XX") {
                whereConditions.push(
                    sdana && sdana !== "00" ? `a.kdsdana = '${sdana}'` : ``
                );
            }
        } else if (opsisdana === "kondisisdana") {
            if (sdanakondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.kdsdana NOT IN (${hasilFormatsdana
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    sdana !== "XX" ? ` a.kdsdana IN (${hasilFormatsdana})` : ""
                );
            }
        } else if (opsisdana === "katasdana") {
            opsikatasdana &&
                whereConditions.push(` r.nmsdana2 like '%${opsikatasdana}%'`);
        }

        // FUNGSI KOMPONEN
        if (komponen !== "XX") {
            kolom.push("a.KDKOMP");
            group.push("a.KDKOMP");
        }

        if (komponenradio === "2" && komponen !== "XX") {
            kolom.push("a.DESC_KOMP");
            // query += ` LEFT JOIN dbref.dipa_kmpnen_${tahunrkakl} ab on a.KDSATKER=ab.kdsatker and a.KDDEPT=ab.kddept and a.KDUNIT=ab.kdunit and a.KDPROGRAM=ab.kdprogram and a.KDGIAT = ab.kdgiat and a.KDKRO = ab.kdoutput and a.KDRO = ab.kdsoutput and a.KDKOMP=ab.kdkmpnen`;
        }
        if (komponenradio === "3" && komponen !== "XX") {
            kolom.pop("a.KDKOMP");
            kolom.push("a.DESC_KOMP");
            // query += ` LEFT JOIN dbref.dipa_kmpnen_${tahunrkakl} ab on a.KDSATKER=ab.kdsatker and a.KDDEPT=ab.kddept and a.KDUNIT=ab.kdunit and a.KDPROGRAM=ab.kdprogram and a.KDGIAT = ab.kdgiat and a.KDKRO = ab.kdoutput and a.KDRO = ab.kdsoutput and a.KDKOMP=ab.kdkmpnen`;
        }
        if (komponenradio === "4") {
            kolom = [];
            query += ` `;
        }
        //console.log(komponen);
        const nilaiawalkomponen = komponenkondisi.split(",");
        const formatkomponen = nilaiawalkomponen.map((str) => `'${str}'`);
        const hasilFormatkomponen = formatkomponen.join(",");

        if (opsikomponen === "pilihkomponen") {
            if (komponen !== "XX") {
                whereConditions.push(
                    komponen && komponen !== "SEMUAKOMPONEN"
                        ? `a.KDKOMP = '${komponen}'`
                        : ``
                );
            }
        } else if (opsikomponen === "kondisikomponen") {
            if (komponenkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDKOMP NOT IN (${hasilFormatkomponen
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    komponen !== "XX" ? ` a.KDKOMP IN (${hasilFormatkomponen})` : ""
                );
            }
        } else if (opsikomponen === "katakomponen") {
            opsikatakomponen &&
                whereConditions.push(` a.DESC_KOMP like '%${opsikatakomponen}%'`);
        }

        // FUNGSI SUB KOMPONEN
        if (subkomponen !== "XX") {
            kolom.push("a.KDSUBKOMP");
            group.push("a.KDSUBKOMP");
        }

        if (subkomponenradio === "2" && subkomponen !== "XX") {
            kolom.push("a.DESC_SUBKOMPONEN");
            // query += ` LEFT JOIN dbref.dipa_skmpnen_${tahunrkakl} ac on a.KDSATKER=ac.kdsatker and a.KDDEPT=ac.kddept and a.KDUNIT=ac.kdunit and a.KDPROGRAM=ac.kdprogram and a.KDGIAT = ac.kdgiat and a.KDKRO = ac.kdoutput and a.KDRO = ac.kdsoutput and a.KDKOMP=ac.kdkmpnen and a.KDSUBKOMP=ac.kdskmpnen`;
        }
        if (subkomponenradio === "3" && subkomponen !== "XX") {
            kolom.pop("a.KDSUBKOMP");
            kolom.push("a.DESC_SUBKOMPONEN");
            // query += ` LEFT JOIN dbref.dipa_skmpnen_${tahunrkakl} ac on a.KDSATKER=ac.kdsatker and a.KDDEPT=ac.kddept and a.KDUNIT=ac.kdunit and a.KDPROGRAM=ac.kdprogram and a.KDGIAT = ac.kdgiat and a.KDKRO = ac.kdoutput and a.KDRO = ac.kdsoutput and a.KDKOMP=ac.kdkmpnen and a.KDSUBKOMP=ac.kdskmpnen`;
        }
        if (subkomponenradio === "4") {
            kolom = [];
            query += ` `;
        }

        const nilaiawalsubkomponen = subkomponenkondisi.split(",");
        const formatsubkomponen = nilaiawalsubkomponen.map((str) => `'${str}'`);
        const hasilFormatsubkomponen = formatsubkomponen.join(",");

        if (opsisubkomponen === "pilihsubkomponen") {
            if (subkomponen !== "XX") {
                whereConditions.push(
                    subkomponen && subkomponen !== "SEMUASUBKOMPONEN"
                        ? `a.KDSUBKOMP = '${subkomponen}'`
                        : ``
                );
            }
        } else if (opsisubkomponen === "kondisisubkomponen") {
            if (subkomponenkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `  a.KDSUBKOMP NOT IN (${hasilFormatsubkomponen
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    subkomponen !== "XX"
                        ? ` a.KDSUBKOMP IN (${hasilFormatsubkomponen})`
                        : ""
                );
            }
        } else if (opsisubkomponen === "katasubkomponen") {
            opsikatasubkomponen &&
                whereConditions.push(`a.DESC_SUBKOMPONEN like '%${opsikatasubkomponen}%'`);
        }

        // FUNGSI ITEM
        if (item !== "XX") {
            kolom.push(" a.KDITEM");
            group.push(" a.KDITEM");
        }

        if (itemradio === "2" && item !== "XX") {
            kolom.push(` a.DESC_ITEM`);
        }
        if (itemradio === "3" && item !== "XX") {
            kolom.push(` a.DESC_ITEM`);
            kolom.pop(" a.KDITEM");
        }
        if (itemradio === "4") {
            kolom = [];
            query += ` `;
        }

        const nilaiawalitem = itemkondisi.split(",");
        const formatitem = nilaiawalitem.map((str) => `'${str}'`);
        const hasilFormatitem = formatitem.join(",");

        if (opsiitem === "pilihitem") {
            if (item !== "XX") {
                whereConditions.push(
                    item && item !== "SEMUAITEM" ? ` a.KDITEM = '${item}'` : ``
                );
            }
        } else if (opsiitem === "kondisiitem") {
            if (itemkondisi.substring(0, 1) === "!") {
                whereConditions.push(
                    `   a.KDITEM NOT IN (${hasilFormatitem
                        .replace(/[!'']/g, "")
                        .split(",")
                        .map((str) => `'${str}'`)
                        .join(",")})`
                );
            } else {
                whereConditions.push(
                    item !== "XX" ? ` a.KDITEM IN (${hasilFormatitem})` : ""
                );
            }
        } else if (opsiitem === "kataitem") {
            if (item === "SEMUAITEM") {
                opsikataitem &&
                    whereConditions.push(`a.DESC_ITEM LIKE '%${opsikataitem}%'`);
            }
        }

        if (jenis_lokasi !== "XX") {
            whereConditions.push(
                jenis_lokasi && jenis_lokasi !== "00" ? `a.JENIS_DATA_LOKASI = '${jenis_lokasi}'` : ` `
            );
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

            groupByClause = ` GROUP BY a.JENIS_DATA_LOKASI, ${cleanKolom.join(",")}`;
        }

        kolom.push("a.KODE_LOKUS_ANGGARAN");
        group.push("a.KODE_LOKUS_ANGGARAN");
        kolom.push("a.LOKUS_ANGGARAN");
        group.push("a.LOKUS_ANGGARAN");

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

        return `SELECT a.JENIS_DATA_LOKASI, ${kolom.join(
            ","
        )}${select} FROM ${tabel} ${query} ${finalWhereClause}  ${groupByClause}`;
    }

    // PEMANGGIAN FUNGSI SQL SECARA MENYELURUH

    let kolom = [];
    let group = [];
    let tabel = "kewilayahan_" + thang + ".belanja_kewilayahan_" + thang + " a";

    // let dipadetil = "kewilayahan_" + thang + ".belanja_kewilayahan_" + thang + " a";
    // let dipabiasa = "monev" + thang + ".m_detail_harian_part_" + thang + " a";
    // if (
    //     soutput !== "XX" ||
    //     komponen !== "XX" ||
    //     subkomponen !== "XX" ||
    //     item !== "XX"
    // ) {
    //     tabel = dipadetil;
    // } else {
    //     tabel = dipabiasa;
    // }

    const sqlQuery = buatQuery(
        kolom,
        dept,
        kdunit,
        prov,
        kabkota,
        kppn,
        kanwil,
        satker,
        fungsi,
        sfungsi,
        program,
        giat,
        output,
        soutput,
        akun,
        sdana,
        komponen,
        subkomponen,
        item,
        // register
    );
    // console.log(tabel);

    return sqlQuery;
};
