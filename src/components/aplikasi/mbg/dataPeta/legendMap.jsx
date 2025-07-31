import React from "react";
import { legendData } from "./legendData";

const LegendMap = ({ selectedProvince, viewMode }) => {
  const renderLegendItems = (items) =>
    items.map((item, idx) => (
      <div key={idx}>
        <i style={{ background: item.color }} /> {item.label}
      </div>
    ));

  const isNasional = selectedProvince === "NASIONAL";

  const showSppg = isNasional && viewMode === "sppg";
  const showPenerima = !isNasional || (isNasional && viewMode === "penerima");

  return (
    <>
      {showSppg && (
        <div
          className="leaflet-top leaflet-right p-2 legend-box text-start mt-3 mx-3 text-start p-0"
          style={{
            width: "200px",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          <div className="legend-title fw-bold my-2 text-center">
            SPPG Aktif
          </div>
          <div className="mx-3 my-2">{renderLegendItems(legendData.sppg)}</div>
        </div>
      )}

      {showPenerima && (
        <div
          className="leaflet-top leaflet-right p-2 legend-box text-start mt-3 mx-3 text-start p-0"
          style={{
            width: "200px",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          <div className="legend-title fw-bold my-2 text-center">
            Penerima MBG
          </div>
          <div className="mx-3 my-2">
            {renderLegendItems(legendData.penerima)}
          </div>
        </div>
      )}
    </>
  );
};

export default LegendMap;
