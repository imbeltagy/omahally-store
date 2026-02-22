import { Container } from "@mui/material";

import "./styles.css";

export default function BannersLoading() {
  return (
    <div className="banners-loading">
      <Container>
        <div
          className="skeleton skeleton--rounded banners-loading__skeleton"
          style={{ aspectRatio: "1920/500", width: "100%" }}
        />
      </Container>
    </div>
  );
}
