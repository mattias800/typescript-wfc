import {
  Coordinate,
  RuleSet,
  TileId,
  WfcData,
  WfcTile,
} from "./CommonTypes.ts";
import { collapseTile } from "./WfcTilePlacer.ts";
import { getRandomItem } from "../util/ListUtils.ts";
import { getWfcTile } from "./WfcTileFactory.ts";

export const process = (wfcData: WfcData, ruleSet: RuleSet): WfcData => {
  for (let i = 0; i < 10000; i++) {
    let workDoneInPass = false;
    for (let j = 0; j < 100; j++) {
      const workDone = replaceSingleAllowedWithSelected(wfcData, ruleSet);
      if (workDone) {
        workDoneInPass = true;
      }
      if (!workDone) {
        break;
      }
    }

    const { coordinates, entropy } = findTilesWithLowestEntropy(wfcData);
    if (entropy < 2) {
      throw new Error("Found entropy below 2.");
    }
    const c = getRandomItem(coordinates);

    if (c) {
      const tile = getWfcTile(wfcData, c.row, c.col);
      const randomAllowedTile = getRandomAllowedTile(tile);
      collapseTile(c.col, c.row, randomAllowedTile, wfcData, ruleSet);

      workDoneInPass = true;
    }

    if (!workDoneInPass) {
      // No more work can be done.
      break;
    }
  }

  return wfcData;
};

export const replaceSingleAllowedWithSelected = (
  wfcData: WfcData,
  ruleSet: RuleSet,
): boolean => {
  let anyTilesUpdated = false;
  for (let row = 0; row < wfcData.rows; row++) {
    for (let col = 0; col < wfcData.cols; col++) {
      const tile = getWfcTile(wfcData, row, col);
      if (!tile.collapsed && tile.options.length === 1) {
        console.log("Found one that can be collapsed!")
        collapseTile(col, row, tile.options[0], wfcData, ruleSet);
        anyTilesUpdated = true;
      }
    }
  }
  return anyTilesUpdated;
};

export const findTilesWithLowestEntropy = (
  wfcData: WfcData,
): { coordinates: Array<Coordinate>; entropy: number } => {
  const rows = wfcData.rows;
  const cols = wfcData.cols;

  let currentLowestEntropy = Infinity;
  let coordinatesWithLowestEntropy: Array<Coordinate> = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = getWfcTile(wfcData, row, col);
      if (tile.collapsed) {
        continue;
      }
      if (!tile.collapsed && tile.options.length === 0) {
        // Warning, tile cannot be resolved.
        continue;
      }

      if (tile.options.length === currentLowestEntropy) {
        coordinatesWithLowestEntropy.push({ row, col });
      }

      if (
        tile.options.length > 0 &&
        tile.options.length < currentLowestEntropy
      ) {
        currentLowestEntropy = tile.options.length;
        coordinatesWithLowestEntropy = [{ row, col }];
      }
    }
  }

  return {
    coordinates: coordinatesWithLowestEntropy,
    entropy: currentLowestEntropy,
  };
};

export const getRandomAllowedTile = (tile: WfcTile): TileId => {
  if (tile.collapsed) {
    throw new Error(
      "Trying to get random allowed tile, but tile has already been selected.",
    );
  }

  const randomIndex = Math.floor(Math.random() * tile.options.length);
  return tile.options[randomIndex];
};

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  // Create a copy of the array to avoid modifying the original array
  const shuffledArray = array.slice();

  // Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

export const allTilesHaveBeenSelected = (wfcData: WfcData): boolean => {
  const rows = wfcData.rows;
  const cols = wfcData.cols;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!getWfcTile(wfcData, row, col).collapsed) {
        return false;
      }
    }
  }
  return true;
};
