import { RuleSet, TileId, WfcData } from "../../wfc/CommonTypes.ts";
import {
  collapseTile,
  hasAnyTileZeroEntropy,
} from "../../wfc/WfcTilePlacer.ts";
import {
  allTilesHaveBeenSelected,
  findTilesWithLowestEntropy,
  shuffleArray,
} from "../../wfc/WfcProcessor.ts";
import { renderWfcData } from "../util/TileMapRenderer.ts";
import { CancellationToken } from "../util/CancellationToken.ts";
import { cloneWfcData, getWfcTile } from "../../wfc/WfcTileFactory.ts";
import { asyncDelay } from "../../util/AsyncDelay.ts";

export type ProcessResult =
  | ProcessSuccess
  | ProcessError
  | ProcessCancelledByUser;

export interface ProcessSuccess {
  type: "success";
  wfcData: WfcData;
}

export interface ProcessCancelledByUser {
  type: "cancelled";
  wfcData: WfcData;
}

export interface ProcessError {
  type: "error";
  message: string;
  wfcData: WfcData;
}

export const processRollbackAndRenderAsync = async (
  ctx: CanvasRenderingContext2D,
  wfcData: WfcData,
  ruleSet: RuleSet,
  atlas: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
  backtrackingEnabled: boolean,
  depth: number,
  cancellationToken: CancellationToken,
): Promise<ProcessResult> => {
  /*
              1. Find all lowest entropy, randomize list
              2. For each, randomize options
              3. For each, clone wcf data, set tile and update neighbours
              4. Call recursively
               */
  if (cancellationToken.isCancelled()) {
    renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);
    return {
      type: "cancelled",
      wfcData: wfcData,
    };
  }

  const lowestEntropy = findTilesWithLowestEntropy(wfcData);

  if (lowestEntropy.entropy < 2) {
    return {
      type: "error",
      message: "Found entropy below 2.",
      wfcData: wfcData,
    };
  }

  if (lowestEntropy.coordinates.length === 0) {
    // There are no more tiles that can be selected.
    if (allTilesHaveBeenSelected(wfcData)) {
      return {
        type: "success",
        wfcData: wfcData,
      };
    } else {
      return {
        type: "error",
        message: "There are no more resolvable tiles.",
        wfcData: wfcData,
      };
    }
  }
  const coordinates = shuffleArray(lowestEntropy.coordinates);

  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];

    const tile = getWfcTile(wfcData, coordinate.row, coordinate.col);
    const options = shuffleArray(tile.options);

    for (let j = 0; j < options.length; j++) {
      const option = options[j];

      const nextWfcData = cloneWfcData(wfcData);

      collapseTile(
        coordinate.col,
        coordinate.row,
        option,
        nextWfcData,
        ruleSet,
      );

      renderWfcData(ctx, nextWfcData, atlas, tileWidth, tileHeight);

      await asyncDelay(1);

      if (backtrackingEnabled && hasAnyTileZeroEntropy(wfcData)) {
        return {
          type: "error",
          message: "Collapse caused zero entropy.",
          wfcData: wfcData,
        };
      }

      const result = await processRollbackAndRenderAsync(
        ctx,
        nextWfcData,
        ruleSet,
        atlas,
        tileWidth,
        tileHeight,
        backtrackingEnabled,
        depth + 1,
        cancellationToken,
      );
      if (result.type === "success" || result.type === "cancelled") {
        return result;
      } else {
        // It failed, try the next one
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
