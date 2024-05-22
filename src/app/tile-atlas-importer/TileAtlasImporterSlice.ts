import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit"; // Define a type for the slice state

export interface TileAtlasDimensionSettings {
  tileSize: number;
  offset: number;
  separation: number;
}
export interface TileAtlasImporterState {
  settingsX: TileAtlasDimensionSettings;
  settingsY: TileAtlasDimensionSettings;
}

const initialState: TileAtlasImporterState = {
  settingsX: {
    tileSize: 16,
    offset: 8,
    separation: 0,
  },
  settingsY: {
    tileSize: 16,
    offset: 9,
    separation: 0,
  },
};

export const tileAtlasImporterSlice = createSlice({
  name: "tileAtlasImporter",
  initialState,
  reducers: {
    setSettingsX: (
      state,
      action: PayloadAction<Partial<TileAtlasDimensionSettings>>,
    ) => {
      return {
        ...state,
        settingsX: {
          ...state.settingsX,
          ...action.payload,
        },
      };
    },
    setSettingsY: (
      state,
      action: PayloadAction<Partial<TileAtlasDimensionSettings>>,
    ) => {
      return {
        ...state,
        settingsY: {
          ...state.settingsY,
          ...action.payload,
        },
      };
    },
  },
});
