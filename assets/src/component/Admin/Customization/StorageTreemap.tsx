import {
  Box,
  Breadcrumbs,
  Card,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getFileList } from "../../../api/api";
import { FileResponse, FileType } from "../../../api/explorer";
import { useAppDispatch } from "../../../redux/hooks";
import ArrowLeft from "../../Icons/ArrowLeft";
import HardDrive from "../../Icons/HardDrive";
import PageContainer from "../../Pages/PageContainer";
import PageHeader from "../../Pages/PageHeader";

// Muted, elegant color palette (harmonized with modern dark/light themes)
export const EXTENSION_COLORS: Record<string, { color: string; bgLight: string; bgDark: string }> = {
  // Archives -> Subtle Muted Violet
  zip: { color: "#a855f7", bgLight: "rgba(168, 85, 247, 0.65)", bgDark: "rgba(168, 85, 247, 0.45)" },
  rar: { color: "#c084fc", bgLight: "rgba(192, 132, 252, 0.65)", bgDark: "rgba(192, 132, 252, 0.45)" },
  "7z": { color: "#a855f7", bgLight: "rgba(168, 85, 247, 0.65)", bgDark: "rgba(168, 85, 247, 0.45)" },
  tar: { color: "#9333ea", bgLight: "rgba(147, 51, 234, 0.65)", bgDark: "rgba(147, 51, 234, 0.45)" },
  gz: { color: "#7e22ce", bgLight: "rgba(126, 34, 206, 0.65)", bgDark: "rgba(126, 34, 206, 0.45)" },
  iso: { color: "#6b21a8", bgLight: "rgba(107, 33, 168, 0.65)", bgDark: "rgba(107, 33, 168, 0.45)" },

  // Video -> Muted Blue / Indigo
  mp4: { color: "#3b82f6", bgLight: "rgba(59, 130, 246, 0.65)", bgDark: "rgba(59, 130, 246, 0.45)" },
  mkv: { color: "#60a5fa", bgLight: "rgba(96, 165, 250, 0.65)", bgDark: "rgba(96, 165, 250, 0.45)" },
  avi: { color: "#2563eb", bgLight: "rgba(37, 99, 235, 0.65)", bgDark: "rgba(37, 99, 235, 0.45)" },
  mov: { color: "#93c5fd", bgLight: "rgba(147, 197, 253, 0.65)", bgDark: "rgba(147, 197, 253, 0.45)" },
  webm: { color: "#0284c7", bgLight: "rgba(2, 132, 199, 0.65)", bgDark: "rgba(2, 132, 199, 0.45)" },

  // Images -> Muted Soft Amber / Warm Yellow
  jpg: { color: "#eab308", bgLight: "rgba(234, 179, 8, 0.65)", bgDark: "rgba(234, 179, 8, 0.45)" },
  jpeg: { color: "#f59e0b", bgLight: "rgba(245, 158, 11, 0.65)", bgDark: "rgba(245, 158, 11, 0.45)" },
  png: { color: "#facc15", bgLight: "rgba(250, 204, 21, 0.65)", bgDark: "rgba(250, 204, 21, 0.45)" },
  gif: { color: "#fbbf24", bgLight: "rgba(251, 191, 36, 0.65)", bgDark: "rgba(251, 191, 36, 0.45)" },
  webp: { color: "#d97706", bgLight: "rgba(217, 119, 6, 0.65)", bgDark: "rgba(217, 119, 6, 0.45)" },

  // Executables / System -> Soft Crimson / Rose
  exe: { color: "#f43f5e", bgLight: "rgba(244, 63, 94, 0.65)", bgDark: "rgba(244, 63, 94, 0.45)" },
  dll: { color: "#e11d48", bgLight: "rgba(225, 29, 72, 0.65)", bgDark: "rgba(225, 29, 72, 0.45)" },
  bin: { color: "#be123c", bgLight: "rgba(190, 18, 60, 0.65)", bgDark: "rgba(190, 18, 60, 0.45)" },

  // Audio -> Soft Coral / Peach
  mp3: { color: "#fb7185", bgLight: "rgba(251, 113, 133, 0.65)", bgDark: "rgba(251, 113, 133, 0.45)" },
  flac: { color: "#fda4af", bgLight: "rgba(253, 164, 175, 0.65)", bgDark: "rgba(253, 164, 175, 0.45)" },
  wav: { color: "#f43f5e", bgLight: "rgba(244, 63, 94, 0.65)", bgDark: "rgba(244, 63, 94, 0.45)" },

  // Documents -> Muted Sage / Teal
  pdf: { color: "#10b981", bgLight: "rgba(16, 185, 129, 0.65)", bgDark: "rgba(16, 185, 129, 0.45)" },
  doc: { color: "#059669", bgLight: "rgba(5, 150, 105, 0.65)", bgDark: "rgba(5, 150, 105, 0.45)" },
  docx: { color: "#047857", bgLight: "rgba(4, 120, 87, 0.65)", bgDark: "rgba(4, 120, 87, 0.45)" },
  xls: { color: "#15803d", bgLight: "rgba(21, 128, 61, 0.65)", bgDark: "rgba(21, 128, 61, 0.45)" },
  xlsx: { color: "#166534", bgLight: "rgba(22, 101, 52, 0.65)", bgDark: "rgba(22, 101, 52, 0.45)" },

  // Code -> Muted Cyan
  js: { color: "#06b6d4", bgLight: "rgba(6, 182, 212, 0.65)", bgDark: "rgba(6, 182, 212, 0.45)" },
  ts: { color: "#0891b2", bgLight: "rgba(8, 145, 178, 0.65)", bgDark: "rgba(8, 145, 178, 0.45)" },
  py: { color: "#0e7490", bgLight: "rgba(14, 116, 144, 0.65)", bgDark: "rgba(14, 116, 144, 0.45)" },

  // Default fallback -> Soft Slate
  default: { color: "#64748b", bgLight: "rgba(100, 116, 139, 0.65)", bgDark: "rgba(100, 116, 139, 0.45)" },
};

export function getFileStyle(filename: string, isFolder: boolean, isDark: boolean) {
  if (isFolder) return { color: "#475569", bg: isDark ? "rgba(71, 85, 105, 0.45)" : "rgba(71, 85, 105, 0.65)" };
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const entry = EXTENSION_COLORS[ext] || EXTENSION_COLORS.default;
  return { color: entry.color, bg: isDark ? entry.bgDark : entry.bgLight };
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export interface FlatFile {
  file: FileResponse;
  fullPath: string;
  size: number;
  isFolder: boolean;
}

export interface TreemapTile {
  item: FlatFile;
  rect: { x: number; y: number; w: number; h: number };
}

// Canonical Bruls Squarified Treemap Algorithm
function worstAspect(rowSizes: number[], sideLength: number, totalArea: number): number {
  if (rowSizes.length === 0 || sideLength <= 0 || totalArea <= 0) return Infinity;
  const sum = rowSizes.reduce((a, b) => a + b, 0);
  if (sum === 0) return Infinity;

  const maxVal = Math.max(...rowSizes);
  const minVal = Math.min(...rowSizes);
  const s2 = sum * sum;
  const w2 = sideLength * sideLength;

  return Math.max((w2 * maxVal) / s2, s2 / (w2 * minVal));
}

function squarifyTreemap(
  items: FlatFile[],
  container: { x: number; y: number; w: number; h: number }
): TreemapTile[] {
  if (items.length === 0 || container.w <= 0 || container.h <= 0) return [];

  const totalSizeSum = items.reduce((acc, it) => acc + Math.max(it.size, 1), 0);
  if (totalSizeSum <= 0) return [];

  const tiles: TreemapTile[] = [];

  function layoutSubtree(
    remainingItems: FlatFile[],
    box: { x: number; y: number; w: number; h: number },
    remTotalSize: number
  ) {
    if (remainingItems.length === 0 || box.w <= 0 || box.h <= 0) return;

    if (remainingItems.length === 1) {
      tiles.push({ item: remainingItems[0], rect: box });
      return;
    }

    const sideLength = Math.min(box.w, box.h);
    const boxArea = box.w * box.h;

    const getArea = (item: FlatFile) => (Math.max(item.size, 1) / remTotalSize) * boxArea;

    let currentRow: FlatFile[] = [remainingItems[0]];
    let currentRowAreas = [getArea(remainingItems[0])];

    let i = 1;
    while (i < remainingItems.length) {
      const nextItem = remainingItems[i];
      const nextArea = getArea(nextItem);
      const testRowAreas = [...currentRowAreas, nextArea];

      if (
        worstAspect(testRowAreas, sideLength, boxArea) <=
        worstAspect(currentRowAreas, sideLength, boxArea)
      ) {
        currentRow.push(nextItem);
        currentRowAreas.push(nextArea);
        i++;
      } else {
        break;
      }
    }

    const rowAreaSum = currentRowAreas.reduce((a, b) => a + b, 0);
    const isVertical = box.w === sideLength;

    let rowW: number, rowH: number;
    if (isVertical) {
      rowW = box.w;
      rowH = rowAreaSum / box.w;
    } else {
      rowW = rowAreaSum / box.h;
      rowH = box.h;
    }

    let offset = 0;
    for (let idx = 0; idx < currentRow.length; idx++) {
      const item = currentRow[idx];
      const area = currentRowAreas[idx];

      let tileRect: { x: number; y: number; w: number; h: number };
      if (isVertical) {
        const itemW = area / rowH;
        tileRect = { x: box.x + offset, y: box.y, w: itemW, h: rowH };
        offset += itemW;
      } else {
        const itemH = area / rowW;
        tileRect = { x: box.x, y: box.y + offset, w: rowW, h: itemH };
        offset += itemH;
      }

      tiles.push({ item, rect: tileRect });
    }

    const nextRemaining = remainingItems.slice(currentRow.length);
    if (nextRemaining.length > 0) {
      const nextBox = isVertical
        ? { x: box.x, y: box.y + rowH, w: box.w, h: box.h - rowH }
        : { x: box.x + rowW, y: box.y, w: box.w - rowW, h: box.h };

      const nextRemTotal = nextRemaining.reduce((s, it) => s + Math.max(it.size, 1), 0);
      layoutSubtree(nextRemaining, nextBox, nextRemTotal);
    }
  }

  layoutSubtree(items, container, totalSizeSum);
  return tiles;
}

const StorageTreemap: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();

  // Navigation path stack
  const [pathStack, setPathStack] = useState<{ label: string; uri: string }[]>([
    { label: "Root", uri: "cloudreve://my" },
  ]);
  const currentUri = pathStack[pathStack.length - 1].uri;

  const [loading, setLoading] = useState<boolean>(true);
  const [indexingProgress, setIndexingProgress] = useState<string>("");
  const [flatFiles, setFlatFiles] = useState<FlatFile[]>([]);
  const [hoveredTile, setHoveredTile] = useState<TreemapTile | null>(null);
  const [selectedExt, setSelectedExt] = useState<string | null>(null);

  // Recursive directory scanner
  const loadDirectoryRecursive = useCallback(
    async (uri: string, pathPrefix: string, depth: number = 0): Promise<FlatFile[]> => {
      let results: FlatFile[] = [];
      try {
        const res: any = await dispatch(getFileList({ uri }));
        const files: FileResponse[] = res?.files || res?.data?.files || [];

        for (const file of files) {
          const isFolder = file.type === FileType.folder;
          const fullPath = `${pathPrefix}/${file.name}`;

          if (isFolder) {
            const folderSize = file.folder_summary?.size || file.size || 0;
            results.push({
              file,
              fullPath,
              size: folderSize,
              isFolder: true,
            });

            if (depth < 3) {
              const subUri = file.path || `${uri}/${file.name}`;
              setIndexingProgress(`Scanning ${file.name}...`);
              const subItems = await loadDirectoryRecursive(subUri, fullPath, depth + 1);
              results.push(...subItems);
            }
          } else {
            results.push({
              file,
              fullPath,
              size: file.size,
              isFolder: false,
            });
          }
        }
      } catch (err) {
        console.warn(`Error scanning directory ${uri}:`, err);
      }
      return results;
    },
    [dispatch]
  );

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setIndexingProgress("Scanning directory structure...");
    try {
      const allItems = await loadDirectoryRecursive(currentUri, pathStack[pathStack.length - 1].label, 0);
      setFlatFiles(allItems);
    } catch (err) {
      console.error("Failed to load recursive files:", err);
      setFlatFiles([]);
    } finally {
      setLoading(false);
      setIndexingProgress("");
    }
  }, [currentUri, loadDirectoryRecursive, pathStack]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const displayItems = useMemo(() => {
    const filesOnly = flatFiles.filter((f) => !f.isFolder);
    const items = filesOnly.length > 0 ? filesOnly : flatFiles;
    return items.sort((a, b) => b.size - a.size);
  }, [flatFiles]);

  const totalSize = useMemo(() => {
    return displayItems.reduce((acc, curr) => acc + curr.size, 0);
  }, [displayItems]);

  // Extension stats breakdown
  const extStats = useMemo(() => {
    const map: Record<string, { size: number; count: number; style: { color: string; bg: string } }> = {};
    for (const f of displayItems) {
      const ext = f.isFolder ? "folder" : f.file.name.split(".").pop()?.toLowerCase() || "other";
      if (!map[ext]) {
        map[ext] = { size: 0, count: 0, style: getFileStyle(f.file.name, f.isFolder, isDark) };
      }
      map[ext].size += f.size;
      map[ext].count += 1;
    }
    return Object.entries(map).sort((a, b) => b[1].size - a[1].size);
  }, [displayItems, isDark]);

  const navigate = useNavigate();

  const tiles = useMemo(() => {
    return squarifyTreemap(displayItems, { x: 0, y: 0, w: 100, h: 100 });
  }, [displayItems]);

  const handleTileClick = (item: FlatFile) => {
    const targetUri = item.file.path || `cloudreve://my/${item.file.name}`;
    if (item.isFolder) {
      navigate(`/home?path=${encodeURIComponent(targetUri)}`);
    } else {
      // For files, navigate to their parent directory in the browser
      const lastSlash = targetUri.lastIndexOf("/");
      const parentFolderUri = lastSlash > 0 ? targetUri.substring(0, lastSlash) : "cloudreve://my";
      navigate(`/home?path=${encodeURIComponent(parentFolderUri)}`);
    }
  };

  return (
    <PageContainer>
      <Box sx={{ p: 3 }}>
        <PageHeader title="Storage Treemap" onRefresh={fetchFiles} loading={loading} />

        {/* Top Control Bar with Glassmorphism */}
        <Card
          variant="outlined"
          sx={{
            mb: 2.5,
            p: 2,
            backdropFilter: "blur(16px)",
            backgroundColor: isDark ? "rgba(18, 18, 18, 0.75)" : "rgba(255, 255, 255, 0.8)",
            borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {pathStack.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => setPathStack((prev) => prev.slice(0, -1))}
                  sx={{ color: "primary.main" }}
                >
                  <ArrowLeft />
                </IconButton>
              )}
              <Breadcrumbs aria-label="breadcrumb">
                {pathStack.map((item, index) => {
                  const isLast = index === pathStack.length - 1;
                  return isLast ? (
                    <Typography key={item.uri} fontWeight={700} color="text.primary">
                      {item.label}
                    </Typography>
                  ) : (
                    <Link
                      key={item.uri}
                      component="button"
                      variant="body2"
                      underline="hover"
                      color="inherit"
                      onClick={() => setPathStack((prev) => prev.slice(0, index + 1))}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<HardDrive />}
                label={`Total: ${formatBytes(totalSize)} (${displayItems.length} files scanned)`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Stack>
        </Card>

        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: "block" }}>
              {indexingProgress || "Scanning directory structure..."}
            </Typography>
          </Box>
        )}

        {/* Glassmorphic WinDirStat Treemap Container */}
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            height: 560,
            position: "relative",
            backdropFilter: "blur(20px)",
            backgroundColor: isDark ? "rgba(18, 18, 18, 0.75)" : "rgba(255, 255, 255, 0.8)",
            borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.6)" : "0 12px 40px rgba(0,0,0,0.08)",
          }}
        >
          {tiles.length === 0 && !loading ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                No files to render in Treemap
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Upload files to visualize your disk space
              </Typography>
            </Box>
          ) : (
            tiles.map((tile, idx) => {
              const ext = tile.item.isFolder ? "folder" : tile.item.file.name.split(".").pop()?.toLowerCase() || "other";
              const style = getFileStyle(tile.item.file.name, tile.item.isFolder, isDark);
              const isDimmed = selectedExt && selectedExt !== ext;
              const percent = totalSize > 0 ? ((tile.item.size / totalSize) * 100).toFixed(1) : "0";

              return (
                <Tooltip
                  key={`${tile.item.fullPath}-${idx}`}
                  title={
                    <Box sx={{ p: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {tile.item.file.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Path: {tile.item.fullPath}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        Size: <strong>{formatBytes(tile.item.size)}</strong> ({percent}%)
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic", display: "block", mt: 0.5 }}>
                        Click to open in File Manager ↗
                      </Typography>
                    </Box>
                  }
                  arrow
                >
                  <Box
                    onClick={() => handleTileClick(tile.item)}
                    onMouseEnter={() => setHoveredTile(tile)}
                    onMouseLeave={() => setHoveredTile(null)}
                    sx={{
                      position: "absolute",
                      left: `${tile.rect.x}%`,
                      top: `${tile.rect.y}%`,
                      width: `${tile.rect.w}%`,
                      height: `${tile.rect.h}%`,
                      boxSizing: "border-box",
                      backgroundColor: style.bg,
                      backdropFilter: "blur(8px)",

                      // Sleek Glass linear gradient with subtle color transition
                      backgroundImage: isDark
                        ? `linear-gradient(135deg, ${style.bg} 0%, rgba(30, 41, 59, 0.4) 100%)`
                        : `linear-gradient(135deg, ${style.bg} 0%, rgba(255, 255, 255, 0.5) 100%)`,

                      opacity: isDimmed ? 0.15 : hoveredTile?.item.fullPath === tile.item.fullPath ? 1 : 0.88,
                      border: "1px solid",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                      cursor: tile.item.isFolder ? "pointer" : "default",
                      transition: "opacity 0.15s ease, transform 0.15s ease",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 0.3,
                      overflow: "hidden",
                      "&:hover": {
                        transform: "scale(1.01)",
                        zIndex: 20,
                        boxShadow: isDark
                          ? "0 8px 24px rgba(0, 0, 0, 0.6)"
                          : "0 8px 24px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    {tile.rect.w > 7 && tile.rect.h > 7 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: isDark ? "#f8fafc" : "#0f172a",
                          fontWeight: 700,
                          textAlign: "center",
                          wordBreak: "break-all",
                          lineHeight: 1.1,
                          fontSize: tile.rect.w > 12 && tile.rect.h > 12 ? "0.75rem" : "0.6rem",
                        }}
                      >
                        {tile.item.file.name}
                      </Typography>
                    )}
                    {tile.rect.w > 11 && tile.rect.h > 11 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: isDark ? "rgba(248, 250, 252, 0.8)" : "rgba(15, 23, 42, 0.7)",
                          fontWeight: 600,
                          fontSize: "0.6rem",
                        }}
                      >
                        {formatBytes(tile.item.size)}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              );
            })
          )}
        </Card>

        {/* Clean Glassmorphic Legend List */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            File Extensions Breakdown
          </Typography>
          <Card
            variant="outlined"
            sx={{
              backdropFilter: "blur(16px)",
              backgroundColor: isDark ? "rgba(18, 18, 18, 0.75)" : "rgba(255, 255, 255, 0.8)",
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Extension / Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Files Count</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Size</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Distribution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {extStats.map(([ext, stat]) => {
                    const isSelected = selectedExt === ext;
                    const percent = totalSize > 0 ? ((stat.size / totalSize) * 100).toFixed(1) : "0";

                    return (
                      <TableRow
                        key={ext}
                        hover
                        selected={isSelected}
                        onClick={() => setSelectedExt(isSelected ? null : ext)}
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 0.15s ease",
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "3px",
                                backgroundColor: stat.style.color,
                              }}
                            />
                            <Typography variant="body2" fontWeight={700} sx={{ textTransform: "uppercase" }}>
                              .{ext}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{stat.count} items</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} sx={{ color: stat.style.color }}>
                            {formatBytes(stat.size)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: "30%" }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={parseFloat(percent)}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: stat.style.color,
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="caption" fontWeight={600} sx={{ minWidth: 40 }}>
                              {percent}%
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default StorageTreemap;
