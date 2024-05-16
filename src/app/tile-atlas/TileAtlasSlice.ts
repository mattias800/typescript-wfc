import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { TileId } from "../../wfc/CommonTypes.ts";

// Define a type for the slice state
interface TileAtlasState {
  tileWidth: number;
  tileHeight: number;
  tiles: Record<TileId, string>;
}

// Define the initial state using that type
const initialState: TileAtlasState = {
  tileWidth: 8,
  tileHeight: 8,
  tiles: {},
};

export const tileAtlasSlice = createSlice({
  name: "tileAtlas",
  initialState,
  reducers: {
    reset: (state) => {
      state.tileWidth = initialState.tileWidth;
      state.tileHeight = initialState.tileHeight;
      state.tiles = {};
    },
    setTileSize: (
      state,
      action: PayloadAction<{ tileWidth: number; tileHeight: number }>,
    ) => {
      state.tileWidth = action.payload.tileWidth;
      state.tileHeight = action.payload.tileHeight;
    },
    addTile: (
      state,
      action: PayloadAction<{ tileId: TileId; base64data: string }>,
    ) => {
      state.tiles[action.payload.tileId] = action.payload.base64data;
    },
  },
});
