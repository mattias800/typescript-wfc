import { extractRuleSet } from "../RuleExtractor.ts";
import { initWcfData } from "../WcfTileFactory.ts";
import { calculateAllowedTiles } from "../WcfTilePlacer.ts";

describe("WcfTilePlacer", () => {
  describe("calculateAllowedTiles", () => {
    describe("with small ruleset", () => {
      const ruleSet = extractRuleSet([
        ["4", "1", "1", "1"],
        ["1", "2", "2", "3"],
        ["1", "2", "3", "3"],
        ["1", "3", "3", "3"],
      ]);

      describe("placing a 4", () => {
        it("updates neighbouring tiles", () => {
          const d = initWcfData(4, 4, ruleSet);
          d[0][0].selectedTile = "4";

          expect(calculateAllowedTiles(1, 0, d, ruleSet)).toEqual(["1"]);
          expect(calculateAllowedTiles(0, 1, d, ruleSet)).toEqual(["1"]);
          expect(calculateAllowedTiles(1, 1, d, ruleSet)).toEqual([
            "1",
            "2",
            "3",
            "4",
          ]);
        });
      });
    });
  });
});
