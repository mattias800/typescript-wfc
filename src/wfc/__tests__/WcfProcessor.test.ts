import { extractRuleSet } from "../RuleExtractor.ts";
import { initWcfData } from "../WcfTileFactory.ts";
import { setTile } from "../WcfTilePlacer.ts";
import {
  findRandomTileWithAllowed,
  getRandomAllowedTile,
  process,
  replaceSingleAllowedWithSelected,
} from "../WcfProcessor.ts";

describe("WcfProcessor", () => {
  describe("replaceSingleAllowedWithSelected", () => {
    describe("with small ruleset", () => {
      const ruleSet = extractRuleSet([
        ["4", "1", "1", "1"],
        ["1", "2", "2", "3"],
        ["1", "2", "3", "3"],
        ["1", "3", "3", "3"],
      ]);

      describe("placing a 4", () => {
        it("sets tile in all places where only single tile is allowed", () => {
          const d = initWcfData(4, 4, ruleSet);
          process(d, ruleSet);
        });
      });
    });
  });
});
