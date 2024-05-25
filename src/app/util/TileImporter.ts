import { TileAtlasDimensionSettings } from "../tile-atlas-importer/TileAtlasImporterSlice.ts";
import {
  createSubImageData,
  imageDataEquals,
  imageDataToBase64,
} from "./ImageDataUtil.ts";
import { TileId } from "../../wfc/CommonTypes.ts";

export interface ExtractTilesResult {
  tiles: Array<ImageData>;
  tilesRecord: Record<TileId, string>;
  tileMap: Array<Array<number>>;
}

export const extractUniqueTiles = (
  settingsX: TileAtlasDimensionSettings,
  settingsY: TileAtlasDimensionSettings,
  imageData: ImageData,
): ExtractTilesResult => {
  const tiles: Array<ImageData> = [];
  const tileMap: Array<Array<number>> = [];
  const tilesRecord: Record<TileId, string> = {};
  let numRedundantTiles = 0;

  const maxY = settingsY.limitNumTiles
    ? settingsY.numTilesLimit
    : imageData.height / settingsY.tileSize;

  const maxX = settingsX.limitNumTiles
    ? settingsX.numTilesLimit
    : imageData.width / settingsX.tileSize;

  for (let y = 0; y < maxY; y++) {
    tileMap.push([]);
    for (let x = 0; x < maxX; x++) {
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
        tileMap[tileMap.length - 1].push(tiles.length - 1);
        tilesRecord[String(tiles.length - 1)] = imageDataToBase64(chunk);
      } else {
        tileMap[tileMap.length - 1].push(i);
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
  };
};
