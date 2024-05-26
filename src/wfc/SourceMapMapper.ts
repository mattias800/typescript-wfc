import { TileMap, WfcData } from "./CommonTypes.ts";

export const mapWfcDataToSourceMap = (wfcData: WfcData): TileMap => ({
  cols: wfcData.cols,
  rows: wfcData.rows,
  tiles: wfcData.tiles.map((o) => o.collapsed ?? ""),
});
