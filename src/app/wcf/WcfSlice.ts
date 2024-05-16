import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RuleSet } from "../../wfc/CommonTypes.ts"; // Define a type for the slice state

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
  },
});
