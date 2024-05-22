import * as React from "react";
import { useAppSelector } from "../../../Store.ts";

export interface TileAtlasImageProps {
  tileId: string;
}

export const TileAtlasImage: React.FC<TileAtlasImageProps> = ({ tileId }) => {
  const tiles = useAppSelector((state) => state.tileAtlas.tiles);
  return (
    <img
      src={tiles[tileId]}
      alt={"Tile with id " + tileId}
      style={{
        width: "32px",
        height: "32px",
      }}
    ></img>
  );
};
