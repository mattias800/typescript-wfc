import * as React from "react";
import { useAppSelector } from "../../Store.ts";
import { Column, Text } from "@stenajs-webui/core";

export interface TilePanelProps {
  tileId: string;
}

export const TilePanel: React.FC<TilePanelProps> = ({ tileId }) => {
  const tiles = useAppSelector((state) => state.tileAtlas.tiles);

  return (
    <Column width={"45px"}>
      <Text>ID: {tileId}</Text>
      <img
        src={tiles[tileId]}
        alt={"Tile with id " + tileId}
        style={{
          width: "32px",
          height: "32px",
        }}
      ></img>
    </Column>
  );
};
