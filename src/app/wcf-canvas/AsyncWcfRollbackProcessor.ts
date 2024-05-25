import { RuleSet, TileId, WcfData } from "../../wfc/CommonTypes.ts";
import { setTile } from "../../wfc/WcfTilePlacer.ts";
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

  const coordinates = findTilesWithLowestEntropy(wcfData, true);

  console.log("Coordinates with lowest entropy", coordinates);
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
      throw new Error("There are no more resolvable tiles.");
    }
  }

  for (const c of coordinates) {
    console.log("Random selecting x=" + c.row + " y=" + c.col);
    await asyncDelay(10);
    const tile = wcfData[c.row][c.col];
    if (tile.allowedTiles.length === 0) {
      throw new Error("Tile has no allowed tiles.");
    }
    const allowedTiles = shuffleArray([...tile.allowedTiles]);

    console.log("Trying allowed tiles", allowedTiles);
    for (const allowedTile of allowedTiles) {
      console.log("allowedTile", allowedTile);
      const nextWcfData = structuredClone(wcfData);
      try {
        console.log("Draw tile id=" + allowedTile);
        setTile(c.col, c.row, allowedTile, nextWcfData, ruleSet);
        renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
        return await processRollbackAndRenderAsync(
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
        renderWcfData(ctx, wcfData, atlas, tileWidth, tileHeight);
        if (e instanceof Error) {
          console.log("Continue after unresolved: " + e.message);
        }
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
