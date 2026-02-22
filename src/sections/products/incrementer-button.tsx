import { useSnackbar } from "notistack";
import { useState, forwardRef, useCallback } from "react";

import { Box, ButtonProps } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack, { StackProps } from "@mui/material/Stack";

import { useCartStore } from "@/contexts/cart-store";
import { removeCartProduct, updateCartProduct } from "@/actions/cart-actions";

import Iconify from "@/components/iconify";

// ----------------------------------------------------------------------

interface Props extends StackProps {
  cartProductId: string;
  is_quantity_available: boolean;
  addButtonProps?: ButtonProps;
  /** Vertical layout (e.g. for product card). Default horizontal for single product / cart. */
  orientation?: "horizontal" | "vertical";
}

const IncrementerButton = forwardRef<HTMLDivElement, Props>(
  (
    {
      cartProductId,
      is_quantity_available,
      addButtonProps,
      orientation = "horizontal",
      sx,
      ...other
    },
    ref,
  ) => {
    const { enqueueSnackbar } = useSnackbar();
    const { products, setProduct, removeProduct } = useCartStore();
    const [loading, setLoading] = useState(false);

    const product = products.find((item) => item.id === cartProductId);
    const quantity = product?.quantity || 0;

    const handleRemove = useCallback(() => {
      if (!product) return;
      (async () => {
        setLoading(true);
        const res = await removeCartProduct(product.id);

        if ("error" in res) {
          enqueueSnackbar(res.error, { variant: "error" });
        } else {
          removeProduct(product.id);
        }
        setLoading(false);
      })();
    }, [enqueueSnackbar, product, removeProduct, setLoading]);

    const handleIncrease = useCallback(() => {
      if (!product) return;
      (async () => {
        setLoading(true);
        const res = await updateCartProduct(product.id, quantity + 1);

        if ("error" in res) {
          enqueueSnackbar(res.error, { variant: "error" });
        } else {
          delete res.options;
          setProduct(res);
        }
        setLoading(false);
      })();
    }, [enqueueSnackbar, product, quantity, setProduct]);

    const handleDecrease = useCallback(() => {
      if (!product) return;
      (async () => {
        setLoading(true);
        const res = await updateCartProduct(product.id, quantity - 1);

        if ("error" in res) {
          enqueueSnackbar(res.error, { variant: "error" });
        } else {
          delete res.options;
          setProduct(res);
        }
        setLoading(false);
      })();
    }, [enqueueSnackbar, product, quantity, setProduct]);

    const isVertical = orientation === "vertical";

    return (
      <Stack
        ref={ref}
        flexShrink={0}
        direction={isVertical ? "column" : "row"}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 0.5,
          width: isVertical ? 40 : 88,
          borderRadius: 1,
          typography: "subtitle2",
          ...sx,
        }}
        {...other}
      >
        <LoadingButton
          size="small"
          variant="contained"
          color="primary"
          onClick={() =>
            quantity > (product?.min_order_quantity || 0)
              ? handleDecrease()
              : handleRemove()
          }
          sx={{ p: 1.25, minWidth: "fit-content" }}
          loading={loading}
        >
          <Iconify
            icon={
              quantity > (product?.min_order_quantity || 0)
                ? "eva:minus-fill"
                : "mage:trash"
            }
          />
        </LoadingButton>

        <Box px={1} pt={0.5} mx={1}>
          {quantity}
        </Box>

        <LoadingButton
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleIncrease()}
          disabled={quantity >= (product?.max_order_quantity || 0)}
          sx={{ p: 1.25, minWidth: "fit-content" }}
          loading={loading}
        >
          <Iconify icon="mingcute:add-line" />
        </LoadingButton>
      </Stack>
    );
  },
);

export default IncrementerButton;
