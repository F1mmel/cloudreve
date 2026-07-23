import { Box, Container, Grid, Paper } from "@mui/material";
import { Outlet, useNavigation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks.ts";
import AutoHeight from "../Common/AutoHeight.tsx";
import CircularProgress from "../Common/CircularProgress.tsx";
import LanguageSwitcher from "../Common/LanguageSwitcher.tsx";
import PoweredBy from "./PoweredBy.tsx";
import Logo from "../Common/Logo.tsx";
import { ConnectingLine, OAuthAppCard } from "./OauthAppCard.tsx";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        pt: 7,
        pb: 9,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

const HeadlessFrame = () => {
  const loading = useAppSelector((state) => state.globalState.loading.headlessFrame);
  const { custom_html, custom_background_url } = useAppSelector(
    (state) => state.siteConfig.basic?.config ?? {},
  );
  const { headless_footer, headless_bottom } = custom_html ?? {};
  const oauthApp = useAppSelector((state) => state.globalState.oauthApp);
  const oauthAppLoading = useAppSelector((state) => state.globalState.oauthAppLoading);
  let navigation = useNavigation();
  const showOAuthCard = oauthApp || oauthAppLoading;
  const backgroundUrl = custom_background_url || "";

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: backgroundUrl
          ? "transparent"
          : (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        "&::before": backgroundUrl
          ? {
              content: '""',
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: (theme) =>
                theme.palette.mode === "light"
                  ? `url(${backgroundUrl})`
                  : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(24px)",
              transform: "scale(1.15)",
              zIndex: -1,
            }
          : {},
      }}
    >
      <Container maxWidth={"xs"}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Box sx={{ width: "100%", py: 2 }}>
            {/* OAuth App Card - shown above the login panel */}
            {showOAuthCard && (
              <>
                <OAuthAppCard app={oauthApp} loading={!!oauthAppLoading && !oauthApp} />
                <ConnectingLine />
              </>
            )}
            <Paper
              sx={{
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(3)}`,
                backgroundColor: backgroundUrl
                  ? (theme) => (theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(30, 30, 30, 0.85)")
                  : undefined,
                backdropFilter: backgroundUrl ? "blur(12px) saturate(180%)" : "none",
                border: backgroundUrl ? (theme) => `1px solid ${theme.palette.divider}` : undefined,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Logo
                  sx={{
                    maxWidth: "40%",
                    maxHeight: "40px",
                  }}
                />
                {/* 语言切换按钮 */}
                <LanguageSwitcher />
              </Box>
              <AutoHeight>
                <div>
                  <Box
                    sx={{
                      display: loading || navigation.state !== "idle" ? "none" : "block",
                    }}
                  >
                    <Outlet />
                    {headless_bottom && (
                      <Box sx={{ width: "100%" }}>
                        <div dangerouslySetInnerHTML={{ __html: headless_bottom }} />
                      </Box>
                    )}
                  </Box>
                  {(loading || navigation.state !== "idle") && <Loading />}
                </div>
              </AutoHeight>
            </Paper>
          </Box>
          <PoweredBy />
          {headless_footer && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <div dangerouslySetInnerHTML={{ __html: headless_footer }} />
            </Box>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HeadlessFrame;
