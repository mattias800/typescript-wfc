import { RuleSet, TileId, WfcData } from "./CommonTypes.ts";

export const setTile = (
  col: number,
  row: number,
  tile: TileId,
  wfcData: WfcData,
  ruleSet: RuleSet,
) => {
  console.log("setTile x=" + col + " y=" + row + " tileId=" + tile);
  wfcData[row][col].selectedTile = tile;
  updateNeighboursAllowedTiles(col, row, wfcData, ruleSet);
};

export const updateNeighboursAllowedTiles = (
  col: number,
  row: number,
  wfcData: WfcData,
  ruleSet: RuleSet,
): void => {
  const rows = wfcData.length;
  const cols = wfcData[0].length;

  if (row > 0) {
    const hasChanges = updateAllowedTiles(col, row - 1, wfcData, ruleSet);
    if (hasChanges) {
      updateNeighboursAllowedTiles(col, row - 1, wfcData, ruleSet);
    }
  }
  if (row < rows - 1) {
    const hasChanges = updateAllowedTiles(col, row + 1, wfcData, ruleSet);
    if (hasChanges) {
      updateNeighboursAllowedTiles(col, row + 1, wfcData, ruleSet);
    }
  }
  if (col > 0) {
    const hasChanges = updateAllowedTiles(col - 1, row, wfcData, ruleSet);
    if (hasChanges) {
      updateNeighboursAllowedTiles(col - 1, row, wfcData, ruleSet);
    }
  }
  if (col < cols - 1) {
    const hasChanges = updateAllowedTiles(col + 1, row, wfcData, ruleSet);
    if (hasChanges) {
      updateNeighboursAllowedTiles(col + 1, row, wfcData, ruleSet);
    }
  }
};

export const updateAllowedTiles = (
  col: number,
  row: number,
  wfcData: WfcData,
  ruleSet: RuleSet,
): boolean => {
  if (wfcData[row][col].selectedTile) {
    return false;
  }
  const prevAllowedTiles = wfcData[row][col].allowedTiles;
  const nextAllowedTiles = calculateAllowedTiles(col, row, wfcData, ruleSet);
  wfcData[row][col].allowedTiles = nextAllowedTiles;
  return prevAllowedTiles.length !== nextAllowedTiles.length;
};

export const calculateAllowedTiles = (
  col: number,
  row: number,
  wfcData: WfcData,
  ruleSet: RuleSet,
): Array<TileId> => {
  const rows = wfcData.length;
  const cols = wfcData[0].length;

  const allTiles: Array<TileId> = Object.keys(ruleSet);

  const notAllowed: Array<TileId> = [];

  if (col > 0) {
    const tileId = wfcData[row][col - 1].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.right));
    }
  }
  if (col < cols - 1) {
    const tileId = wfcData[row][col + 1].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.left));
    }
  }
  if (row > 0) {
    const tileId = wfcData[row - 1][col].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.down));
    }
  }
  if (row < rows - 1) {
    const tileId = wfcData[row + 1][col].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.up));
    }
  }

  return allTiles.filter((tileId) => !notAllowed.includes(tileId));
};

const getNotAllowed = (
  all: Array<TileId>,
  allowed: Array<TileId>,
): Array<TileId> => {
  return all.filter((tileId) => !allowed.includes(tileId));
};

const concatUnique = <T>(list1: Array<T>, list2: Array<T>) => {
  list2.forEach((item) => {
    if (!list1.includes(item)) {
      list1.push(item);
    }
  });
};

export const hasAnyNeighbourZeroEntropy = (
  col: number,
  row: number,
  wfcData: WfcData,
): boolean => {
  const rows = wfcData.length;
  const cols = wfcData[0].length;

  if (row > 0) {
    if (wfcData[row][col - 1].allowedTiles.length === 0) {
      return true;
    }
  }
  if (row < rows - 1) {
    if (wfcData[row][col + 1].allowedTiles.length === 0) {
      return true;
    }
  }
  if (col > 0) {
    if (wfcData[row - 1][col].allowedTiles.length === 0) {
      return true;
    }
  }
  if (col < cols - 1) {
    if (wfcData[row + 1][col].allowedTiles.length === 0) {
      return true;
    }
  }
  return false;
};

export const hasAnyTileZeroEntropy = (wfcData: WfcData): boolean => {
  const rows = wfcData.length;
  const cols = wfcData[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (wfcData[row][col].allowedTiles.length === 0) {
        return true;
      }
    }
  }
  return false;
};
