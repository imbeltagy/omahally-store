"use client";

import { useTranslations } from "next-intl";

import {
  Box,
  Card,
  Stack,
  Container,
  Typography,
  CardContent,
} from "@mui/material";

import { useCurrency } from "@/utils/format-number";

import { useCartStore } from "@/contexts/cart-store";
import { SECTION_PADDING } from "@/layouts/config-layout";

import Label from "@/components/label";
import Iconify from "@/components/iconify";

import ProductAddForm from "@/sections/products/product-add-form";

import { FullProduct, ProductMeasurement } from "@/types/products";

import ProductFavButton from "../fav-button";
import ProductSwiper from "../product-swiper";

interface Props {
  product: FullProduct;
}

export default function SingleProductView({
  product: { product, product_measurements },
}: Props) {
  const t = useTranslations("Pages.Home.Product");
  const currency = useCurrency();
  const { products } = useCartStore();
  const isInCart = products.some(
    (item) => item.product_id === product.product_id,
  );

  const measurement =
    product_measurements.find((item) => item.is_main_unit) ||
    ({} as ProductMeasurement);
  const offerPrice = measurement.offer?.offer_price;
  const originalPrice = measurement.product_category_price.product_price;
  const finalPrice = offerPrice ?? originalPrice;

  const renderSwiper = <ProductSwiper images={product.product_images} />;

  const renderContent = (
    <Box>
      <Typography variant="h4" component="p">
        {product.product_name}
      </Typography>
      <Typography variant="h6">{measurement.measurement_unit}</Typography>
      <Typography
        variant="h5"
        color="primary"
        gutterBottom
        component="p"
        suppressHydrationWarning
      >
        {offerPrice && (
          <Typography component="del" color="text.disabled">
            {currency(originalPrice, false)}
          </Typography>
        )}{" "}
        {currency(finalPrice)}
      </Typography>
      {!product.is_quantity_available && (
        <Label color="error">{t("no_available")}</Label>
      )}
      {product.type === "BUNDLE" && product.components?.length ? (
        <Box mb={1}>
          <Typography variant="subtitle2" gutterBottom>
            {t("components")}
          </Typography>
          <Stack spacing={0.5}>
            {product.components.map((component) => (
              <Typography key={component.component_id} variant="body2">
                {component.quantity} × {component.component_name}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : null}
      <Typography color="text.disabled">
        {product.product_description}
      </Typography>
    </Box>
  );

  const renderActions = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="start"
      spacing={1}
      pt={1}
    >
      <ProductFavButton
        isFav={product.product_is_fav}
        productId={product.product_id}
        sectionId={product.section_id}
        sx={{ alignSelf: "stretch" }}
      />
      {isInCart && (
        <Label
          color="primary"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            alignSelf: "center",
          }}
        >
          <Iconify icon="bxs:cart-alt" width={16} />
          {t("in_cart")}
        </Label>
      )}
      {(product.product_option_groups?.length || 0) === 0 ? (
        <ProductAddForm
          product_id={product.product_id}
          product_category_price_id={
            measurement.product_category_price.product_category_price_id
          }
          is_quantity_available={product.is_quantity_available}
          optionGroups={product.product_option_groups || []}
        />
      ) : null}
    </Stack>
  );

  return (
    <Container sx={{ py: SECTION_PADDING }}>
      <Stack direction={{ md: "row" }} spacing={2}>
        <Box flexShrink={0} maxWidth={{ md: "50%" }}>
          {renderSwiper}
        </Box>

        <Stack spacing={2} flexGrow={1}>
          <Card>
            <CardContent>
              {renderContent}

              {renderActions}
            </CardContent>
          </Card>

          {product.product_option_groups?.length > 0 ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("options")}
                </Typography>
                <ProductAddForm
                  product_id={product.product_id}
                  product_category_price_id={
                    measurement.product_category_price.product_category_price_id
                  }
                  is_quantity_available={product.is_quantity_available}
                  optionGroups={product.product_option_groups || []}
                />
              </CardContent>
            </Card>
          ) : null}
        </Stack>
      </Stack>
    </Container>
  );
}
