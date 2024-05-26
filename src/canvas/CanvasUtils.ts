import { TileAtlasDimensionSettings } from "../app/tile-atlas-importer/TileAtlasImporterSlice.ts";

const lightCellColor = "#ddb18060";
const darkCellColor = "#7c330c60";

export const drawChessBoard = (
  ctx: CanvasRenderingContext2D,
  settingsX: TileAtlasDimensionSettings,
  settingsY: TileAtlasDimensionSettings,
) => {
  const maxY = settingsY.limitNumTiles ? settingsY.numTilesLimit : 99;
  const maxX = settingsX.limitNumTiles ? settingsX.numTilesLimit : 99;

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
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
