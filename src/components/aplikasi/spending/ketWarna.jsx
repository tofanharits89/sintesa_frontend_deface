export const KetWarna = () => {
  return (
    <div className="d-flex justify-content-end align-items-center gap-3 flex-wrap">
      <span className="d-flex align-items-center gap-1 mb-2">
        <span
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "red",
            borderRadius: "50%",
            display: "inline-block",
          }}
        ></span>
        <small>Belum direkam</small>
      </span>

      <span className="d-flex align-items-center gap-1 mb-2">
        <span
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "green",
            borderRadius: "50%",
            display: "inline-block",
          }}
        ></span>
        <small>Sudah direkam (1 kesalahan)</small>
      </span>

      <span className="d-flex align-items-center gap-1 mb-2">
        <span
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "yellow",
            border: "1px solid #999",
            borderRadius: "50%",
            display: "inline-block",
          }}
        ></span>
        <small>2 kesalahan</small>
      </span>

      <span className="d-flex align-items-center gap-1 mb-2">
        <span
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "blue",
            borderRadius: "50%",
            display: "inline-block",
          }}
        ></span>
        <small>Biru (lainnya)</small>
      </span>
    </div>
  );
};
