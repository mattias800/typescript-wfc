import * as React from "react";
import { Row, Text } from "@stenajs-webui/core";
import { Card, CardBody, CardHeader, Label } from "@stenajs-webui/elements";
import { useAppSelector } from "../../Store.ts";
import { TilePanel } from "./TilePanel.tsx";

export interface TileAtlasListProps {}

export const TileAtlasList: React.FC<TileAtlasListProps> = () => {
  const { tileHeight, tileWidth, tiles } = useAppSelector(
    (state) => state.tileAtlas,
  );
  const tileIds = Object.keys(tiles);

  return (
    <Card width={"350px"}>
      <CardHeader text={"Tile atlas"} />
      <CardBody gap={2}>
        <Label text={"Tile size"}>
          <Text>{tileWidth + "x" + tileHeight + "px"}</Text>
        </Label>
        <Label text={"Num tiles"}>
          <Text>{tileIds.length}</Text>
        </Label>

        <Row flexWrap={"wrap"} gap={2}>
          {tileIds.map((tileId) => (
            <TilePanel tileId={tileId} key={tileId} />
          ))}
        </Row>
      </CardBody>
    </Card>
  );
};
