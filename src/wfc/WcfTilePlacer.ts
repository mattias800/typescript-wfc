import { RuleSet, TileId, WcfData } from "./CommonTypes.ts";

export const setTile = (
  col: number,
  row: number,
  tile: TileId,
  wcfData: WcfData,
  ruleSet: RuleSet,
): WcfData => {
  wcfData[row][col].selectedTile = tile;
  updateAllowedTiles(col, row - 1, wcfData, ruleSet);
  updateAllowedTiles(col, row + 1, wcfData, ruleSet);
  updateAllowedTiles(col - 1, row, wcfData, ruleSet);
  updateAllowedTiles(col + 1, row, wcfData, ruleSet);
  return wcfData;
};

export const updateAllowedTiles = (
  col: number,
  row: number,
  wcfData: WcfData,
  ruleSet: RuleSet,
): WcfData => {
  wcfData[row][col].allowedTiles = calculateAllowedTiles(
    col,
    row,
    wcfData,
    ruleSet,
  );
  return wcfData;
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
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId].right));
    }
  }
  if (col < cols - 1) {
    const tileId = wcfData[row][col + 1].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId].left));
    }
  }
  if (row > 0) {
    const tileId = wcfData[row - 1][col].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId].down));
    }
  }
  if (row < rows - 1) {
    const tileId = wcfData[row + 1][col].selectedTile;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId].up));
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
