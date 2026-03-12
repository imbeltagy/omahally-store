"use client";

import { useState, useEffect, useCallback } from "react";

import { Tabs, Button } from "@mui/material";

import { useQueryString } from "@/hooks/use-queryString";

import { SubCategory } from "@/types/products";

interface Props {
  subCategories: SubCategory[];
  initialSubCategoryId: string | undefined;
}

export default function SubCategoriesFilter({
  subCategories,
  initialSubCategoryId,
}: Props) {
  const [subCategoryId, setSubCategoryId] = useState(initialSubCategoryId);

  const { createQueryString } = useQueryString();

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setSubCategoryId(newValue);
      createQueryString(
        [
          { name: "subCategoryId", value: newValue },
          { name: "page", value: undefined },
        ],
        true,
      );
    },
    [createQueryString],
  );

  useEffect(() => {
    if (
      !initialSubCategoryId ||
      !subCategories.find((item) => item.id === subCategoryId)
    ) {
      handleChange({} as React.SyntheticEvent, subCategories[0].id);
    }
  }, [handleChange, initialSubCategoryId, subCategories, subCategoryId]);

  return (
    <Tabs
      aria-label="Choose product sub category"
      value={subCategoryId}
      TabIndicatorProps={{
        sx: {
          display: "none",
        },
      }}
    >
      {subCategories.map((item, index) => (
        <Button
          variant={item.id === subCategoryId ? "contained" : "outlined"}
          color={item.id === subCategoryId ? "secondary" : "inherit"}
          onClick={(e) => handleChange(e, item.id)}
          key={index}
          value={item.id}
          sx={{ mx: 1, flexShrink: 0 }}
        >
          {item.name}
        </Button>
      ))}
    </Tabs>
  );
}
