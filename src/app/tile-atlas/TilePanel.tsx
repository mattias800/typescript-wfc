import * as React from "react";
import { Column, Text } from "@stenajs-webui/core";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";

export interface TilePanelProps {
  tileId: string;
}

export const TilePanel: React.FC<TilePanelProps> = ({ tileId }) => {
  return (
    <Column width={"45px"}>
      <Text>ID: {tileId}</Text>
      <TileAtlasImage tileId={tileId} />
    </Column>
  );
};
