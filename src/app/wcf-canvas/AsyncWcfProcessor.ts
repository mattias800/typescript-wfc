import { RuleSet, TileId, WcfData } from "../../wfc/CommonTypes.ts";
import { setTile } from "../../wfc/WcfTilePlacer.ts";
import {
  getRandomAllowedTile,
  getRandomCoordinateWithLowestEntropy,
  replaceSingleAllowedWithSelected,
} from "../../wfc/WcfProcessor.ts";
import { mapWcfDataToSourceMap } from "../../wfc/SourceMapMapper.ts";
import { renderTileMap } from "../util/TileMapRenderer.ts";
import { asyncDelay } from "../../util/AsyncDelay.ts";

export const processAndRenderAsync = async (
  ctx: CanvasRenderingContext2D,
  wcfData: WcfData,
  ruleSet: RuleSet,
  atlas: Record<TileId, HTMLImageElement>,
  tileWidth: number,
  tileHeight: number,
) => {
  for (let i = 0; i < 10000; i++) {
    let workDoneInPass = false;
    for (let j = 0; j < 100; j++) {
      const workDone = replaceSingleAllowedWithSelected(wcfData, ruleSet);
      if (workDone) {
        workDoneInPass = true;
      }
      if (!workDone) {
        break;
      }
    }

    const tileMap = mapWcfDataToSourceMap(wcfData);
    renderTileMap(ctx, tileMap, atlas, tileWidth, tileHeight);

    await asyncDelay(10);

    const c = getRandomCoordinateWithLowestEntropy(wcfData);

    if (c) {
      let tile = wcfData[c.row][c.col];
      const randomAllowedTile = getRandomAllowedTile(tile);
      setTile(c.col, c.row, randomAllowedTile, wcfData, ruleSet);

      workDoneInPass = true;
    }

    if (!workDoneInPass) {
      // No more work can be done.
      break;
    }

    await asyncDelay(10);
  }
};
