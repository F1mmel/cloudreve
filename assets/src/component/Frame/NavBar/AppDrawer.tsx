import { Box, Drawer, Popover, PopoverProps, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks.ts";
import SessionManager from "../../../session";
import TreeNavigation from "../../FileManager/TreeView/TreeNavigation.tsx";
import { PageVariant, PageVariantContext } from "../NavBarFrame.tsx";
import DrawerHeader from "./DrawerHeader.tsx";
import PageNavigation, { AdminPageNavigation } from "./PageNavigation.tsx";
import StorageSummary from "./StorageSummary.tsx";

const DrawerContent = () => {
  const { sidebar_bottom } = useAppSelector((state) => state.siteConfig.basic?.config?.custom_html ?? {});
  const scrollRef = useRef<any>();
  const user = SessionManager.currentLoginOrNull();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pageVariant = useContext(PageVariantContext);
  const isDashboard = pageVariant === PageVariant.dashboard;
  return (
    <>
      <DrawerHeader />
      <Stack
        direction={"column"}
        spacing={2}
        ref={scrollRef}
        sx={{
          px: 1,
          pb: 1,
          flexGrow: 1,
          mx: 1,
          overflow: "auto",
        }}
      >
        {!isDashboard && (
          <>
            <TreeNavigation scrollRef={scrollRef} hideWithDrawer={!isMobile} />
            <PageNavigation />
            {user && <StorageSummary />}
          </>
        )}
        {isDashboard && <AdminPageNavigation />}
        {sidebar_bottom && (
          <Box sx={{ width: "100%" }}>
            <div dangerouslySetInnerHTML={{ __html: sidebar_bottom }} />
          </Box>
        )}
      </Stack>
    </>
  );
};

export const DrawerPopover = (props: PopoverProps) => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.globalState.drawerOpen);
  const drawerWidth = useAppSelector((state) => state.globalState.drawerWidth);
  return (
    <Popover {...props}>
      <Box sx={{ width: "70vw" }}>
        <DrawerContent />
      </Box>
    </Popover>
  );
};

const AppDrawer = () => {
  const theme = useTheme();
  const open = useAppSelector((state) => state.globalState.drawerOpen);
  const drawerWidth = useAppSelector((state) => state.globalState.drawerWidth);
  const appBarBg = theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900];
  const backgroundUrl = useAppSelector((state) => state.siteConfig.basic.config.custom_background_url);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: "flex",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: backgroundUrl
            ? (theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.45)" : "rgba(18, 18, 18, 0.45)")
            : appBarBg,
          backdropFilter: backgroundUrl ? "blur(16px) saturate(180%)" : "none",
          borderRight: backgroundUrl ? `1px solid ${theme.palette.divider}` : "initial",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerContent />
    </Drawer>
  );
};

export default AppDrawer;
