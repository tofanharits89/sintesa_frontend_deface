import React from "react";
import data from "../../data/KdTEMA.json";
import { Col, Row } from "react-bootstrap";

const JenisTematik = (props) => {
    return (
        <>
            <select
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                className="form-select form-select-sm text-select  "
                aria-label=".form-select-sm"
            >
                <option value="00">Semua Tematik Anggaran</option>
                {data.map((tm, index) => (
                    <option key={index} value={tm.kdtema}>
                        {tm.kdtema} - {tm.nmtema}
                    </option>
                ))}
            </select>
        </>
    );
};

export default JenisTematik;