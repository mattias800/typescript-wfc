import { TileAtlasDimensionSettings } from "../tile-atlas-importer/TileAtlasImporterSlice.ts";
import {
  createSubImageData,
  imageDataEquals,
  imageDataToBase64,
} from "./ImageDataUtil.ts";
import { TileId, TileMap } from "../../wfc/CommonTypes.ts";

export interface ExtractTilesResult {
  tiles: Array<ImageData>;
  tilesRecord: Record<TileId, string>;
  tileMap: TileMap;
  cols: number;
  rows: number;
}

export const extractUniqueTiles = (
  settingsX: TileAtlasDimensionSettings,
  settingsY: TileAtlasDimensionSettings,
  imageData: ImageData,
): ExtractTilesResult => {
  const tiles: Array<ImageData> = [];
  const tilesRecord: Record<TileId, string> = {};
  let numRedundantTiles = 0;

  const rows = settingsY.limitNumTiles
    ? settingsY.numTilesLimit
    : imageData.height / settingsY.tileSize;

  const cols = settingsX.limitNumTiles
    ? settingsX.numTilesLimit
    : imageData.width / settingsX.tileSize;

  const tileMap: TileMap = {
    cols,
    rows,
    tiles: [],
  };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const chunk = createSubImageData(
        imageData,
        settingsX.offset + x * settingsX.tileSize + x * settingsX.separation,
        settingsY.offset + y * settingsY.tileSize + y * settingsY.separation,
        settingsX.tileSize,
        settingsY.tileSize,
      );
      const i = tiles.findIndex((t) => imageDataEquals(t, chunk));
      if (i < 0) {
        tiles.push(chunk);
        tileMap.tiles.push(String(tiles.length - 1));
        tilesRecord[String(tiles.length - 1)] = imageDataToBase64(chunk);
      } else {
        tileMap.tiles.push(String(i));
        numRedundantTiles++;
      }
    }
  }
  console.log("Found " + tiles.length + " unique tiles.");
  console.log("Skipped " + numRedundantTiles + " redundant tiles.");

  return {
    tiles,
    tileMap,
    tilesRecord,
    rows,
    cols,
  };
};
