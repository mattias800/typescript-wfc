import { SourceMap, WcfData } from "./CommonTypes.ts";

export const mapNumberMapToSourceMap = (
  intMap: Array<Array<number>>,
): SourceMap => intMap.map((p) => p.map((o) => String(o)));

export const mapWcfDataToSourceMap = (wcfData: WcfData): SourceMap =>
  wcfData.map((p) => p.map((o) => o.selectedTile ?? ""));
