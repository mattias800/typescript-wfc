import { RuleSet, TileId, WcfData } from "../../wfc/CommonTypes.ts";
import { setTile } from "../../wfc/WcfTilePlacer.ts";
import {
  allTilesHaveBeenSelected,
  findTilesWithLowestEntropy,
  replaceSingleAllowedWithSelected,
  shuffleArray,
} from "../../wfc/WcfProcessor.ts";
import { mapWcfDataToSourceMap } from "../../wfc/SourceMapMapper.ts";
import { renderTileMap } from "../util/TileMapRenderer.ts";
import { asyncDelay } from "../../util/AsyncDelay.ts";
import { CancellationToken } from "../util/CancellationToken.ts";

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

  for (let j = 0; j < 100; j++) {
    const workDone = replaceSingleAllowedWithSelected(wcfData, ruleSet);
    if (!workDone) {
      break;
    }
  }

  const tileMap = mapWcfDataToSourceMap(wcfData);
  ctx.reset();
  renderTileMap(ctx, tileMap, atlas, tileWidth, tileHeight);

  const coordinates = shuffleArray(findTilesWithLowestEntropy(wcfData, true));

  if (coordinates.length === 0) {
    // There are no more tiles that can be selected.
    if (allTilesHaveBeenSelected(wcfData)) {
      return wcfData;
    } else {
      throw new Error("There are no more resolvable tiles.");
    }
  }

  for (const c of coordinates) {
    await asyncDelay(0);
    const tile = wcfData[c.row][c.col];
    if (tile.allowedTiles.length === 0) {
      throw new Error("Tile has no allowed tiles.");
    }
    const allowedTiles = shuffleArray(tile.allowedTiles);
    for (const allowedTile of allowedTiles) {
      const nextWcfData = structuredClone(wcfData);
      try {
        setTile(c.col, c.row, allowedTile, nextWcfData, ruleSet);
        return await processAndRenderAsync(
          ctx,
          nextWcfData,
          ruleSet,
          atlas,
          tileWidth,
          tileHeight,
          depth + 1,
          cancellationToken,
        );
      } catch (e) {
        if (e instanceof Error) {
          console.log("Continue after unresolved: " + e.message);
        }
        if (cancellationToken.cancelled) {
          throw new Error("Cancelled by user.");
        }
        // Did not resolve
      }
    }
  }

  throw new Error("This should not be reached.");
};
