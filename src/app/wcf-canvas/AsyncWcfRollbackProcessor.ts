import { RuleSet, TileId, WcfData } from "../../wfc/CommonTypes.ts";
import { hasAnyTileZeroEntropy, setTile } from "../../wfc/WcfTilePlacer.ts";
import {
  allTilesHaveBeenSelected,
  findTilesWithLowestEntropy,
  replaceSingleAllowedWithSelected,
  shuffleArray,
} from "../../wfc/WcfProcessor.ts";
import { renderWcfData } from "../util/TileMapRenderer.ts";
import { asyncDelay } from "../../util/AsyncDelay.ts";
import { CancellationToken } from "../util/CancellationToken.ts";

export type ProcessResult =
  | ProcessSuccess
  | ProcessError
  | ProcessCancelledByUser;

export interface ProcessSuccess {
  type: "success";
  wcfData: WcfData;
}

export interface ProcessCancelledByUser {
  type: "cancelled";
  wcfData: WcfData;
}

export interface ProcessError {
  type: "error";
  message: string;
  wcfData: WcfData;
}

export const processRollbackAndRenderAsync = async (
  ctx: CanvasRenderingContext2D,
  wcfData: WcfData,
  ruleSet: RuleSet,
  atlas: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
  allowZeroEntropyTiles: boolean,
  depth: number,
  cancellationToken: CancellationToken,
): Promise<ProcessResult> => {
  console.log("processRollbackAndRenderAsync", depth, tileWidth, tileHeight);

  if (cancellationToken.isCancelled()) {
    console.log("Cancelled by user.");
    renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
    return {
      type: "cancelled",
      wcfData,
    };
  }

  if (!allowZeroEntropyTiles && hasAnyTileZeroEntropy(wcfData)) {
    return {
      type: "error",
      message: "Found zero entropy.",
      wcfData,
    };
  }

  for (let j = 0; j < 10000; j++) {
    let workDone = false;
    try {
      workDone = replaceSingleAllowedWithSelected(wcfData, ruleSet);
    } catch (e) {
      renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
      if (e instanceof Error) {
        throw new Error("Collapsing failed: " + e.message);
      } else {
        throw new Error("Collapsing failed: Unknown reason");
      }
    }

    renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
    if (!workDone) {
      break;
    }
  }

  await asyncDelay(1);

  const { coordinates, entropy } = findTilesWithLowestEntropy(wcfData);

  if (entropy < 2) {
    return {
      type: "error",
      message: "Found entropy below 2.",
      wcfData,
    };
  }

  coordinates.forEach((c) => {
    console.log(wcfData[c.row][c.col]);
  });

  if (coordinates.length === 0) {
    // There are no more tiles that can be selected.
    if (allTilesHaveBeenSelected(wcfData)) {
      console.log("allTilesHaveBeenSelected");
      return {
        type: "success",
        wcfData,
      };
    } else {
      return {
        type: "error",
        message: "There are no more resolvable tiles.",
        wcfData,
      };
    }
  }

  const shuffledCoordinates = shuffleArray(coordinates);

  for (const c of shuffledCoordinates) {
    console.log("Random selecting x=" + c.row + " y=" + c.col);
    const tile = wcfData[c.row][c.col];

    if (tile.allowedTiles.length === 0) {
      return {
        type: "error",
        message: "Found tile with entropy 0.",
        wcfData,
      };
    }

    const allowedTiles = shuffleArray(tile.allowedTiles);

    console.log("Trying allowed tiles", allowedTiles);
    for (const allowedTile of allowedTiles) {
      console.log("allowedTile", allowedTile);
      const nextWcfData = structuredClone(wcfData);

      console.log("Draw tile id=" + allowedTile);
      setTile(c.col, c.row, allowedTile, nextWcfData, ruleSet);
      renderWcfData(ctx, nextWcfData, atlas, tileWidth, tileHeight);

      const result = await processRollbackAndRenderAsync(
        ctx,
        nextWcfData,
        ruleSet,
        atlas,
        tileWidth,
        tileHeight,
        allowZeroEntropyTiles,
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
    wcfData,
  };
};
