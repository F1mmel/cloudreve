import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext, useMemo } from "react";
import { defaultColors } from "../../../constants";
import CircleColorSelector, { customizeMagicColor } from "../../FileManager/FileInfo/ColorCircle/CircleColorSelector.tsx";
import Folder from "../../Icons/Folder.tsx";
import PageContainer from "../../Pages/PageContainer";
import PageHeader from "../../Pages/PageHeader";
import SettingsWrapper, { SettingContext } from "../Settings/SettingWrapper";

const CustomizationForm = () => {
  const { setSettings, values } = useContext(SettingContext);
  const theme = useTheme();

  const backgroundUrl = values.custom_background_url || "";
  const folderColor = values.custom_default_folder_color || theme.palette.action.active;
  const isTintedIcons = values.custom_tint_file_icons === "1" || values.custom_tint_file_icons === "true";

  const presetColors = useMemo(() => {
    return [theme.palette.action.active, ...defaultColors, customizeMagicColor];
  }, [theme]);

  return (
    <Box component={"form"} onSubmit={(e) => e.preventDefault()}>
      <Stack spacing={4}>
        {/* Background Image Card */}
        <Card
          variant="outlined"
          sx={{
            "body.has-custom-background &": {
              backgroundColor: "transparent",
              backgroundImage: "none",
              boxShadow: "none",
              border: "none",
            },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" gutterBottom>
              Background Image Configuration
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Enter a URL for a background image. This image will be loaded globally across all workspace views and dashboards, combined with a glassmorphism backdrop blur.
            </Typography>

            <TextField
              label="Background Image URL"
              fullWidth
              variant="outlined"
              placeholder="e.g. https://example.com/background.jpg"
              value={backgroundUrl}
              onChange={(e) => setSettings({ custom_background_url: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            {backgroundUrl && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Preview:
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundImage: `url(${backgroundUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Default Folder Color Card */}
        <Card
          variant="outlined"
          sx={{
            "body.has-custom-background &": {
              backgroundColor: "transparent",
              backgroundImage: "none",
              boxShadow: "none",
              border: "none",
            },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" gutterBottom>
              Default Folder Color
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Select the default color for folders and default icons across your cloud. Users can still customize individual folder colors via the context menu.
            </Typography>

            <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <CircleColorSelector
                  colors={presetColors}
                  selectedColor={folderColor}
                  onChange={(color) => {
                    const newColor = color === theme.palette.action.active ? "" : color;
                    setSettings({ custom_default_folder_color: newColor });
                    try {
                      const cached = localStorage.getItem("siteConfigCache_basic");
                      const current = cached ? JSON.parse(cached) : {};
                      localStorage.setItem("siteConfigCache_basic", JSON.stringify({ ...current, custom_default_folder_color: newColor }));
                    } catch (e) {}
                  }}
                />
              </Box>

              {/* Live Preview Box */}
              <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 90, p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <Folder sx={{ fontSize: 36, color: folderColor }} />
                <Typography variant="caption" fontWeight={600} color="textSecondary">
                  Preview
                </Typography>
              </Stack>
            </Stack>

            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isTintedIcons}
                    onChange={(e) => {
                      const val = e.target.checked ? "1" : "0";
                      setSettings({ custom_tint_file_icons: val });
                      try {
                        const cached = localStorage.getItem("siteConfigCache_basic");
                        const current = cached ? JSON.parse(cached) : {};
                        localStorage.setItem("siteConfigCache_basic", JSON.stringify({ ...current, custom_tint_file_icons: val }));
                      } catch (err) {}
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Use tinted icons
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Applies the selected custom color to specific file type icons such as .pdf, .exe, .zip, etc.
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

const Customization = () => {
  return (
    <PageContainer>
      <Box sx={{ p: 3 }}>
        <PageHeader title="Customization" />
        <SettingsWrapper settings={["custom_background_url", "custom_default_folder_color", "custom_tint_file_icons"]}>
          <CustomizationForm />
        </SettingsWrapper>
      </Box>
    </PageContainer>
  );
};

export default Customization;
