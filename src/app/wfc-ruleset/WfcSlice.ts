import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RuleSet, TileId, WfcData } from "../../wfc/CommonTypes.ts";
import {
  deleteTileFromRuleSet,
  replaceTileInRuleSet,
} from "../../wfc/RuleSetModifier.ts";
import { initWfcData } from "../../wfc/WfcTileFactory.ts"; // Define a type for the slice state

interface WfcState {
  ruleSet: RuleSet | undefined;
  wfcData: WfcData | undefined;
  cols: number;
  rows: number;
}

const initialState: WfcState = {
  ruleSet: undefined,
  wfcData: undefined,
  cols: 80,
  rows: 45,
};

export const wfcSlice = createSlice({
  name: "wfc",
  initialState,
  reducers: {
    reset: (state) => {
      state.ruleSet = undefined;
    },
    resetWfcData: (state) => {
      if (state.ruleSet == null) {
        return;
      }
      state.wfcData = initWfcData(state.cols, state.rows, state.ruleSet);
    },
    setWfcData: (state, action: PayloadAction<{ wfcData: WfcData }>) => {
      state.wfcData = action.payload.wfcData;
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
