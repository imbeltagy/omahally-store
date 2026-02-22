import { Container } from "@mui/material";

import "./styles.css";

export default function OffersLoading() {
  return (
    <div className="offers-loading">
      <Container>
        <div className="offers-loading__inner">
          <div className="skeleton offers-loading__bar" />
        </div>
      </Container>
    </div>
  );
}
