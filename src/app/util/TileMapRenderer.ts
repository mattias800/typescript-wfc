import { TileId, TileMap, WfcData } from "../../wfc/CommonTypes.ts";
import { mapWfcDataToSourceMap } from "../../wfc/SourceMapMapper.ts";
import { getTile, getWfcTile } from "../../wfc/WfcTileFactory.ts";

export const renderWfcData = (
  ctx: CanvasRenderingContext2D,
  wfcData: WfcData,
  tileImages: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
) => {
  ctx.reset();
  const tileMap = mapWfcDataToSourceMap(wfcData);
  renderTileMap(ctx, tileMap, tileImages, tileWidth, tileHeight);
  renderAllowedNeighbours(ctx, wfcData, tileWidth, tileHeight);
};

export const renderTileMap = (
  ctx: CanvasRenderingContext2D,
  tileMap: TileMap,
  tileImages: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
) => {
  for (let y = 0; y < tileMap.rows; y++) {
    for (let x = 0; x < tileMap.cols; x++) {
      const tileId = getTile(tileMap.tiles, y, x, tileMap.cols);
      if (tileId) {
        renderTile(ctx, tileImages[tileId], x * tileWidth, y * tileHeight);
      }
    }
  }
};

export const renderAllowedNeighbours = (
  ctx: CanvasRenderingContext2D,
  wfcData: WfcData,
  tileWidth: number,
  tileHeight: number,
) => {
  for (let y = 0; y < wfcData.rows; y++) {
    for (let x = 0; x < wfcData.cols; x++) {
      const tile = getWfcTile(wfcData, y, x);
      if (!tile.collapsed) {
        renderOptions(ctx, tile.options.length, x, y, tileWidth, tileHeight);
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

export const renderOptions = (
  ctx: CanvasRenderingContext2D,
  num: number,
  col: number,
  row: number,
  tileWidth: number,
  tileHeight: number,
) => {
  if (num === 0) {
    ctx.fillStyle = "rgba(201,97,97,0.38)";
    ctx.fillRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
  }
  ctx.font = "6px serif";
  ctx.fillStyle = "#000000FF";
  ctx.fillText(
    String(num),
    col * tileWidth + tileWidth / 2,
    row * tileHeight + tileHeight / 2,
  );
};
