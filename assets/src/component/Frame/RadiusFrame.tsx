import { Box, useTheme } from "@mui/material";
import React from "react";
import { useAppSelector } from "../../redux/hooks.ts";

export const RadiusFrame = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Box> & {
    withBorder?: boolean;
    square?: boolean;
  }
>((props, ref) => {
  const { withBorder, square, sx, ...rest } = props;
  const theme = useTheme();
  const backgroundUrl = useAppSelector((state) => state.siteConfig.basic.config.custom_background_url);

  return (
    <Box
      ref={ref}
      sx={{
        borderRadius: square ? 0 : theme.shape.borderRadius,
        backgroundColor: backgroundUrl
          ? (theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.45)" : "rgba(18, 18, 18, 0.45)")
          : theme.palette.background.paper,
        backdropFilter: backgroundUrl ? "blur(12px) saturate(180%)" : "none",
        border: withBorder ? `1px solid ${theme.palette.divider}` : "initial",
        ...sx,
      }}
      {...rest}
    />
  );
});
