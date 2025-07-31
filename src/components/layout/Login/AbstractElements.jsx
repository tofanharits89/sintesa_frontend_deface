// ui-elements.js  (barrel baru ‑ semuanya React‑Bootstrap)
import {
  Button as Btn,
  Badge as Badges,
  Alert as Alerts,
  Breadcrumb as Breadcrumbs,
  Dropdown as Dropdowns,
  Spinner,
  OverlayTrigger as ToolTip,
  ProgressBar as Progressbar,
  Popover as Popovers,
  Image,
  ListGroup,
  Container,
  Row,
  Col, // jika nanti butuh grid
} from "react-bootstrap";

// Elemen‑elemen berbentuk teks & heading cukup pakai elemen HTML langsung (h1‑h6, p, blockquote, ul, ol, li)
// sehingga tidak perlu wrapper khusus lagi.

// Jika masih butuh Footer atau Ribbon kustom, buat atau impor terpisah di lokasi lain.

export {
  // React‑Bootstrap
  Btn,
  Badges,
  Alerts,
  Breadcrumbs,
  Dropdowns,
  Spinner,
  ToolTip,
  Progressbar,
  Popovers,
  Image,
  ListGroup,
  Container,
  Row,
  Col,
};
