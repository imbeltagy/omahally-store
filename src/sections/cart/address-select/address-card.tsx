import { useCallback } from "react";
import { useSnackbar } from "notistack";
import { useTranslations } from "next-intl";

import {
  Button,
  CardHeader,
  Typography,
  CardActions,
  CardContent,
  cardHeaderClasses,
} from "@mui/material";

import { deleteAddress } from "@/actions/profile-actions";
import { usecheckoutStore } from "@/contexts/checkout-store";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import ActiveCard from "@/components/active-card";

import { FullAddress } from "@/types/profile";

interface Props {
  address: FullAddress;
  selectedItem: FullAddress | null;
  setSelectedItem: (address: FullAddress | null) => void;
  handleEdit: () => void;
}

export default function AddressCard({
  address,
  selectedItem,
  setSelectedItem,
  handleEdit,
}: Props) {
  const t = useTranslations("Pages.Cart.Location");
  const { enqueueSnackbar } = useSnackbar();
  const { setAddresses } = usecheckoutStore();
  const active = selectedItem?.id === address.id;

  const handleDelete = useCallback(
    (id: string) => {
      (async () => {
        const res = await deleteAddress(id);

        if ("error" in res) {
          enqueueSnackbar(res.error, { variant: "error" });
        } else {
          enqueueSnackbar(t("delete_success"), { variant: "success" });
          setAddresses((prev) => prev.filter((item) => item.id !== id));
        }
      })();
    },
    [enqueueSnackbar, setAddresses, t],
  );

  return (
    <ActiveCard
      active={active}
      onClick={() => setSelectedItem(address)}
      sx={{
        bgcolor: (theme) =>
          active
            ? theme.palette.primary.lighter
            : theme.palette.background.default,
        transition: (theme) =>
          `all ${theme.transitions.duration.standard}ms ease`,
      }}
    >
      <CardHeader
        sx={{
          [`& .${cardHeaderClasses.title}`]: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            wordBreak: "break-word",
          },
        }}
        title={
          <>
            {address.name}
            {active && (
              <Label variant="filled" color="primary">
                {t("default")}
              </Label>
            )}
          </>
        }
        action={
          active && (
            <Iconify
              icon="icon-park-solid:check-one"
              color="primary.main"
              mt={0.8}
              width={24}
            />
          )
        }
      />
      <CardContent>
        <Typography fontWeight={600}>{address.address}</Typography>
        <Typography>{t("phone", { phone: address.phone })}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          onClick={() => handleDelete(address.id)}
          sx={{
            flexShrink: 0,
            bgcolor: "background.default",
            "&:hover": { bgcolor: "background.default" },
          }}
        >
          <Iconify icon="tabler:trash" />
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleEdit()}
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            "&:hover": { bgcolor: "background.default" },
          }}
        >
          {t("edit")}
        </Button>
      </CardActions>
    </ActiveCard>
  );
}
