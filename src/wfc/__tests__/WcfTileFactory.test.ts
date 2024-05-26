import { extractRuleSet } from "../RuleExtractor.ts";
import { initWfcData } from "../WfcTileFactory.ts";

describe("WfcTileFactory", () => {
  describe("initWfcData", () => {
    describe("with simple result set", () => {
      const r = extractRuleSet({
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
          "3",
          "1",
          "3",
          "3",
          "3",
        ],
      });

      const t = initWfcData(2, 3, r);

      it("is correct size", () => {
        expect(t.tiles.length).toBe(6);
      });

      it("includes all possibilities", () => {
        expect(t.tiles[0].options).toEqual(["1", "2", "3", "4"]);
        expect(t.tiles[1].options).toEqual(["1", "2", "3", "4"]);
        expect(t.tiles[2].options).toEqual(["1", "2", "3", "4"]);
        expect(t.tiles[3].options).toEqual(["1", "2", "3", "4"]);
        expect(t.tiles[4].options).toEqual(["1", "2", "3", "4"]);
        expect(t.tiles[5].options).toEqual(["1", "2", "3", "4"]);
      });
    });
  });
});
