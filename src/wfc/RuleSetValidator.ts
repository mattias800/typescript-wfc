import { AllowedNeighbours, RuleSet, TileId } from "./CommonTypes.ts";

export interface RuleSetValidationError {
  tileId: string;
  message: string;
}

export const validateRuleSet = (
  ruleSet: RuleSet,
): Array<RuleSetValidationError> => {
  const tileIds = Object.keys(ruleSet) as Array<TileId>;
  const errors: Array<RuleSetValidationError> = [];

  for (const tileId of tileIds) {
    const r = validateNoMissingNeighbours(ruleSet[tileId]);
    if (!r) {
      errors.push({
        tileId,
        message: "Tile is missing neighbours in at least one direction.",
      });
    }
  }

  return errors;
};

export const validateNoMissingNeighbours = (a: AllowedNeighbours): boolean =>
  !(
    a.up.length === 0 ||
    a.down.length === 0 ||
    a.left.length === 0 ||
    a.right.length === 0
  );
