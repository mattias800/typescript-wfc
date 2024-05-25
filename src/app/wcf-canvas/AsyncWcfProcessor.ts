import { RuleSet, TileId, WcfData } from "../../wfc/CommonTypes.ts";
import { setTile } from "../../wfc/WcfTilePlacer.ts";
import {
  findTilesWithLowestEntropy,
  replaceSingleAllowedWithSelected,
} from "../../wfc/WcfProcessor.ts";
import { mapWcfDataToSourceMap } from "../../wfc/SourceMapMapper.ts";
import { renderTileMap, renderWcfData } from "../util/TileMapRenderer.ts";
import { asyncDelay } from "../../util/AsyncDelay.ts";
import { CancellationToken } from "../util/CancellationToken.ts";
import { getRandomItem } from "../../util/ListUtils.ts";

export const processAndRenderAsync = async (
  ctx: CanvasRenderingContext2D,
  wcfData: WcfData,
  ruleSet: RuleSet,
  atlas: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
  depth: number,
  cancellationToken: CancellationToken,
): Promise<WcfData> => {
  console.log("processAndRenderAsync", depth);
  cancellationToken.throwIfCancelled();

  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < 10000; j++) {
      console.log("Collapsing tiles");
      let workDone = false;
      try {
        workDone = replaceSingleAllowedWithSelected(wcfData, ruleSet);
      } catch (e) {
        renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
        return wcfData;
      }
      const tileMap = mapWcfDataToSourceMap(wcfData);
      ctx.reset();
      renderTileMap(ctx, tileMap, atlas, tileWidth, tileHeight);
      if (!workDone) {
        console.log("Collapse done! Mo more tiles found.");
        break;
      }
      console.log("Collapse work done! Trying again");
    }

    renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);

    const coordinates = findTilesWithLowestEntropy(wcfData, true);
    console.log("coordinates with lowest entropy", coordinates);
    const c = getRandomItem(coordinates);

    await asyncDelay(10);
    const tile = wcfData[c.row][c.col];
    if (tile.allowedTiles.length === 0) {
      throw new Error("Tile has no allowed tiles.");
    }
    const allowedTile = getRandomItem(tile.allowedTiles);

    console.log("allowedTile", allowedTile);

    try {
      console.log("Draw tile id=" + allowedTile);
      setTile(c.col, c.row, allowedTile, wcfData, ruleSet);
    } catch (e) {
      if (e instanceof Error) {
        console.log("Set tile failed: " + e.message);
        renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
        return wcfData;
      }
      if (cancellationToken.cancelled) {
        throw new Error("Cancelled by user.");
      }
      // Did not resolve
    } finally {
      renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
    }
  }

  return wcfData;
};
