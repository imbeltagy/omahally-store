import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import { alpha } from "@mui/material/styles";
import {
  Popper,
  MenuItem,
  TextField,
  ButtonBase,
  Autocomplete,
  TextFieldProps,
} from "@mui/material";

import { paths } from "@/routes/paths";

import { useDebounce } from "@/hooks/use-debounce";

import { searchProducts } from "@/actions/products-actions";

import Iconify from "@/components/iconify";

export default function StoreSearch() {
  const t = useTranslations("Global.Error");
  const router = useRouter();

  const [options, setOptions] = useState<Record<"name" | "id", string>[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 150);

  // Fetch on change
  useEffect(() => {
    (async () => {
      const res = await searchProducts(debouncedSearch);
      if (!("error" in res)) {
        setOptions(
          res?.map((item) => ({
            name: item.product_name,
            id: item.product_id,
          })) || [],
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleSearch = useCallback(
    (value: string) => {
      if (!value) return;
      router.push(`${paths.products}?search=${value}`, { scroll: false });
    },
    [router],
  );

  return (
    <Autocomplete
      options={options}
      renderOption={(props, option) => (
        <MenuItem
          {...props}
          key={option.id}
          onClick={() => {
            router.push(`${paths.products}/${option.id}`, {
              scroll: false,
            });
            setOptions([]);
          }}
        >
          {option.name}
        </MenuItem>
      )}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => {
        delete params.inputProps.value;
        delete params.inputProps.onChange;

        return (
          <SearchInput
            {...params}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSearch(search);
            }}
            onSubmit={() => {
              handleSearch(search);
            }}
          />
        );
      }}
      PopperComponent={(props: {
        open: boolean;
        sx?: any;
        [key: string]: any;
      }) => (
        <Popper {...props} sx={{ ...props.sx, minWidth: "20rem", pt: 0.5 }} />
      )}
      noOptionsText={t("no_products")}
      inputValue=""
      sx={{
        paddingInlineEnd: 1.5,
        flex: { xs: 1, sm: "1 1 auto" },
        maxWidth: { sm: 420 },
      }}
      fullWidth
    />
  );
}

function SearchInput({
  onSubmit,
  ...props
}: { onSubmit: VoidFunction } & TextFieldProps) {
  const t = useTranslations("Global.Label");

  return (
    <TextField
      {...props}
      sx={{
        mx: 1,
        "& .MuiFilledInput-root": {
          borderRadius: "9999px",
          minHeight: "32",
          height: "32",
          px: 0,
          paddingInlineStart: 1.5,
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          // paddingInlineEnd: 0.25,
        },
        "& .MuiFilledInput-input": {
          p: 0,
          py: "12px",
          "&::placeholder": {
            color: (theme) => alpha(theme.palette.primary.main, 0.7),
            opacity: 1,
          },
        },
        "& .MuiInputBase-root": {
          p: "8px 10px !important",
          paddingInlineStart: "2rem !important",
        },
      }}
      variant="filled"
      placeholder={t("search")}
      fullWidth
      InputProps={{
        ...props?.InputProps,
        disableUnderline: true,
        sx: {
          ...props?.InputProps?.sx,
          borderRadius: "9999px",
        },
        endAdornment: (
          <ButtonBase
            onClick={() => onSubmit()}
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <Iconify icon="material-symbols:search" width={22} />
          </ButtonBase>
        ),
      }}
    />
  );
}
