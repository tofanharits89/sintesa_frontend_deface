import React from "react";
import data from "../../data/KdStunting.json";
import { Col, Row } from "react-bootstrap";

const JenisStunting = (props) => {
    return (
        <>
            <select
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                className="form-select form-select-sm text-select  "
                aria-label=".form-select-sm"
            >
                <option value="00">Semua Intervensi</option>
                {data.map((stun, index) => (
                    <option key={index} value={stun.kdstunting}>
                        {stun.kdstunting} - {stun.nmstunting}
                    </option>
                ))}
            </select>
        </>
    );
};

export default JenisStunting;
