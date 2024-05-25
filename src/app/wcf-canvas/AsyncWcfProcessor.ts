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
import { ProcessResult } from "./AsyncWcfRollbackProcessor.ts";

export const processAndRenderAsync = async (
  ctx: CanvasRenderingContext2D,
  wcfData: WcfData,
  ruleSet: RuleSet,
  atlas: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
  depth: number,
  cancellationToken: CancellationToken,
): Promise<ProcessResult> => {
  console.log("processAndRenderAsync", depth);

  if (cancellationToken.isCancelled()) {
    console.log("Cancelled by user.");
    renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
    return {
      type: "cancelled",
      wcfData,
    };
  }

  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < 10000; j++) {
      console.log("Collapsing tiles");
      let workDone = false;
      try {
        workDone = replaceSingleAllowedWithSelected(wcfData, ruleSet);
      } catch (e) {
        renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
        return {
          type: "error",
          message: "Failed then collapsing tiles.",
          wcfData,
        };
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

    const { coordinates, entropy } = findTilesWithLowestEntropy(wcfData);

    if (entropy < 2) {
      return {
        type: "error",
        message: "Found entropy below 2.",
        wcfData,
      };
    }

    const c = getRandomItem(coordinates);

    await asyncDelay(10);
    const tile = wcfData[c.row][c.col];

    if (tile.allowedTiles.length === 0) {
      return {
        type: "error",
        message: "Tried to place tile, but tile has no allowed possibilities.",
        wcfData,
      };
    }

    const allowedTile = getRandomItem(tile.allowedTiles);

    console.log("allowedTile", allowedTile);

    try {
      console.log("Draw tile id=" + allowedTile);
      setTile(c.col, c.row, allowedTile, wcfData, ruleSet);
      renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
    } catch (e) {
      renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
      if (e instanceof Error) {
        return {
          type: "error",
          message: e.message,
          wcfData,
        };
      } else {
        return {
          type: "error",
          message: "Unknown error when setting tile.",
          wcfData,
        };
      }
    }
  }

  return {
    type: "error",
    message:
      "All possible placements of lowest entropy tiles caused unresolvable tiles.",
    wcfData,
  };
};
