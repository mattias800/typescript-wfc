import { extractRuleSet } from "../RuleExtractor.ts";
import { initWfcData } from "../WfcTileFactory.ts";
import { calculateAllowedTiles } from "../WfcTilePlacer.ts";

describe("WfcTilePlacer", () => {
  describe("calculateAllowedTiles", () => {
    describe("with small ruleset", () => {
      const ruleSet = extractRuleSet({
        rows: 4,
        cols: 4,
        tiles: [
          "4",
          "1",
          "1",
          "1",
          "1",
          "2",
          "2",
          "3",
          "1",
          "2",
          "3",
          "3",
          "1",
          "3",
          "3",
          "3",
        ],
      });

      describe("placing a 4", () => {
        it("updates neighbouring tiles", () => {
          const d = initWfcData(4, 4, ruleSet);
          d.tiles[0].collapsed = "4";

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
