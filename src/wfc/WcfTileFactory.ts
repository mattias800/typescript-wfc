import { RuleSet } from "./RuleExtractor.ts";

type WcfTile = string;
type WcfAllowedTileList = Array<WcfTile>;

type WcfData = Array<Array<WcfAllowedTileList>>;

export const initWcfData = (
  cols: number,
  rows: number,
  ruleSet: RuleSet,
): WcfData => {
  const all = Object.keys(ruleSet);
  const l: WcfData = [];
  for (let row = 0; row < rows; row++) {
    const rowData: Array<WcfAllowedTileList> = [];
    for (let col = 0; col < cols; col++) {
      rowData.push(all);
    }
    l.push(rowData);
  }
  return l;
};
