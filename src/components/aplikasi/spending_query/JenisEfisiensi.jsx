import React from "react";
import data from "./Kdjnsefisiensi.json";
import { Col, Row } from "react-bootstrap";

const JenisEfisiensi = (props) => {
    return (
        <>
            <select
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                className="form-select form-select-sm text-select  "
                aria-label=".form-select-sm"
            >
                <option value="00">Semua Jenis Efisiensi</option>
                {data.map((jenis_efisiensi, index) => (
                    <option key={index} value={jenis_efisiensi.jenis_efisiensi}>
                        {jenis_efisiensi.nama_jenis_efisiensi}
                    </option>
                ))}
            </select>
        </>
    );
};

export default JenisEfisiensi;