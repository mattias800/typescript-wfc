import {
  Coordinate,
  RuleSet,
  TileId,
  WfcData,
  WfcTile,
} from "./CommonTypes.ts";
import { setTile } from "./WfcTilePlacer.ts";
import { getRandomItem } from "../util/ListUtils.ts";

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
      const tile = wfcData[c.row][c.col];
      const randomAllowedTile = getRandomAllowedTile(tile);
      setTile(c.col, c.row, randomAllowedTile, wfcData, ruleSet);

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
  const rows = wfcData.length;
  const cols = wfcData[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (
        !wfcData[row][col].selectedTile &&
        wfcData[row][col].allowedTiles.length === 1
      ) {
        setTile(col, row, wfcData[row][col].allowedTiles[0], wfcData, ruleSet);
        anyTilesUpdated = true;
      }
    }
  }
  return anyTilesUpdated;
};

export const findTilesWithLowestEntropy = (
  wfcData: WfcData,
): { coordinates: Array<Coordinate>; entropy: number } => {
  const rows = wfcData.length;
  const cols = wfcData[0].length;

  let currentLowestEntropy = Infinity;
  let coordinatesWithLowestEntropy: Array<Coordinate> = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = wfcData[row][col];
      if (tile.selectedTile) {
        continue;
      }
      if (!tile.selectedTile && tile.allowedTiles.length === 0) {
        // Warning, tile cannot be resolved.
        continue;
      }

      if (tile.allowedTiles.length === currentLowestEntropy) {
        coordinatesWithLowestEntropy.push({ row, col });
      }

      if (
        tile.allowedTiles.length > 0 &&
        tile.allowedTiles.length < currentLowestEntropy
      ) {
        currentLowestEntropy = tile.allowedTiles.length;
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
  if (tile.selectedTile) {
    throw new Error(
      "Trying to get random allowed tile, but tile has already been selected.",
    );
  }

  const randomIndex = Math.floor(Math.random() * tile.allowedTiles.length);
  return tile.allowedTiles[randomIndex];
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
  const rows = wfcData.length;
  const cols = wfcData[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!wfcData[row][col].selectedTile) {
        return false;
      }
    }
  }
  return true;
};
