import React from "react";
import { Badge } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";

const LogStatus = ({ status, logs, isCopied, onCopy }) => {
  if (!logs.length) return null;

  return (
    <h5 className="my-2 text-center fw-light">
      <code>
        <Badge className="bg-light p-2 text-secondary shimmer-text ">
          {status}
        </Badge>{" "}
        <br />
        <CopyToClipboard text={logs.join("\n")} onCopy={onCopy}>
          <span
            style={{ cursor: "pointer", fontSize: "13px" }}
            className="mx-3 text-secondary"
          >
            [Copy log]
          </span>
        </CopyToClipboard>
        {isCopied ? (
          <span style={{ color: "green", fontSize: "13px" }}>Copied!</span>
        ) : null}
      </code>
    </h5>
  );
};

export default LogStatus;
