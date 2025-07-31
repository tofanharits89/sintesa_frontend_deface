import React from "react";

const Kdlevelapbd = (props) => {
    //   console.log("jenlap:", props.jenlap, props.jenis, props.kdakun);
    return (
        <div>
            <div className="mt-2">
                <select
                    value={props.kdlevel}
                    onChange={(e) => props.onChange(e.target.value)}
                    className="form-select form-select-sm"
                    aria-label=".form-select-sm"
                    disabled={props.status !== "pilihlevel"}
                >
                    {props.jenis === "tematik" ? (
                        <>
                            <option value="LEVEL6">Kode Level6</option>
                            <option value="LEVEL5">Kode Level5</option>
                            <option value="LEVEL4">Kode Level4</option>
                            <option value="LEVEL3">Kode Level3</option>
                            <option value="LEVEL2">Kode Level2</option>
                            <option value="LEVEL1">Kode Level1</option>
                        </>
                    ) : null}
                </select>
            </div>
        </div>
    );
};

export default Kdlevelapbd;