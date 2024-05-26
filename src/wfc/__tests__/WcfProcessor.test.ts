import { extractRuleSet } from "../RuleExtractor.ts";
import { initWfcData } from "../WfcTileFactory.ts";
import { findTilesWithLowestEntropy, process } from "../WfcProcessor.ts";
import { describe, it, expect } from "vitest";
import { WfcData } from "../CommonTypes.ts";

describe("WfcProcessor", () => {
  describe("findTilesWithLowestEntropy", () => {
    describe("with some test data", () => {
      const wfcData: WfcData = {
        rows: 2,
        cols: 2,
        tiles: [
          { collapsed: "1", options: ["1"] },
          { collapsed: "2", options: ["2"] },
          {
            collapsed: undefined,
            options: ["0", "1", "2", "3"],
          },
          {
            collapsed: undefined,
            options: ["0", "1", "2", "3"],
          },
        ],
      };

      it("works", () => {
        const r = findTilesWithLowestEntropy(wfcData);
        expect(r.coordinates.length).toBe(2);
        expect(r.entropy).toBe(4);
      });
    });
  });
  describe("replaceSingleAllowedWithSelected", () => {
    describe("with small ruleset", () => {
      const ruleSet = extractRuleSet({
        cols: 4,
        rows: 4,
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
          "4",
          "1",
          "3",
          "3",
          "2",
        ],
      });

      describe("placing a 4", () => {
        it("sets tile in all places where only single tile is allowed", () => {
          const d = initWfcData(4, 4, ruleSet);
          process(d, ruleSet);
        });
      });
    });
  });
});
