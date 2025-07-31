const LayerSwitcher = ({ viewMode, setViewMode }) => (
  <div
    className="d-flex border border-secondary align-items-center gap-3 p-2 bg-secondary shadow-sm rounded text-white"
    style={{ fontSize: "14px" }}
  >
    <div className="form-check form-check-inline m-0">
      <input
        className="form-check-input"
        type="radio"
        name="layerSwitch"
        id="radioSppg"
        value="sppg"
        checked={viewMode === "sppg"}
        onChange={() => setViewMode("sppg")}
      />
      <label className="form-check-label ms-1" htmlFor="radioSppg">
        SPPG Aktif
      </label>
    </div>
    <div className="form-check form-check-inline m-0">
      <input
        className="form-check-input"
        type="radio"
        name="layerSwitch"
        id="radioPenerima"
        value="penerima"
        checked={viewMode === "penerima"}
        onChange={() => setViewMode("penerima")}
      />
      <label className="form-check-label ms-1" htmlFor="radioPenerima">
        Penerima MBG
      </label>
    </div>
  </div>
);

export default LayerSwitcher;
