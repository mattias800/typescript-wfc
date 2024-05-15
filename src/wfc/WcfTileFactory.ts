import { RuleSet, WcfData, WcfTile } from "./CommonTypes.ts";

export const initWcfData = (
  cols: number,
  rows: number,
  ruleSet: RuleSet,
): WcfData => {
  const all = Object.keys(ruleSet);
  const l: WcfData = [];
  for (let row = 0; row < rows; row++) {
    const rowData: Array<WcfTile> = [];
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
