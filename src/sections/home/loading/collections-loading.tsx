import { Container } from "@mui/material";

import "./styles.css";

export default function CollectionsLoading() {
  return (
    <div className="collections-loading">
      <Container>
        {[...Array(2)].map((_, collectionIndex) => (
          <div key={collectionIndex} className="collections-loading__block">
            <div className="collections-loading__header">
              <div
                className="skeleton skeleton--text collections-loading__heading"
                style={{ width: 200, height: 40 }}
              />
              <div
                className="skeleton skeleton--text collections-loading__link"
                style={{ width: 100, height: 28 }}
              />
            </div>
            <div className="collections-loading__grid">
              {[...Array(7)].map((__, productIndex) => (
                <div
                  key={productIndex}
                  className="skeleton skeleton--rounded collections-loading__item"
                />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
