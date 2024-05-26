import { RuleSet, WfcData, WfcTile } from "./CommonTypes.ts";

export const initWfcData = (
  cols: number,
  rows: number,
  ruleSet: RuleSet,
): WfcData => ({
  rows,
  cols,
  tiles: Array.from({ length: rows * cols }, () => ({
    collapsed: undefined,
    options: Object.keys(ruleSet),
  })),
});

export const cloneWfcData = (wfcData: WfcData): WfcData => ({
  cols: wfcData.cols,
  rows: wfcData.rows,
  tiles: wfcData.tiles.map((t) => ({
    collapsed: t.collapsed,
    options: [...t.options],
  })),
});

export const logObj = (obj: unknown): void => {
  console.log(JSON.parse(JSON.stringify(obj)));
};

export const getWfcTile = (
  wfcData: WfcData,
  row: number,
  col: number,
): WfcTile => {
  if (col >= wfcData.cols || row >= wfcData.rows) {
    throw new Error("getWfcTile out of bounds");
  }
  return wfcData.tiles[row * wfcData.cols + col];
};

export const getTile = <T>(
  list: Array<T>,
  row: number,
  col: number,
  cols: number,
): T => {
  if (col >= cols) {
    throw new Error("getTile out of bounds");
  }
  return list[row * cols + col];
};
