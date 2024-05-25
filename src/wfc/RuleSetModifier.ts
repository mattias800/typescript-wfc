import { AllowedNeighbours, RuleSet, TileId } from "./CommonTypes.ts";
import { validateRuleSet } from "./RuleSetValidator.ts";

export const deleteTileFromRuleSet = (ruleSet: RuleSet, tileId: TileId) => {
  delete ruleSet[tileId];

  const tileIds = Object.keys(ruleSet) as Array<TileId>;

  for (const neighbourId of tileIds) {
    const n = ruleSet[neighbourId];
    if (n == null) {
      console.log("Could not find tile while removing a tile from rule set.");
      continue;
    }
    n.up = n.up.filter((m) => m !== tileId);
    n.down = n.down.filter((m) => m !== tileId);
    n.left = n.left.filter((m) => m !== tileId);
    n.right = n.right.filter((m) => m !== tileId);
  }
};

export const replaceTileInRuleSet = (
  ruleSet: RuleSet,
  tileIdToDelete: TileId,
  tileIdToReplaceIt: TileId,
) => {
  delete ruleSet[tileIdToDelete];

  const tileIds = Object.keys(ruleSet) as Array<TileId>;

  for (const neighbourId of tileIds) {
    const n = ruleSet[neighbourId];
    if (n == null) {
      console.log("Could not find tile while removing a tile from rule set.");
      continue;
    }
    n.up = n.up.map((m) => (m !== tileIdToDelete ? m : tileIdToReplaceIt));
    n.down = n.down.map((m) => (m !== tileIdToDelete ? m : tileIdToReplaceIt));
    n.left = n.left.map((m) => (m !== tileIdToDelete ? m : tileIdToReplaceIt));
    n.right = n.right.map((m) =>
      m !== tileIdToDelete ? m : tileIdToReplaceIt,
    );
  }
};

export const deleteInvalidTiles = (ruleSet: RuleSet): RuleSet => {
  const errors = validateRuleSet(ruleSet);
  const r = {
    ...ruleSet,
  };

  errors.forEach((error) => {
    deleteTileFromRuleSet(r, error.tileId);
  });

  if (errors.length) {
    return deleteInvalidTiles(r);
  } else {
    return r;
  }
};

export const addAllowedNeighbour = (
  ruleSet: RuleSet,
  tileId: TileId,
  neighbourId: TileId,
  direction: keyof AllowedNeighbours,
) => {
  ruleSet[tileId] = ruleSet[tileId] ?? {
    up: [],
    right: [],
    left: [],
    down: [],
  };

  ruleSet[neighbourId] = ruleSet[neighbourId] ?? {
    up: [],
    right: [],
    left: [],
    down: [],
  };

  const dir = ruleSet[tileId][direction];
  if (!dir.includes(neighbourId)) {
    dir.push(neighbourId);
  }

  const otherDir = ruleSet[neighbourId][getInverseDirection(direction)];
  if (!otherDir.includes(tileId)) {
    otherDir.push(tileId);
  }
};

export const removeAllowedNeighbour = (
  ruleSet: RuleSet,
  tileId: TileId,
  neighbourId: TileId,
  direction: keyof AllowedNeighbours,
) => {
  const oppositeDirection = getInverseDirection(direction);

  const dir = ruleSet[tileId]?.[direction];
  if (dir?.includes(neighbourId)) {
    ruleSet[tileId][direction] = dir.filter((f) => f !== neighbourId);
  }

  const otherDir = ruleSet[neighbourId]?.[oppositeDirection];
  if (otherDir?.includes(tileId)) {
    ruleSet[neighbourId][oppositeDirection] = otherDir.filter(
      (f) => f !== tileId,
    );
  }
};

export const getInverseDirection = (
  direction: keyof AllowedNeighbours,
): keyof AllowedNeighbours => {
  switch (direction) {
    case "down":
      return "up";
    case "up":
      return "down";
    case "left":
      return "right";
    case "right":
      return "left";
  }
};
