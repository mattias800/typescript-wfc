import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RuleSet, TileId } from "../../wfc/CommonTypes.ts"; // Define a type for the slice state

interface WcfState {
  ruleSet: RuleSet | undefined;
}

const initialState: WcfState = {
  ruleSet: undefined,
};

export const wcfSlice = createSlice({
  name: "wcf",
  initialState,
  reducers: {
    reset: (state) => {
      state.ruleSet = undefined;
    },
    setRuleSet: (state, action: PayloadAction<{ ruleSet: RuleSet }>) => {
      state.ruleSet = action.payload.ruleSet;
    },
    deleteTileFromRules: (
      state,
      { payload: { tileId } }: PayloadAction<{ tileId: TileId }>,
    ) => {
      if (state.ruleSet == null) {
        return state;
      }

      delete state.ruleSet[tileId];

      const tileIds = Object.keys(state.ruleSet) as Array<TileId>;

      for (const neighbourId of tileIds) {
        let n = state.ruleSet[neighbourId];
        if (n == null) {
          console.log(
            "Could not find tile while removing a tile from rule set.",
          );
          continue;
        }
        n.up = n.up.filter((m) => m !== tileId);
        n.down = n.down.filter((m) => m !== tileId);
        n.left = n.left.filter((m) => m !== tileId);
        n.right = n.right.filter((m) => m !== tileId);
      }
    },
    replaceTileWithOtherTile: (
      state,
      {
        payload: { tileIdToDelete, tileIdToReplaceIt },
      }: PayloadAction<{ tileIdToDelete: TileId; tileIdToReplaceIt: TileId }>,
    ) => {
      if (state.ruleSet == null) {
        return state;
      }

      delete state.ruleSet[tileIdToDelete];

      const tileIds = Object.keys(state.ruleSet) as Array<TileId>;

      for (const neighbourId of tileIds) {
        let n = state.ruleSet[neighbourId];
        if (n == null) {
          console.log(
            "Could not find tile while replacing a tile from rule set.",
          );
          continue;
        }
        n.up = n.up.map((m) => (m !== tileIdToDelete ? m : tileIdToReplaceIt));
        n.down = n.down.map((m) =>
          m !== tileIdToDelete ? m : tileIdToReplaceIt,
        );
        n.left = n.left.map((m) =>
          m !== tileIdToDelete ? m : tileIdToReplaceIt,
        );
        n.right = n.right.map((m) =>
          m !== tileIdToDelete ? m : tileIdToReplaceIt,
        );
      }
    },
  },
});
