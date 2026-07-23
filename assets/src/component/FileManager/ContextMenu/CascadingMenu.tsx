import { Box, ListItemIcon, ListItemText, Menu, MenuItemProps, styled, useMediaQuery, useTheme } from "@mui/material";
import { bindFocus, bindHover } from "material-ui-popup-state";
import { bindMenu, bindTrigger, PopupState, usePopupState } from "material-ui-popup-state/hooks";
import { createContext, useCallback, useContext, useMemo } from "react";
import CaretRight from "../../Icons/CaretRight.tsx";
import { SquareMenuItem } from "./ContextMenu.tsx";
import HoverMenu from "./HoverMenu.tsx";
import { useAppSelector } from "../../../redux/hooks.ts";

export const CascadingContext = createContext<{
  parentPopupState?: PopupState;
  rootPopupState?: PopupState;
}>({});

export const SquareHoverMenu = styled(HoverMenu)<{ backgroundurl?: string }>(({ theme, backgroundurl }) => ({
  "& .MuiPaper-root": {
    minWidth: "200px",
    ...(backgroundurl && {
      backgroundColor: theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.6)" : "rgba(18, 18, 18, 0.7)",
      backdropFilter: "blur(16px) saturate(180%)",
      backgroundImage: "none",
    }),
  },
}));

export const SquareMenu = styled(Menu)<{ backgroundurl?: string }>(({ theme, backgroundurl }) => ({
  "& .MuiPaper-root": {
    minWidth: "200px",
    ...(backgroundurl && {
      backgroundColor: theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.6)" : "rgba(18, 18, 18, 0.7)",
      backdropFilter: "blur(16px) saturate(180%)",
      backgroundImage: "none",
    }),
  },
}));

export interface CascadingMenuItem {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  [key: string]: any;
}

export function CascadingMenuItem({ onClick, ...props }: CascadingMenuItem) {
  const { rootPopupState } = useContext(CascadingContext);
  if (!rootPopupState) throw new Error("must be used inside a CascadingMenu");
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      rootPopupState.close();
      if (onClick) onClick(event);
    },
    [rootPopupState, onClick],
  );

  return <SquareMenuItem {...props} onClick={handleClick} />;
}

export interface CascadingMenuProps {
  popupState: PopupState;
  isMobile?: boolean;
  [key: string]: any;
}

export function CascadingMenu({ popupState, isMobile, ...props }: CascadingMenuProps) {
  const { rootPopupState } = useContext(CascadingContext);
  const backgroundUrl = useAppSelector((state) => state.siteConfig.basic.config.custom_background_url);
  const context = useMemo(
    () => ({
      rootPopupState: rootPopupState || popupState,
      parentPopupState: popupState,
    }),
    [rootPopupState, popupState],
  );

  const MenuComponent = isMobile ? SquareMenu : SquareHoverMenu;

  return (
    <CascadingContext.Provider value={context}>
      <MenuComponent backgroundurl={backgroundUrl} {...props} {...bindMenu(popupState)} />
    </CascadingContext.Provider>
  );
}

export interface CascadingSubmenu {
  title: string;
  icon?: JSX.Element;
  popupId: string;
  menuItemProps?: MenuItemProps;
  [key: string]: any;
}

export function CascadingSubmenu({ title, popupId, menuItemProps, icon, ...props }: CascadingSubmenu) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { parentPopupState } = useContext(CascadingContext);
  const popupState = usePopupState({
    popupId,
    variant: "popover",
    parentPopupState,
  });
  return (
    <>
      <SquareMenuItem
        dense
        {...(isMobile ? bindTrigger(popupState) : bindHover(popupState))}
        {...(isMobile ? {} : bindFocus(popupState))}
        {...menuItemProps}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText
          primary={title}
          slotProps={{
            primary: { variant: "body2" },
          }}
        />
        <Box color="text.secondary" fontSize={"body2"} sx={{ display: "flex" }}>
          <CaretRight fontSize={"inherit"} />
        </Box>
      </SquareMenuItem>
      <CascadingMenu
        {...props}
        isMobile={isMobile}
        anchorOrigin={{ vertical: isMobile ? "bottom" : "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        popupState={popupState}
        MenuListProps={{
          dense: true,
        }}
      />
    </>
  );
}
