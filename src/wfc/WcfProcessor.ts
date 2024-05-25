import {
  Coordinate,
  RuleSet,
  TileId,
  WcfData,
  WcfTile,
} from "./CommonTypes.ts";
import { setTile } from "./WcfTilePlacer.ts";
import { getRandomItem } from "../util/ListUtils.ts";

export const process = (wcfData: WcfData, ruleSet: RuleSet): WcfData => {
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

    const { coordinates, entropy } = findTilesWithLowestEntropy(wcfData);
    if (entropy < 2) {
      throw new Error("Found entropy below 2.");
    }
    const c = getRandomItem(coordinates);

    if (c) {
      const tile = wcfData[c.row][c.col];
      const randomAllowedTile = getRandomAllowedTile(tile);
      setTile(c.col, c.row, randomAllowedTile, wcfData, ruleSet);

      workDoneInPass = true;
    }

    if (!workDoneInPass) {
      // No more work can be done.
      break;
    }
  }

  return wcfData;
};

export const replaceSingleAllowedWithSelected = (
  wcfData: WcfData,
  ruleSet: RuleSet,
): boolean => {
  let anyTilesUpdated = false;
  const rows = wcfData.length;
  const cols = wcfData[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (
        !wcfData[row][col].selectedTile &&
        wcfData[row][col].allowedTiles.length === 1
      ) {
        setTile(col, row, wcfData[row][col].allowedTiles[0], wcfData, ruleSet);
        anyTilesUpdated = true;
      }
    }
  }
  return anyTilesUpdated;
};

export const findTilesWithLowestEntropy = (
  wcfData: WcfData,
): { coordinates: Array<Coordinate>; entropy: number } => {
  const rows = wcfData.length;
  const cols = wcfData[0].length;

  let currentLowestEntropy = Infinity;
  let coordinatesWithLowestEntropy: Array<Coordinate> = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = wcfData[row][col];
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

export const getRandomAllowedTile = (tile: WcfTile): TileId => {
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

export const allTilesHaveBeenSelected = (wcfData: WcfData): boolean => {
  const rows = wcfData.length;
  const cols = wcfData[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!wcfData[row][col].selectedTile) {
        return false;
      }
    }
  }
  return true;
};

export const cloneWcfData = (wcfData: WcfData): WcfData => {
  return wcfData.map((col) => [
    ...col.map((r) => ({
      selectedTile: r.selectedTile,
      allowedTiles: [...r.allowedTiles],
    })),
  ]);
};
