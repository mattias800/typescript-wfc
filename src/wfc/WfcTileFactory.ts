import { RuleSet, WfcData, WfcTile } from "./CommonTypes.ts";

export const initWfcData = (
  cols: number,
  rows: number,
  ruleSet: RuleSet,
): WfcData => {
  const all = Object.keys(ruleSet);
  const l: WfcData = [];
  for (let row = 0; row < rows; row++) {
    const rowData: Array<WfcTile> = [];
    for (let col = 0; col < cols; col++) {
      rowData.push({
        selectedTile: undefined,
        allowedTiles: all,
      });
    }
    l.push(rowData);
  }
  return l;
};
