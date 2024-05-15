import {
  Coordinate,
  RuleSet,
  TileId,
  WcfData,
  WcfTile,
} from "./CommonTypes.ts";
import { setTile } from "./WcfTilePlacer.ts";

export const process = (wcfData: WcfData, ruleSet: RuleSet): WcfData => {
  for (let i = 0; i < 5; i++) {
    let workDoneInPass = false;
    for (let j = 0; j < 5; j++) {
      const workDone = replaceSingleAllowedWithSelected(wcfData, ruleSet);
      if (workDone) {
        workDoneInPass = true;
      }
      if (!workDone) {
        break;
      }
    }

    const c = findRandomTileWithAllowed(wcfData);

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

export const findRandomTileWithAllowed = (
  wcfData: WcfData,
): Coordinate | undefined => {
  const rows = wcfData.length;
  const cols = wcfData[0].length;

  let currentTile: WcfTile | undefined = undefined;
  let currentCoordinate: Coordinate | undefined = undefined;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = wcfData[row][col];
      if (tile.selectedTile) {
        continue;
      }
      if (
        currentTile == null ||
        (tile.allowedTiles.length > 0 &&
          tile.allowedTiles.length < currentTile.allowedTiles.length)
      ) {
        currentTile = tile;
        currentCoordinate = { row, col };
      }
    }
  }

  return currentCoordinate;
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
