import React from "react";
import data from "../../../data/Jenislokasi.json";
import { Col, Row } from "react-bootstrap";

const JenisLokasiData = (props) => {
    return (
        <>
            <select
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                className="form-select form-select-sm text-select  "
                aria-label=".form-select-sm"
            >
                {/* <option value="00">Jenis Lokasi</option> */}
                {data.map((jenis_lokasi, index) => (
                    <option key={index} value={jenis_lokasi.jenis_lokasi}>
                        {jenis_lokasi.nm_jenis_lokasi}
                    </option>
                ))}
            </select>
        </>
    );
};

export default JenisLokasiData;