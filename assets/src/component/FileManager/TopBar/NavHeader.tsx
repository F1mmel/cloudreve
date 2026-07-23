import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import Breadcrumb from "./Breadcrumb.tsx";
import TopActions from "./TopActions.tsx";
import { RadiusFrame } from "../../Frame/RadiusFrame.tsx";
import TopActionsSecondary from "./TopActionsSecondary.tsx";
import { SearchIndicator } from "../Search/SearchIndicator.tsx";

const NavHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack
      direction={"row"}
      spacing={1}
      sx={{
        px: isMobile ? 2 : "initial",
        width: "100%",
      }}
    >
      <RadiusFrame
        sx={{
          flexGrow: 1,
          p: 0.5,
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        withBorder
      >
        <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden", flexGrow: 1 }}>
          <Breadcrumb />
          <SearchIndicator />
        </Box>
        {!isMobile && (
          <Box sx={{ ml: 1, flexShrink: 0 }}>
            <TopActionsSecondary />
          </Box>
        )}
      </RadiusFrame>
      <RadiusFrame sx={{ display: "flex", alignItems: "center" }}>
        <TopActions />
      </RadiusFrame>
    </Stack>
  );
};

export default NavHeader;
