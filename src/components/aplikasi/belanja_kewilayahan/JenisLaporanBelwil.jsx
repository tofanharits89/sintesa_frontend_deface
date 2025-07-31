import React, { useState, useEffect } from "react";
// import "./style.css";
import { Col, Container, Row } from "react-bootstrap";

const JenisLaporanBelwil = ({ akumulatifopt, onChange, jenlap }) => {
    const jenisLap = [
        { value: "1", label: " Realisasi" },
        { value: "2", label: " Realisasi Bulanan" },
    ];

    const [selectedValue, setSelectedValue] = useState("1");
    const [akumulatif, setAkumulatif] = useState(false);

    useEffect(() => {
        // console.log("Akumulatif Option:", akumulatifopt);
    }, [akumulatifopt]);

    const handleJenisLaporanChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedValue(selectedValue);
        onChange({ selectedValue, akumulatif });
    };

    const handleAkumulatifChange = (event) => {
        const { checked } = event.target;
        setAkumulatif(checked);
        onChange({ selectedValue, akumulatif: checked });
    };

    return (
        <>
            <Row>
                <Col xs={3} md={2} lg={2} xl={2}>
                    Jenis Laporan
                </Col>

                <Col xs={9} md={10} lg={10} xl={10} className="jenis-laporan-option">
                    {jenisLap.map((jenis) => (
                        <p key={jenis.value} style={{ margin: "0px" }} className="mt-1">
                            <input
                                type="radio"
                                name="jenlap"
                                className="mx-2 fade-in"
                                value={jenis.value}
                                checked={selectedValue === jenis.value}
                                onChange={handleJenisLaporanChange}
                            />
                            {selectedValue === "2" && jenis.value === "2" ? (
                                <>
                                    {jenis.label}
                                    <input
                                        type="checkbox"
                                        className="ms-4 fade-in"
                                        checked={akumulatif}
                                        onChange={handleAkumulatifChange}
                                    />
                                    &nbsp;&nbsp;Akumulatif
                                </>
                            ) : (
                                jenis.label
                            )}
                        </p>
                    ))}
                </Col>
            </Row>
        </>
    );
};

export default JenisLaporanBelwil;