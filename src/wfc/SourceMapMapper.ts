import { SourceMap } from "./CommonTypes.ts";

export const mapNumberMapToSourceMap = (
  intMap: Array<Array<number>>,
): SourceMap => intMap.map((p) => p.map((o) => String(o)));
