import { RuleSet, TileId, WfcData } from "../../wfc/CommonTypes.ts";
import { collapseTile } from "../../wfc/WfcTilePlacer.ts";
import {
  findTilesWithLowestEntropy,
  replaceSingleAllowedWithSelected,
} from "../../wfc/WfcProcessor.ts";
import { mapWfcDataToSourceMap } from "../../wfc/SourceMapMapper.ts";
import { renderTileMap, renderWfcData } from "../util/TileMapRenderer.ts";
import { asyncDelay } from "../../util/AsyncDelay.ts";
import { CancellationToken } from "../util/CancellationToken.ts";
import { getRandomItem } from "../../util/ListUtils.ts";
import { ProcessResult } from "./AsyncWfcRollbackProcessor.ts";
import { getWfcTile } from "../../wfc/WfcTileFactory.ts";

export const processAndRenderAsync = async (
  ctx: CanvasRenderingContext2D,
  wfcData: WfcData,
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
    renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);
    return {
      type: "cancelled",
      wfcData: wfcData,
    };
  }

  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < 10000; j++) {
      console.log("Collapsing tiles");
      let workDone = false;
      try {
        workDone = replaceSingleAllowedWithSelected(wfcData, ruleSet);
      } catch (e) {
        renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);
        return {
          type: "error",
          message: "Failed then collapsing tiles.",
          wfcData: wfcData,
        };
      }
      const tileMap = mapWfcDataToSourceMap(wfcData);
      ctx.reset();
      renderTileMap(ctx, tileMap, atlas, tileWidth, tileHeight);
      if (!workDone) {
        console.log("Collapse done! Mo more tiles found.");
        break;
      }
      console.log("Collapse work done! Trying again");
    }

    renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);

    const { coordinates, entropy } = findTilesWithLowestEntropy(wfcData);

    if (entropy < 2) {
      return {
        type: "error",
        message: "Found entropy below 2.",
        wfcData: wfcData,
      };
    }

    const c = getRandomItem(coordinates);

    await asyncDelay(10);
    const tile = getWfcTile(wfcData, c.row, c.col);

    if (tile.options.length === 0) {
      return {
        type: "error",
        message: "Tried to place tile, but tile has no allowed possibilities.",
        wfcData: wfcData,
      };
    }

    const allowedTile = getRandomItem(tile.options);

    console.log("allowedTile", allowedTile);

    try {
      console.log("Draw tile id=" + allowedTile);
      collapseTile(c.col, c.row, allowedTile, wfcData, ruleSet);
      renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);
    } catch (e) {
      renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);
      if (e instanceof Error) {
        return {
          type: "error",
          message: e.message,
          wfcData: wfcData,
        };
      } else {
        return {
          type: "error",
          message: "Unknown error when setting tile.",
          wfcData: wfcData,
        };
      }
    }
  }

  return {
    type: "error",
    message:
      "All possible placements of lowest entropy tiles caused unresolvable tiles.",
    wfcData: wfcData,
  };
};
