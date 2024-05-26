import { extractRuleSet } from "../RuleExtractor.ts";

describe("Wfc", () => {
  describe("extractRuleSet", () => {
    describe("2x2 example", () => {
      const r = extractRuleSet({
        rows: 2,
        cols: 2,
        tiles: ["1", "1", "1", "2"],
      });

      it("extracts all tiles", () => {
        expect(Object.keys(r)).toEqual(["1", "2"]);
      });

      it("extracts left tiles", () => {
        expect(r["1"].left).toEqual(["1"]);
        expect(r["2"].left).toEqual(["1"]);
      });

      it("extracts right tiles", () => {
        expect(r["1"].right).toEqual(["1", "2"]);
        expect(r["2"].right).toEqual([]);
      });

      it("extracts up tiles", () => {
        expect(r["1"].up).toEqual(["1"]);
        expect(r["2"].up).toEqual(["1"]);
      });

      it("extracts down tiles", () => {
        expect(r["1"].down).toEqual(["1", "2"]);
        expect(r["2"].down).toEqual([]);
      });
    });

    describe("4x4 example", () => {
      const r = extractRuleSet({
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

      it("extracts all tiles", () => {
        expect(Object.keys(r)).toEqual(["1", "2", "3", "4"]);
      });

      it("extracts left tiles", () => {
        expect(r["1"].left).toEqual(["1", "4"]);
        expect(r["2"].left).toEqual(["1", "2"]);
        expect(r["3"].left).toEqual(["1", "2", "3"]);
        expect(r["4"].left).toEqual([]);
      });

      it("extracts right tiles", () => {
        expect(r["1"].right).toEqual(["1", "2", "3"]);
        expect(r["2"].right).toEqual(["2", "3"]);
        expect(r["3"].right).toEqual(["3"]);
        expect(r["4"].right).toEqual(["1"]);
      });

      it("extracts up tiles", () => {
        expect(r["1"].up).toEqual(["1", "4"]);
        expect(r["2"].up).toEqual(["1", "2"]);
        expect(r["3"].up).toEqual(["1", "2", "3"]);
        expect(r["4"].up).toEqual([]);
      });

      it("extracts down tiles", () => {
        expect(r["1"].down).toEqual(["1", "2", "3"]);
        expect(r["2"].down).toEqual(["2", "3"]);
        expect(r["3"].down).toEqual(["3"]);
        expect(r["4"].down).toEqual(["1"]);
      });
    });
  });
});
