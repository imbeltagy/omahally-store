import { forwardRef } from "react";
import RouterLink from "next/link";

import Link from "@mui/material/Link";
import Box, { BoxProps } from "@mui/material/Box";

import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  image?: string;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, image, ...other }, ref) => {
    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = image ? (
      <Box
        component="img"
        src={image}
        sx={{
          width: { xs: 35, sm: 50 },
          height: { xs: 35, sm: 50 },
          ...sx,
        }}
      />
    ) : (
      <Box
        sx={{
          width: { xs: 35, sm: 50 },
          height: { xs: 35, sm: 50 },
          ...sx,
        }}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link
        component={RouterLink}
        href={paths.home}
        sx={{ display: "contents", cursor: "pointer" }}
      >
        {logo}
      </Link>
    );
  },
);

export default Logo;
