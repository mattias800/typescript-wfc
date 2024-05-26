import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  AllowedNeighbours,
  RuleSet,
  TileId,
  WfcData,
} from "../../wfc/CommonTypes.ts";
import {
  addAllowedNeighbour,
  deleteTileFromRuleSet,
  removeAllowedNeighbour,
  replaceTileInRuleSet,
} from "../../wfc/RuleSetModifier.ts";
import { initWfcData } from "../../wfc/WfcTileFactory.ts";
import { collapseTile, uncollapseTile } from "../../wfc/WfcTilePlacer.ts"; // Define a type for the slice state

interface WfcState {
  ruleSet: RuleSet | undefined;
  wfcData: WfcData | undefined;
  cols: number;
  rows: number;
}

const initialState: WfcState = {
  ruleSet: undefined,
  wfcData: undefined,
  cols: 20,
  rows: 20,
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
    setNumRows: (state, action: PayloadAction<{ rows: number }>) => {
      state.rows = action.payload.rows;
      if (state.ruleSet) {
        state.wfcData = initWfcData(state.cols, state.rows, state.ruleSet);
      }
    },
    setWfcTile: (
      state,
      {
        payload: { tileId, row, col },
      }: PayloadAction<{ row: number; col: number; tileId: string }>,
    ) => {
      if (!state.wfcData || !state.ruleSet) {
        return;
      }
      collapseTile(col, row, tileId, state.wfcData, state.ruleSet);
    },
    clearWfcTile: (
      state,
      { payload: { row, col } }: PayloadAction<{ row: number; col: number }>,
    ) => {
      if (!state.wfcData || !state.ruleSet) {
        return;
      }
      uncollapseTile(col, row, state.wfcData, state.ruleSet);
    },
    setNumColumns: (state, action: PayloadAction<{ cols: number }>) => {
      state.cols = action.payload.cols;
      if (state.ruleSet) {
        state.wfcData = initWfcData(state.cols, state.rows, state.ruleSet);
      }
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
    addAllowedNeighbour: (
      state,
      {
        payload: { tileId, neighbourId, direction },
      }: PayloadAction<{
        tileId: TileId;
        neighbourId: TileId;
        direction: keyof AllowedNeighbours;
      }>,
    ) => {
      if (state.ruleSet == null) {
        return state;
      }

      addAllowedNeighbour(state.ruleSet, tileId, neighbourId, direction);
    },
    removeAllowedNeighbour: (
      state,
      {
        payload: { tileId, neighbourId, direction },
      }: PayloadAction<{
        tileId: TileId;
        neighbourId: TileId;
        direction: keyof AllowedNeighbours;
      }>,
    ) => {
      if (state.ruleSet == null) {
        return state;
      }

      removeAllowedNeighbour(state.ruleSet, tileId, neighbourId, direction);
    },
  },
});
