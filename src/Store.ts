import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { tileAtlasSlice } from "./app/tile-atlas/TileAtlasSlice.ts";
import { tileAtlasImporterSlice } from "./app/tile-atlas-importer/TileAtlasImporterSlice.ts";
import { wcfSlice } from "./app/wcf-ruleset/WcfSlice.ts";

export const store = configureStore({
  reducer: {
    tileAtlas: tileAtlasSlice.reducer,
    tileAtlasImporter: tileAtlasImporterSlice.reducer,
    wcf: wcfSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
