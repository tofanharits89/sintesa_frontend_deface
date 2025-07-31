import {
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaFileCode,
} from "react-icons/fa";

const FileIcon = ({ fileType }) => {
  switch (fileType) {
    case "pdf":
      return <FaFilePdf style={{ color: "red", marginRight: "8px" }} />;
    case "excel":
      return <FaFileExcel style={{ color: "green", marginRight: "8px" }} />;
    case "image":
      return <FaFileImage style={{ color: "blue", marginRight: "8px" }} />;
    case "json":
      return <FaFileCode style={{ color: "orange", marginRight: "8px" }} />; // Ikon JSON
    case "text":
      return <FaFileAlt style={{ color: "brown", marginRight: "8px" }} />; // Ikon TXT
    default:
      return null; // Default icon jika tidak ada file type yang cocok
  }
};

const ShareDataComponent = ({ fileType }) => {
  return (
    <div>
      <FileIcon fileType={fileType} />
      <span style={{ fontSize: "18px" }}>Share Data</span>
    </div>
  );
};

export default ShareDataComponent;
