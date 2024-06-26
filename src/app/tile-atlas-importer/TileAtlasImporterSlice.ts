import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit"; // Define a type for the slice state

export interface TileAtlasDimensionSettings {
  tileSize: number;
  offset: number;
  separation: number;
  limitNumTiles: boolean;
  numTilesLimit: number;
}
export interface TileAtlasImporterState {
  settingsX: TileAtlasDimensionSettings;
  settingsY: TileAtlasDimensionSettings;
  deleteTilesWithMissingNeighbour: boolean;
}

const initialState: TileAtlasImporterState = {
  settingsX: {
    tileSize: 16,
    offset: 8,
    separation: 0,
    limitNumTiles: false,
    numTilesLimit: 32,
  },
  settingsY: {
    tileSize: 16,
    offset: 9,
    separation: 0,
    limitNumTiles: false,
    numTilesLimit: 32,
  },
  deleteTilesWithMissingNeighbour: false,
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
    setDeleteTilesWithMissingNeighbour: (
      state,
      action: PayloadAction<{ value: boolean }>,
    ) => {
      state.deleteTilesWithMissingNeighbour = action.payload.value;
    },
  },
});
