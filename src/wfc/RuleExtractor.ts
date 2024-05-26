import { RuleSet, TileMap } from "./CommonTypes.ts";
import { getTile } from "./WfcTileFactory.ts";

export const extractRuleSet = (source: TileMap): RuleSet => {
  const ruleSet: RuleSet = {};

  for (let row = 0; row < source.rows; row++) {
    for (let col = 0; col < source.cols; col++) {
      const tile = getTile(source.tiles, row, col, source.cols);

      ruleSet[tile] = ruleSet[tile] ?? {
        left: [],
        down: [],
        right: [],
        up: [],
      };

      if (col > 0) {
        const t = getTile(source.tiles, row, col - 1, source.cols);
        if (!ruleSet[tile].left.includes(t)) {
          ruleSet[tile].left.push(t);
          ruleSet[tile].left.sort();
        }
      }
      if (col < source.cols - 1) {
        const t = getTile(source.tiles, row, col + 1, source.cols);
        if (!ruleSet[tile].right.includes(t)) {
          ruleSet[tile].right.push(t);
          ruleSet[tile].right.sort();
        }
      }
      if (row > 0) {
        const t = getTile(source.tiles, row - 1, col, source.cols);
        if (!ruleSet[tile].up.includes(t)) {
          ruleSet[tile].up.push(t);
          ruleSet[tile].up.sort();
        }
      }
      if (row < source.rows - 1) {
        const t = getTile(source.tiles, row + 1, col, source.cols);
        if (!ruleSet[tile].down.includes(t)) {
          ruleSet[tile].down.push(t);
          ruleSet[tile].down.sort();
        }
      }
    }
  }

  return ruleSet;
};
