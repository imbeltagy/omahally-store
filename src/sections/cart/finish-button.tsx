import { useSnackbar } from "notistack";
import { useTranslations } from "next-intl";
import { useMemo, useState, useCallback } from "react";

import { ButtonProps } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";

import { fDate } from "@/utils/format-time";

import { useCartStore } from "@/contexts/cart-store";
import { usecheckoutStore } from "@/contexts/checkout-store";
import { invalidateCaching } from "@/actions/cache-invalidation";
import { createOrder, CreateOrderBody } from "@/actions/cart-actions";

export default function FinishButton(props: ButtonProps) {
  const t = useTranslations("Pages.Cart.Summary");
  const { enqueueSnackbar } = useSnackbar();
  const { products, promocode, initCart } = useCartStore();
  const {
    paymentForm,
    choosenPayment,
    setStep,
    choosenDeliveryType,
    timeSlot,
    day,
    initCheckout,
    setOrderId,
    walletDiscount,
  } = usecheckoutStore();
  const [loading, setLoading] = useState(false);

  const disableFinish = useMemo(() => {
    let isPaymentValid = true;

    const { transaction_number, terms } = paymentForm;

    // Must select payment type
    if (!choosenPayment?.type) isPaymentValid = false;
    // Must fill transaction number if needed
    if (
      ["KURAIMI", "JAWALI", "JAIB"].includes(choosenPayment?.type || "") &&
      !transaction_number?.length
    )
      isPaymentValid = false;
    // Must agree with terms
    if (!terms) isPaymentValid = false;

    return !isPaymentValid;
  }, [choosenPayment?.type, paymentForm]);

  const handleFinish = useCallback(() => {
    const dataBody: CreateOrderBody = {
      section_id: products[0]?.section_id || "",
      promo_code: promocode?.code || "",
      note: paymentForm.notes,
      wallet_discount: walletDiscount || 0,
      payment_method: {
        payment_method_id: choosenPayment?.id || "",
        transaction_number: paymentForm.transaction_number || "",
        wallet_number: null,
      },
      delivery_type: choosenDeliveryType || "",
      slot_day: {
        slot_id: timeSlot?.id || "",
        day: fDate(day, "yyyy-MM-dd"),
      },
    };

    (async () => {
      setLoading(true);
      const res = await createOrder(dataBody);

      if ("error" in res) {
        enqueueSnackbar(res.error, { variant: "error" });
      } else {
        initCart();
        initCheckout();
        setOrderId(res.id || null);
        setStep((prev) => 3);
        invalidateCaching(paths.cart);
      }
      setLoading(false);
    })();
  }, [
    choosenDeliveryType,
    choosenPayment?.id,
    day,
    enqueueSnackbar,
    initCart,
    initCheckout,
    paymentForm.notes,
    paymentForm.transaction_number,
    products,
    promocode?.code,
    setOrderId,
    setStep,
    timeSlot?.id,
    walletDiscount,
  ]);

  return (
    <LoadingButton
      loading={loading}
      variant="contained"
      color="primary"
      {...props}
      onClick={() => handleFinish()}
      sx={{ flexGrow: 1 }}
      disabled={disableFinish}
    >
      {t("finish")}
    </LoadingButton>
  );
}
