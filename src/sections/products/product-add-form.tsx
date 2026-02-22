"use client";

import { useSnackbar } from "notistack";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import { Stack, useMediaQuery } from "@mui/material";

import { useAuthContext } from "@/auth/hooks";
import { useCartStore } from "@/contexts/cart-store";
import { useNoGuestStore } from "@/contexts/no-guest";
import { addProductToCart } from "@/actions/cart-actions";

import Iconify from "@/components/iconify";

import { ProductOptionGroup } from "@/types/products";

import IncrementerButton from "./incrementer-button";
import ProductOptionsSelector from "./product-options-selector";

interface Props {
  product_id: string;
  product_category_price_id: string;
  is_quantity_available: boolean;
  optionGroups: ProductOptionGroup[];
}

export default function ProductAddForm({
  product_id,
  product_category_price_id,
  is_quantity_available,
  optionGroups,
}: Props) {
  const t = useTranslations("Pages.Home.Product");
  const { enqueueSnackbar } = useSnackbar();
  const { authenticated } = useAuthContext();
  const { setOpen: setNoGuestDialogOpen } = useNoGuestStore();
  const isMd = useMediaQuery("(min-width:450px)");
  const { setProduct, products } = useCartStore();
  const cartProduct = products.find((item) => item.product_id === product_id);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Initialize selectedOptions with default options
  const initializeDefaults = useCallback(() => {
    const defaults: string[] = [];
    optionGroups.forEach((group) => {
      group.options.forEach((option) => {
        if (option.is_default) {
          defaults.push(option.id);
          // Also add default child options if any
          if (option.child_groups) {
            option.child_groups.forEach((childGroup) => {
              childGroup.options.forEach((childOption) => {
                if (childOption.is_default) {
                  defaults.push(childOption.id);
                }
              });
            });
          }
        }
      });
    });
    if (defaults.length > 0) {
      setSelectedOptions(defaults);
    }
  }, [optionGroups]);

  // Initialize defaults on mount
  useEffect(() => {
    initializeDefaults();
  }, [initializeDefaults]);

  const validateOptions = useCallback(() => {
    const groupErrors = optionGroups.map((group) => {
      const groupSelectedOptions = selectedOptions.filter((id) =>
        group.options.some((opt) => opt.id === id),
      );
      const selectedCount = groupSelectedOptions.length;

      // Check min selection
      if (selectedCount < group.min_selection) {
        return t("Options.select_at_least_for", {
          count: group.min_selection,
          name: group.name,
        });
      }

      // Check max selection
      if (group.max_selection > 0 && selectedCount > group.max_selection) {
        return t("Options.select_at_most_for", {
          count: group.max_selection,
          name: group.name,
        });
      }

      // Check child groups for selected parent options
      const childErrors = group.options
        .filter(
          (option) =>
            selectedOptions.includes(option.id) && option.child_groups,
        )
        .flatMap(
          (option) =>
            option.child_groups?.map((childGroup) => {
              const childSelectedOptions = selectedOptions.filter((id) =>
                childGroup.options.some((opt) => opt.id === id),
              );
              const childSelectedCount = childSelectedOptions.length;

              if (childSelectedCount < childGroup.min_selection) {
                return t("Options.select_at_least_for", {
                  count: childGroup.min_selection,
                  name: childGroup.name,
                });
              }

              if (
                childGroup.max_selection > 0 &&
                childSelectedCount > childGroup.max_selection
              ) {
                return t("Options.select_at_most_for", {
                  count: childGroup.max_selection,
                  name: childGroup.name,
                });
              }

              return null;
            }) || [],
        );

      const firstChildError = childErrors.find((err) => err !== null);
      if (firstChildError) {
        return firstChildError;
      }

      return null;
    });

    return groupErrors.find((err) => err !== null) || null;
  }, [selectedOptions, optionGroups, t]);

  const handleAddToCart = useCallback(async () => {
    if (!authenticated) {
      setNoGuestDialogOpen(true);
      return;
    }

    // Validate options
    const validationError = validateOptions();
    if (validationError) {
      enqueueSnackbar(validationError, { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      // Add single item to cart
      const res = await addProductToCart({
        product_category_price_id,
        options: selectedOptions,
      });

      if ("error" in res) {
        enqueueSnackbar(res.error, { variant: "error" });
        setLoading(false);
        return;
      }

      setProduct(res);

      // Reset after successful add
      const defaults: string[] = [];
      optionGroups.forEach((group) => {
        group.options.forEach((option) => {
          if (option.is_default) {
            defaults.push(option.id);
            // Also add default child options if any
            if (option.child_groups) {
              option.child_groups.forEach((childGroup) => {
                childGroup.options.forEach((childOption) => {
                  if (childOption.is_default) {
                    defaults.push(childOption.id);
                  }
                });
              });
            }
          }
        });
      });
      setSelectedOptions(defaults);
      enqueueSnackbar("Product added to cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add product to cart", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [
    authenticated,
    validateOptions,
    setNoGuestDialogOpen,
    enqueueSnackbar,
    optionGroups,
    product_category_price_id,
    selectedOptions,
    setProduct,
  ]);

  return (
    <Stack spacing={3} alignItems="flex-start">
      {/* Options Selector */}
      {optionGroups.length > 0 && (
        <ProductOptionsSelector
          optionGroups={optionGroups}
          selectedOptions={selectedOptions}
          onOptionsChange={setSelectedOptions}
        />
      )}

      {/* Add to Cart Button */}
      {cartProduct ? (
        <IncrementerButton
          cartProductId={cartProduct.id}
          is_quantity_available={is_quantity_available}
        />
      ) : (
        <LoadingButton
          variant="contained"
          color="primary"
          startIcon={isMd && <Iconify icon="bxs:cart-alt" />}
          onClick={handleAddToCart}
          disabled={!is_quantity_available}
          loading={loading}
          fullWidth={!isMd}
        >
          {t("add_to_cart")}
        </LoadingButton>
      )}
    </Stack>
  );
}
