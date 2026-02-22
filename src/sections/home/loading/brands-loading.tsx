import { Container } from "@mui/material";

import "./styles.css";

export default function BrandsLoading() {
  return (
    <div>
      <Container>
        <div className="brands-loading__inner">
          <div className="brands-loading__grid">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="skeleton skeleton--rounded brands-loading__item"
                style={{ aspectRatio: "3/4", width: "100%" }}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
