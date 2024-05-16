import { TileAtlasDimensionSettings } from "../app/tile-atlas-importer/TileAtlasImporterSlice.ts";

export const drawChessBoard = (
  ctx: CanvasRenderingContext2D,
  settingsX: TileAtlasDimensionSettings,
  settingsY: TileAtlasDimensionSettings,
) => {
  let lightCellColor = "#ddb18060";
  let darkCellColor = "#7c330c60";

  for (let y = 0; y < ctx.canvas.height; y++) {
    for (let x = 0; x < ctx.canvas.width; x++) {
      const offset = y % 2 === 0 ? 1 : 0;
      const color = (x + offset) % 2 === 0 ? lightCellColor : darkCellColor;
      ctx.fillStyle = color;
      ctx.fillRect(
        settingsX.offset + x * settingsX.tileSize + x * settingsX.separation,
        settingsY.offset + y * settingsY.tileSize + y * settingsY.separation,
        settingsX.tileSize,
        settingsY.tileSize,
      );
    }
  }
};
