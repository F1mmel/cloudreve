import { Box, Chip, Dialog, DialogProps, Divider, IconButton, useMediaQuery, useTheme } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileResponse } from "../../api/explorer.ts";
import FacebookCircularProgress from "../Common/CircularProgress.tsx";
import { NoWrapTypography } from "../Common/StyledComponents.tsx";
import { StyledDialogTitle } from "../Dialogs/DraggableDialog.tsx";
import FileIcon from "../FileManager/Explorer/FileIcon.tsx";
import Dismiss from "../Icons/Dismiss.tsx";
import FullScreenMaximize from "../Icons/FullScreenMaximize.tsx";
import FullScreenMinimize from "../Icons/FullScreenMinimize.tsx";

export interface ViewerDialogProps {
  file?: FileResponse;
  readOnly?: boolean;
  fullScreen?: boolean;
  actions?: React.ReactNode;
  fullScreenToggle?: boolean;
  dialogProps: DialogProps;
  loading?: boolean;
  children?: React.ReactNode;
  toggleFullScreen?: () => void;
}

export const ViewerLoading = ({ minHeight = "calc(100vh - 200px)" }: { minHeight?: string }) => (
  <Box
    sx={{
      width: "100%",
      height: "100%",
      border: "none",
      minHeight,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <FacebookCircularProgress />
  </Box>
);

const ViewerDialog = (props: ViewerDialogProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fullScreen, setFullScreen] = useState(props.fullScreen || isMobile);
  const onClose = useCallback(() => {
    props.dialogProps.onClose && props.dialogProps.onClose({}, "closeButtonClick" as any);
  }, [props.dialogProps.onClose]);

  const dialogProps = { ...props.dialogProps };
  delete dialogProps.PaperProps;

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={false}
      {...dialogProps}
      onClose={props.loading ? undefined : props.dialogProps.onClose}
      PaperProps={{
        sx: {
          maxWidth: fullScreen ? "100vw" : "96vw",
          width: fullScreen ? "100vw" : "96vw",
          maxHeight: fullScreen ? "100vh" : "94vh",
          height: fullScreen ? "100vh" : "94vh",
          m: fullScreen ? 0 : "auto",
          borderRadius: fullScreen ? 0 : 2,
          backdropFilter: "blur(24px)",
          backgroundColor: "rgba(10, 10, 12, 0.92)",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.8)",
        },
      }}
    >
      <Box sx={{ flexShrink: 0, backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
        <StyledDialogTitle sx={{ py: "4px", px: "12px", color: "#f8fafc" }} id="draggable-dialog-title">
          {props.actions && props.actions}
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <FileIcon variant={"default"} file={props.file} sx={{ px: 0, py: 0, pt: 0.5, mr: 1 }} fontSize={"small"} />
            <NoWrapTypography variant={"subtitle2"} sx={{ color: "#f8fafc", fontWeight: 600 }}>
              {props.file?.name}
            </NoWrapTypography>
            {props.readOnly && <Chip size="small" sx={{ ml: 1, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }} label={t("fileManager.readOnly")} />}
          </Box>
          <Box sx={{ display: "flex" }}>
            {props.fullScreenToggle && (
              <IconButton
                sx={{ color: "#cbd5e1" }}
                onClick={() => {
                  props.toggleFullScreen ? props.toggleFullScreen() : setFullScreen((s) => !s);
                }}
              >
                {fullScreen ? <FullScreenMinimize fontSize={"small"} /> : <FullScreenMaximize fontSize={"small"} />}
              </IconButton>
            )}
            <IconButton sx={{ color: "#cbd5e1" }} disabled={props.loading} onClick={onClose}>
              <Dismiss fontSize={"small"} />
            </IconButton>
          </Box>
        </StyledDialogTitle>
      </Box>
      <Box sx={{ flexGrow: 1, width: "100%", height: "calc(100% - 40px)", display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#000000" }}>
        {props.children}
      </Box>
    </Dialog>
  );
};

export default ViewerDialog;
