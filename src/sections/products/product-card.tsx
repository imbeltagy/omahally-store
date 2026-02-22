"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  Stack,
  Button,
  styled,
  CardMedia,
  CardProps,
  Typography,
  CardContent,
} from "@mui/material";

import { RouterLink } from "@/routes/components";

import { useCurrency } from "@/utils/format-number";

import { useCartStore } from "@/contexts/cart-store";
import { addProductToCart } from "@/actions/cart-actions";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import { useSnackbar } from "@/components/snackbar";

import { Offer, Product } from "@/types/products";

import IncrementerButton from "./incrementer-button";

interface Props {
  product: Product | Offer;
  href: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&.selected": { boxShadow: `0px 0px 0px 1px ${theme.palette.primary.main}` },
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.customShadows.primary,
    zIndex: 9,
  },
  borderRadius: theme.shape.borderRadius,
}));

export function ProductCard({
  product,
  href,
  ...cardProps
}: Props & CardProps) {
  const t = useTranslations("Pages.Home.Product");
  const { setProduct } = useCartStore();
  const { enqueueSnackbar } = useSnackbar();
  const [adding, setAdding] = useState(false);

  const { products } = useCartStore();

  const cartProduct = products.find(
    (item) => item.product_id === product.product_id,
  );

  const offerPrice = product.offer_price;
  const originalPrice = product.product_price;
  const finalPrice = offerPrice ?? originalPrice;

  const currency = useCurrency();

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!product.is_quantity_available || adding) return;
      setAdding(true);
      try {
        const res = await addProductToCart({
          product_category_price_id: product.product_category_price_id,
          options: [],
          quantity: product.min_order_quantity,
        });
        if ("error" in res) {
          enqueueSnackbar(res.error ?? "Failed to add product to cart", {
            variant: "error",
          });
          return;
        }
        setProduct(res);
        enqueueSnackbar("Product added to cart", { variant: "success" });
      } catch {
        enqueueSnackbar("Failed to add product to cart", { variant: "error" });
      } finally {
        setAdding(false);
      }
    },
    [product, adding, setProduct, enqueueSnackbar],
  );

  const renderButton = () => {
    if (!product.direct_add)
      return (
        <Button
          component={RouterLink}
          href={href}
          variant="contained"
          color="primary"
          fullWidth
          disabled={!product.is_quantity_available}
          startIcon={<Iconify icon="bxs:cart-alt" />}
          sx={{ mt: 1 }}
        >
          {t("add_to_cart")}
        </Button>
      );

    if (!cartProduct)
      return (
        <LoadingButton
          type="button"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!product.is_quantity_available || adding}
          startIcon={<Iconify icon="bxs:cart-alt" />}
          sx={{ mt: 1 }}
          onClick={handleAddToCart}
          loading={adding}
        >
          {t("add_to_cart")}
        </LoadingButton>
      );

    return (
      <IncrementerButton
        cartProductId={cartProduct.id}
        is_quantity_available={product.is_quantity_available}
        sx={{ width: "100%" }}
      />
    );
  };

  return (
    <StyledCard {...cardProps} className={cardProps.className}>
      <Box
        className="card-clickable-layer"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          cursor: "pointer",
        }}
        href={href}
        scroll={false}
        component={Link}
      />

      <CardMedia
        src={product.product_logo}
        alt={product.product_name}
        sx={{
          height: "auto",
          aspectRatio: "4/5",
          objectFit: "contain",
          cursor: "pointer",
          marginTop: 1.5,
        }}
        component="img"
      />

      {!product.is_quantity_available && (
        <Label
          color="error"
          sx={{
            position: "absolute",
            top: 6,
            insetInlineStart: 6,
          }}
        >
          {t("no_available")}
        </Label>
      )}

      {cartProduct && (
        <Label
          color="primary"
          sx={{
            position: "absolute",
            top: 6,
            insetInlineEnd: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Iconify icon="bxs:cart-alt" width={14} />
          {t("in_cart")}
        </Label>
      )}

      <CardContent
        spacing={0.5}
        flexGrow={1}
        component={Stack}
        sx={{ p: ".5rem !important", paddingBottom: ".6rem !important" }}
      >
        <Typography variant="body1" fontWeight={600} component="p">
          {product.product_name}
        </Typography>
        {/* <Typography variant="caption">{product.measurement_unit}</Typography> */}
        <Box flexGrow={1} aria-hidden />
        <Typography fontWeight={600} color="primary" suppressHydrationWarning>
          {offerPrice && (
            <Typography component="del" color="text.disabled">
              {currency(originalPrice, false)}
            </Typography>
          )}{" "}
          {currency(finalPrice)}
        </Typography>

        {renderButton()}
      </CardContent>
    </StyledCard>
  );
}
