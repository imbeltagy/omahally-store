import { Container } from "@mui/material";

import "./styles.css";

export default function CategoriesLoading() {
  return (
    <Container className="categories-loading">
      {[...Array(2)].map((_, groupIndex) => (
        <div key={groupIndex} className="categories-loading__group">
          <div
            className="skeleton skeleton--text categories-loading__title"
            style={{ width: 150, height: 28 }}
          />
          <div className="categories-loading__grid">
            {[...Array(12)].map((__, categoryIndex) => (
              <div
                key={categoryIndex}
                className="skeleton skeleton--rounded categories-loading__item"
              />
            ))}
          </div>
        </div>
      ))}
    </Container>
  );
}
