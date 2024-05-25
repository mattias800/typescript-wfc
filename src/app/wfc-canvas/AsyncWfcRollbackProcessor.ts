import { RuleSet, TileId, WfcData } from "../../wfc/CommonTypes.ts";
import { hasAnyTileZeroEntropy, setTile } from "../../wfc/WfcTilePlacer.ts";
import {
  allTilesHaveBeenSelected,
  findTilesWithLowestEntropy,
  replaceSingleAllowedWithSelected,
  shuffleArray,
} from "../../wfc/WfcProcessor.ts";
import { renderWfcData } from "../util/TileMapRenderer.ts";
import { asyncDelay } from "../../util/AsyncDelay.ts";
import { CancellationToken } from "../util/CancellationToken.ts";

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
  if (cancellationToken.isCancelled()) {
    renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);
    return {
      type: "cancelled",
      wfcData: wfcData,
    };
  }

  if (backtrackingEnabled && hasAnyTileZeroEntropy(wfcData)) {
    return {
      type: "error",
      message: "Found zero entropy.",
      wfcData: wfcData,
    };
  }

  for (let j = 0; j < 10000; j++) {
    let workDone = false;
    try {
      workDone = replaceSingleAllowedWithSelected(wfcData, ruleSet);
    } catch (e) {
      renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);
      if (e instanceof Error) {
        throw new Error("Collapsing failed: " + e.message);
      } else {
        throw new Error("Collapsing failed: Unknown reason");
      }
    }

    renderWfcData(ctx, wfcData, atlas, tileWidth, tileHeight);
    if (!workDone) {
      break;
    }
  }

  await asyncDelay(1);

  const { coordinates, entropy } = findTilesWithLowestEntropy(wfcData);

  if (entropy < 2) {
    return {
      type: "error",
      message: "Found entropy below 2.",
      wfcData: wfcData,
    };
  }

  if (coordinates.length === 0) {
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

  const shuffledCoordinates = shuffleArray(coordinates);

  for (const c of shuffledCoordinates) {
    const tile = wfcData[c.row][c.col];

    if (tile.allowedTiles.length === 0) {
      return {
        type: "error",
        message: "Found tile with entropy 0.",
        wfcData: wfcData,
      };
    }

    const allowedTiles = shuffleArray(tile.allowedTiles);

    for (const allowedTile of allowedTiles) {
      const nextWfcData = structuredClone(wfcData);

      setTile(c.col, c.row, allowedTile, nextWfcData, ruleSet);
      renderWfcData(ctx, nextWfcData, atlas, tileWidth, tileHeight);

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