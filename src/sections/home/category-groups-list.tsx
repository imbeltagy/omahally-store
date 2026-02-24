"use client";

import { useTranslations } from "next-intl";

import { Box, Grid, Stack, Container, Typography } from "@mui/material";

import { SECTION_PADDING } from "@/layouts/config-layout";

import { CategoryGroup } from "@/types/products";

import CategoryCard from "./category-card";

interface Props {
  groups: CategoryGroup[];
}

export default function CategoryGroupsList({ groups }: Props) {
  const t = useTranslations("Pages.Home");
  const hasGroups = groups.some((group) => group.categories.length > 0);

  return (
    <Container
      sx={{
        width: "100%",
        position: "relative",
        pb: SECTION_PADDING,
        pt: 4,
      }}
    >
      <Stack spacing={4}>
        {hasGroups && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 6,
                my: 0.5,
                alignSelf: "stretch",
                borderRadius: "50px",
                backgroundColor: "primary.light",
              }}
            />
            <Typography component="span" fontSize={24}>
              🛍️
            </Typography>
            <Typography variant="h4" component="h2">
              {t("categories_by_group_title")}
            </Typography>
          </Stack>
        )}
        {groups
          .filter((group) => group.categories.length > 0)
          .map(({ id, name, categories }) => (
            <Box key={id}>
              <Typography variant="h4" component="h3" gutterBottom>
                {name}
              </Typography>
              <Grid container spacing={1}>
                {categories?.map((item, index) => (
                  <Grid
                    item
                    xs={12 / 3}
                    sm={12 / 4}
                    md={12 / 6}
                    lg={12 / 8}
                    key={index}
                  >
                    <CategoryCard category={item} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
      </Stack>
    </Container>
  );
}
