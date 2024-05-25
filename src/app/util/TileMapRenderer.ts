import { TileId, WcfData } from "../../wfc/CommonTypes.ts";
import { mapWcfDataToSourceMap } from "../../wfc/SourceMapMapper.ts";

export const renderWcfData = (
  ctx: CanvasRenderingContext2D,
  wcfData: WcfData,
  tileImages: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
) => {
  ctx.reset();
  const tileMap = mapWcfDataToSourceMap(wcfData);
  renderTileMap(ctx, tileMap, tileImages, tileWidth, tileHeight);
  renderAllowedNeighbours(ctx, wcfData, tileWidth, tileHeight);
};

export const renderTileMap = (
  ctx: CanvasRenderingContext2D,
  tileMap: Array<Array<TileId>>,
  tileImages: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
) => {
  for (let y = 0; y < tileMap.length; y++) {
    for (let x = 0; x < tileMap[y].length; x++) {
      const tileId = tileMap[y][x];
      if (tileId) {
        renderTile(ctx, tileImages[tileId], x * tileWidth, y * tileHeight);
      }
    }
  }
};

export const renderAllowedNeighbours = (
  ctx: CanvasRenderingContext2D,
  wcfData: WcfData,
  tileWidth: number,
  tileHeight: number,
) => {
  for (let y = 0; y < wcfData.length; y++) {
    for (let x = 0; x < wcfData[y].length; x++) {
      const tile = wcfData[y][x];
      if (!tile.selectedTile) {
        renderNumber(
          ctx,
          tile.allowedTiles.length,
          x * tileWidth + tileWidth / 2,
          y * tileHeight + tileHeight / 2,
        );
      }
    }
  }
};

export const renderTile = (
  ctx: CanvasRenderingContext2D,
  tile: HTMLImageElement,
  x: number,
  y: number,
) => {
  ctx.drawImage(tile, x, y);
};

export const renderNumber = (
  ctx: CanvasRenderingContext2D,
  num: number,
  x: number,
  y: number,
) => {
  ctx.font = "6px serif";
  ctx.fillText(String(num), x, y);
};
