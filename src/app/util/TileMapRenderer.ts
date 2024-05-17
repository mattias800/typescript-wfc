import { TileId } from "../../wfc/CommonTypes.ts";

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

export const renderTile = (
  ctx: CanvasRenderingContext2D,
  tile: HTMLImageElement,
  x: number,
  y: number,
) => {
  ctx.drawImage(tile, x, y);
};
