import { SourceMap, WfcData } from "./CommonTypes.ts";

export const mapNumberMapToSourceMap = (
  intMap: Array<Array<number>>,
): SourceMap => intMap.map((p) => p.map((o) => String(o)));

export const mapWfcDataToSourceMap = (wfcData: WfcData): SourceMap =>
  wfcData.map((p) => p.map((o) => o.selectedTile ?? ""));
