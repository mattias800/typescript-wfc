import * as React from "react";
import { Column, Row } from "@stenajs-webui/core";
import { AllowedNeighbours } from "../../wfc/CommonTypes.ts";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { Label } from "@stenajs-webui/elements";
import { TileAtlasText } from "../common/components/TileAtlasText.tsx";

export interface VerticalNeighbourListProps {
  tileId: string;
  allowedNeighbours: AllowedNeighbours;
}

export const VerticalNeighbourList: React.FC<VerticalNeighbourListProps> = ({
  tileId,
  allowedNeighbours: { down, up },
}) => {
  return (
    <Column gap={2}>
      <Label text={"Above"}>
        <Row gap={1}>
          {up.map((neighbourId) => (
            <Column key={neighbourId}>
              <TileAtlasText text={neighbourId} />
              <TileAtlasImage tileId={neighbourId} />
              <TileAtlasImage tileId={tileId} />
            </Column>
          ))}
        </Row>
      </Label>
      <Label text={"Under"}>
        <Row gap={1}>
          {down.map((neighbourId) => (
            <Column key={neighbourId}>
              <TileAtlasImage tileId={tileId} />
              <TileAtlasImage tileId={neighbourId} />
              <TileAtlasText text={neighbourId} />
            </Column>
          ))}
        </Row>
      </Label>
    </Column>
  );
};
