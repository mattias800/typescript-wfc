import * as React from "react";
import { Text } from "@stenajs-webui/core";
import { Card, CardBody, CardHeader, Label } from "@stenajs-webui/elements";
import { useAppSelector } from "../../Store.ts";

export interface TileAtlasListProps {}

export const TileAtlasList: React.FC<TileAtlasListProps> = () => {
  const { tileHeight, tileWidth, tiles } = useAppSelector(
    (state) => state.tileAtlas,
  );
  return (
    <Card width={"350px"}>
      <CardHeader text={"Tile atlas"} />
      <CardBody gap={2}>
        <Label text={"Tile size"}>
          <Text>{tileWidth + "x" + tileHeight + "px"}</Text>
        </Label>
        <Label text={"Num tiles"}>
          <Text>{Object.keys(tiles).length}</Text>
        </Label>
      </CardBody>
    </Card>
  );
};
