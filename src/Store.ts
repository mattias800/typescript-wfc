import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { tileAtlasSlice } from "./app/tile-atlas/TileAtlasSlice.ts";
import { tileAtlasImporterSlice } from "./app/tile-atlas-importer/TileAtlasImporterSlice.ts";
import { wfcSlice } from "./app/wfc-ruleset/WfcSlice.ts";
import { rememberReducer, rememberEnhancer } from "redux-remember";

export const store = configureStore({
  reducer: rememberReducer({
    tileAtlas: tileAtlasSlice.reducer,
    tileAtlasImporter: tileAtlasImporterSlice.reducer,
    wfc: wfcSlice.reducer,
  }),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(
      rememberEnhancer(
        window.localStorage, // or window.sessionStorage, or your own custom storage driver
        ["tileAtlas", "tileAtlasImporter", "wfc"],
      ),
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
