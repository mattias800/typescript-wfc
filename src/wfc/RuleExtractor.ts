import { RuleSet, SourceMap } from "./CommonTypes.ts";

export const extractRuleSet = (source: SourceMap): RuleSet => {
  const rows = source.length;
  const cols = source[0].length;

  const ruleSet: RuleSet = {};

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = source[row][col];

      ruleSet[tile] = ruleSet[tile] ?? {
        left: [],
        down: [],
        right: [],
        up: [],
      };

      if (col > 0) {
        const t = source[row][col - 1];
        if (!ruleSet[tile].left.includes(t)) {
          ruleSet[tile].left.push(t);
          ruleSet[tile].left.sort();
        }
      }
      if (col < cols - 1) {
        const t = source[row][col + 1];
        if (!ruleSet[tile].right.includes(t)) {
          ruleSet[tile].right.push(t);
          ruleSet[tile].right.sort();
        }
      }
      if (row > 0) {
        const t = source[row - 1][col];
        if (!ruleSet[tile].up.includes(t)) {
          ruleSet[tile].up.push(t);
          ruleSet[tile].up.sort();
        }
      }
      if (row < rows - 1) {
        const t = source[row + 1][col];
        if (!ruleSet[tile].down.includes(t)) {
          ruleSet[tile].down.push(t);
          ruleSet[tile].down.sort();
        }
      }
    }
  }

  return ruleSet;
};
