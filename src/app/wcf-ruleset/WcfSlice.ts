import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RuleSet, TileId, WcfData } from "../../wfc/CommonTypes.ts";
import {
  deleteTileFromRuleSet,
  replaceTileInRuleSet,
} from "../../wfc/RuleSetModifier.ts";
import { initWcfData } from "../../wfc/WcfTileFactory.ts"; // Define a type for the slice state

interface WcfState {
  ruleSet: RuleSet | undefined;
  wcfData: WcfData | undefined;
  cols: number;
  rows: number;
}

const initialState: WcfState = {
  ruleSet: undefined,
  wcfData: undefined,
  cols: 20,
  rows: 20,
};

export const wcfSlice = createSlice({
  name: "wcf",
  initialState,
  reducers: {
    reset: (state) => {
      state.ruleSet = undefined;
    },
    resetWcfData: (state) => {
      if (state.ruleSet == null) {
        return;
      }
      state.wcfData = initWcfData(state.cols, state.rows, state.ruleSet);
    },
    setWcfData: (state, action: PayloadAction<{ wcfData: WcfData }>) => {
      state.wcfData = action.payload.wcfData;
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

      deleteTileFromRuleSet(state.ruleSet, tileId);
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

      replaceTileInRuleSet(state.ruleSet, tileIdToDelete, tileIdToReplaceIt);
    },
  },
});
