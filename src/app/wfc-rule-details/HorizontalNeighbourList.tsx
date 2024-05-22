import * as React from "react";
import { Column, Row } from "@stenajs-webui/core";
import { AllowedNeighbours } from "../../wfc/CommonTypes.ts";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { Label } from "@stenajs-webui/elements";

export interface HorizontalNeighbourListProps {
  tileId: string;
  allowedNeighbours: AllowedNeighbours;
}

export const HorizontalNeighbourList: React.FC<
  HorizontalNeighbourListProps
> = ({ tileId, allowedNeighbours: { left, right } }) => {
  return (
    <Row gap={2}>
      <Label text={"Left"}>
        <Column gap={1}>
          {left.map((neighbourId) => (
            <Row key={neighbourId}>
              <TileAtlasImage tileId={neighbourId} />
              <TileAtlasImage tileId={tileId} />
            </Row>
          ))}
        </Column>
      </Label>
      <Label text={"Right"}>
        <Column gap={1}>
          {right.map((neighbourId) => (
            <Row key={neighbourId}>
              <TileAtlasImage tileId={tileId} />
              <TileAtlasImage tileId={neighbourId} />
            </Row>
          ))}
        </Column>
      </Label>
    </Row>
  );
};
