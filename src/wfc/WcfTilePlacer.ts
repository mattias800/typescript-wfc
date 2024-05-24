import { RuleSet, TileId, WcfData } from "./CommonTypes.ts";

export const setTile = (
  col: number,
  row: number,
  tile: TileId,
  wcfData: WcfData,
  ruleSet: RuleSet,
) => {
  wcfData[row][col].selectedTile = tile;
  updateNeighboursAllowedTiles(col, row, wcfData, ruleSet);
};

export const updateNeighboursAllowedTiles = (
  col: number,
  row: number,
  wcfData: WcfData,
  ruleSet: RuleSet,
): void => {
  const rows = wcfData.length;
  const cols = wcfData[0].length;

  if (row > 0) {
    const hasChanges = updateAllowedTiles(col, row - 1, wcfData, ruleSet);
    if (hasChanges) {
      updateNeighboursAllowedTiles(col, row - 1, wcfData, ruleSet);
    }
  }
  if (row < rows - 1) {
    const hasChanges = updateAllowedTiles(col, row + 1, wcfData, ruleSet);
    if (hasChanges) {
      updateNeighboursAllowedTiles(col, row + 1, wcfData, ruleSet);
    }
  }
  if (col > 0) {
    const hasChanges = updateAllowedTiles(col - 1, row, wcfData, ruleSet);
    if (hasChanges) {
      updateNeighboursAllowedTiles(col - 1, row, wcfData, ruleSet);
    }
  }
  if (col < cols - 1) {
    const hasChanges = updateAllowedTiles(col + 1, row, wcfData, ruleSet);
    if (hasChanges) {
      updateNeighboursAllowedTiles(col + 1, row, wcfData, ruleSet);
    }
  }
};

export const updateAllowedTiles = (
  col: number,
  row: number,
  wcfData: WcfData,
  ruleSet: RuleSet,
): boolean => {
  const prevAllowedTiles = wcfData[row][col].allowedTiles;
  const nextAllowedTiles = calculateAllowedTiles(col, row, wcfData, ruleSet);
  if (nextAllowedTiles.length === 0) {
    throw new Error("updateAllowedTiles caused 0 allowed tiles.");
  }
  wcfData[row][col].allowedTiles = nextAllowedTiles;
  return prevAllowedTiles.length !== nextAllowedTiles.length;
};

export const calculateAllowedTiles = (
  col: number,
  row: number,
  wcfData: WcfData,
  ruleSet: RuleSet,
): Array<TileId> => {
  const rows = wcfData.length;
  const cols = wcfData[0].length;

  const allTiles: Array<TileId> = Object.keys(ruleSet);

  const notAllowed: Array<TileId> = [];

  if (col > 0) {
    const tileId = wcfData[row][col - 1].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.right));
    }
  }
  if (col < cols - 1) {
    const tileId = wcfData[row][col + 1].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.left));
    }
  }
  if (row > 0) {
    const tileId = wcfData[row - 1][col].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.down));
    }
  }
  if (row < rows - 1) {
    const tileId = wcfData[row + 1][col].selectedTile;
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
