"use client";

import { useTranslations } from "next-intl";

import { Card, Stack, Typography, CardContent } from "@mui/material";

import { useCurrency } from "@/utils/format-number";

import { SingleShipment } from "@/types/order-shipment";

import RateButton from "./rate-button";
import CancelButton from "./cancel-button";
import ReturnButton from "./return-button";

export function OrderSummaryCard({ shipment }: { shipment: SingleShipment }) {
  const t = useTranslations("Pages.Orders");
  const currency = useCurrency();
  const canReturn =
    shipment.shipment_products.some((item) => item.can_return) &&
    checkStatus(shipment.status, ["DELIVERED", "COMPLETED"]);
  const canRate =
    !shipment.shipment_feedback &&
    checkStatus(shipment.status, ["DELIVERED", "COMPLETED"]);
  const canCancel = !checkStatus(shipment.status, [
    "CANCELED",
    "RETURNED",
    "DELIVERED",
    "COMPLETED",
  ]);

  const fields = [
    {
      label: t("products_price"),
      value: currency(shipment.order.products_price),
    },
    { label: t("delivery_fee"), value: currency(shipment.order.delivery_fee) },
    { label: t("total"), value: currency(shipment.order.total_price) },
    {
      label: t("payment_method"),
      value: t(`Payment.${shipment.order.payment_method}`),
    },
  ];

  return (
    <Card
      sx={{
        border: "1px solid #CFCFCF",
        borderRadius: "20px",
        padding: 0.3,
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          {fields.map((item) => (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 1 }}
              key={item.label}
            >
              <Typography variant="body2" fontWeight="500">
                {item.label}
              </Typography>
              <Typography variant="subtitle2" fontWeight="400">
                {item.value}
              </Typography>
            </Stack>
          ))}

          {(canReturn || canRate || canCancel) && (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              justifyContent="stretch"
              mt={2}
            >
              {canRate && shipment.driver && (
                <RateButton
                  orderId={shipment.order.id}
                  shipmentId={shipment.shipment_id}
                  driverId={shipment.driver.id}
                />
              )}
              {canReturn && <ReturnButton shipment={shipment} />}
              {canCancel && <CancelButton shipmentId={shipment.shipment_id} />}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function checkStatus(shipmentStatus: string, availableStatus: string[]) {
  return availableStatus.includes(shipmentStatus);
}
