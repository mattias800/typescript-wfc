import { extractRuleSet } from "../RuleExtractor.ts";
import { initWcfData } from "../WcfTileFactory.ts";

describe("WcfTileFactory", () => {
  describe("initWcfData", () => {
    describe("with simple result set", () => {
      const r = extractRuleSet([
        ["4", "1", "1", "1"],
        ["1", "2", "2", "3"],
        ["1", "2", "3", "3"],
        ["1", "3", "3", "3"],
      ]);

      const t = initWcfData(2, 3, r);

      it("is correct size", () => {
        expect(t.length).toBe(3);
        expect(t[0].length).toBe(2);
      });

      it("includes all possibilities", () => {
        expect(t[0][0].allowedTiles).toEqual(["1", "2", "3", "4"]);
        expect(t[0][1].allowedTiles).toEqual(["1", "2", "3", "4"]);
        expect(t[1][0].allowedTiles).toEqual(["1", "2", "3", "4"]);
        expect(t[1][1].allowedTiles).toEqual(["1", "2", "3", "4"]);
        expect(t[2][0].allowedTiles).toEqual(["1", "2", "3", "4"]);
        expect(t[2][1].allowedTiles).toEqual(["1", "2", "3", "4"]);
      });
    });
  });
});
