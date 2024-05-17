import * as React from "react";
import { AllowedNeighbours } from "../../wfc/CommonTypes.ts";
import { Column, Row, Text } from "@stenajs-webui/core";
import { Label } from "@stenajs-webui/elements";

export interface AllowedNeighboursPanelProps {
  allowedNeighbours: AllowedNeighbours;
}

export const AllowedNeighboursPanel: React.FC<AllowedNeighboursPanelProps> = ({
  allowedNeighbours: { down, up, left, right },
}) => {
  return (
    <Row gap={2}>
      <Column gap={2}>
        <Label text={"Up"}>
          <Text>{up.length > 0 ? up.join(", ") : "-"}</Text>
        </Label>
        <Label text={"Down"}>
          <Text>{down.length > 0 ? down.join(", ") : "-"}</Text>
        </Label>
      </Column>
      <Column gap={2}>
        <Label text={"Left"}>
          <Text>{left.length > 0 ? left.join(", ") : "-"}</Text>
        </Label>
        <Label text={"Right"}>
          <Text>{right.length > 0 ? right.join(", ") : "-"}</Text>
        </Label>
      </Column>
    </Row>
  );
};
