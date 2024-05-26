import { RuleSet, TileId, WfcData } from "./CommonTypes.ts";
import { getWfcTile } from "./WfcTileFactory.ts";

export const collapseTile = (
  col: number,
  row: number,
  tile: TileId,
  wfcData: WfcData,
  ruleSet: RuleSet,
) => {
  getWfcTile(wfcData, row, col).collapsed = tile;
  updateNeighboursAllowedTiles(col, row, wfcData, ruleSet);
};

export const updateNeighboursAllowedTiles = (
  col: number,
  row: number,
  wfcData: WfcData,
  ruleSet: RuleSet,
): void => {
  if (row > 0) {
    updateAllowedTiles(col, row - 1, wfcData, ruleSet);
  }
  if (row < wfcData.rows - 1) {
    updateAllowedTiles(col, row + 1, wfcData, ruleSet);
  }
  if (col > 0) {
    updateAllowedTiles(col - 1, row, wfcData, ruleSet);
  }
  if (col < wfcData.cols - 1) {
    updateAllowedTiles(col + 1, row, wfcData, ruleSet);
  }
};

export const updateAllowedTiles = (
  col: number,
  row: number,
  wfcData: WfcData,
  ruleSet: RuleSet,
): boolean => {
  if (getWfcTile(wfcData, row, col).collapsed) {
    return false;
  }
  const prevAllowedTiles = getWfcTile(wfcData, row, col).options;
  const nextAllowedTiles = calculateAllowedTiles(col, row, wfcData, ruleSet);
  getWfcTile(wfcData, row, col).options = nextAllowedTiles;
  return prevAllowedTiles.length !== nextAllowedTiles.length;
};

export const calculateAllowedTiles = (
  col: number,
  row: number,
  wfcData: WfcData,
  ruleSet: RuleSet,
): Array<TileId> => {
  const rows = wfcData.rows;
  const cols = wfcData.cols;

  const allTiles: Array<TileId> = Object.keys(ruleSet);

  const notAllowed: Array<TileId> = [];

  if (col > 0) {
    const tileId = getWfcTile(wfcData, row, col - 1).collapsed;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.right));
    }
  }
  if (col < cols - 1) {
    const tileId = getWfcTile(wfcData, row, col + 1).collapsed;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.left));
    }
  }
  if (row > 0) {
    const tileId = getWfcTile(wfcData, row - 1, col).collapsed;
    if (tileId) {
      concatUnique(notAllowed, getNotAllowed(allTiles, ruleSet[tileId]?.down));
    }
  }
  if (row < rows - 1) {
    const tileId = getWfcTile(wfcData, row + 1, col).collapsed;
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
  const rows = wfcData.rows;
  const cols = wfcData.cols;

  if (row > 0) {
    if (getWfcTile(wfcData, row, col - 1).options.length === 0) {
      return true;
    }
  }
  if (row < rows - 1) {
    if (getWfcTile(wfcData, row, col + 1).options.length === 0) {
      return true;
    }
  }
  if (col > 0) {
    if (getWfcTile(wfcData, row - 1, col).options.length === 0) {
      return true;
    }
  }
  if (col < cols - 1) {
    if (getWfcTile(wfcData, row + 1, col).options.length === 0) {
      return true;
    }
  }
  return false;
};

export const hasAnyTileZeroEntropy = (wfcData: WfcData): boolean => {
  for (let row = 0; row < wfcData.rows; row++) {
    for (let col = 0; col < wfcData.cols; col++) {
      if (getWfcTile(wfcData, row, col).options.length === 0) {
        return true;
      }
    }
  }
  return false;
};
