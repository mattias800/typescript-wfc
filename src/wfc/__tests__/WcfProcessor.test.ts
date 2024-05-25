import { extractRuleSet } from "../RuleExtractor.ts";
import { initWfcData } from "../WfcTileFactory.ts";
import { process } from "../WfcProcessor.ts";

describe("WfcProcessor", () => {
  describe("replaceSingleAllowedWithSelected", () => {
    describe("with small ruleset", () => {
      const ruleSet = extractRuleSet([
        ["4", "1", "1", "1"],
        ["1", "2", "2", "3"],
        ["1", "2", "3", "4"],
        ["1", "3", "3", "2"],
      ]);

      describe("placing a 4", () => {
        it("sets tile in all places where only single tile is allowed", () => {
          const d = initWfcData(4, 4, ruleSet);
          process(d, ruleSet);
          console.log(d);
        });
      });
    });
  });
});
