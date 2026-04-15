"use client";

import { useLocale } from "next-intl";

import { Box, Stack, Container } from "@mui/material";

import { paths } from "@/routes/paths";

import { LocaleType } from "@/i18n/config-locale";
import { SECTION_PADDING } from "@/layouts/config-layout";

import { CollectionWithProducts } from "@/types/products";

import CollectionsSwiper from "./collections-swiper";
import SectionHeadding from "./components/section-headding";
import ProductsListView from "../products/view/products-list-view";

interface Props {
  collections: CollectionWithProducts[];
}

export default function CollectionsList({ collections }: Props) {
  const locale = useLocale() as LocaleType;

  return (
    <Box py={SECTION_PADDING}>
      <Container>
        <Stack spacing={4}>
          {collections
            .filter((item) => item.products?.length)
            .map((item) => (
              <CollectionRow
                key={item.collection.id}
                item={item}
                locale={locale}
              />
            ))}
        </Stack>
      </Container>
    </Box>
  );
}

function CollectionRow({
  item,
  locale,
}: {
  item: CollectionWithProducts;
  locale: LocaleType;
}) {
  const { collection } = item;
  const name =
    locale === "ar" ? collection.name_ar || collection.name : collection.name;
  const href = `${paths.collections}/${collection.id}`;

  return (
    <Box key={collection.id}>
      <SectionHeadding titleName={name} href={href} />

      <Box pt={{ xs: 2, sm: 4 }} sx={{ position: "relative" }}>
        {collection.is_grid ? (
          <ProductsListView products={item.products} pagesCount={1} />
        ) : (
          <CollectionsSwiper item={item} />
        )}
      </Box>
    </Box>
  );
}
