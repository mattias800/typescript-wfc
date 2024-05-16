import {
  Coordinate,
  RuleSet,
  TileId,
  WcfData,
  WcfTile,
} from "./CommonTypes.ts";
import { setTile } from "./WcfTilePlacer.ts";

export const process = (wcfData: WcfData, ruleSet: RuleSet): WcfData => {
  for (let i = 0; i < 100; i++) {
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

export const getRandomCoordinateWithLowestEntropy = (
  wcfData: WcfData,
): Coordinate | undefined => {
  const possibleCoordinates = findTilesWithLowestEntropy(wcfData);
  if (possibleCoordinates.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * possibleCoordinates.length);
  return possibleCoordinates[randomIndex];
};

export const findTilesWithLowestEntropy = (
  wcfData: WcfData,
): Array<Coordinate> => {
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
        console.log("Warning, tile cannot be resolved.");
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

  return coordinatesWithLowestEntropy;
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
