import * as React from "react";
import { Row, Text } from "@stenajs-webui/core";
import { Coordinate } from "../../../wfc/CommonTypes.ts";
import { SecondaryButton } from "@stenajs-webui/elements";

export interface TileSelectHeaderProps {
  coordinate: Coordinate;
}

export const TileSelectHeader: React.FC<TileSelectHeaderProps> = ({
  coordinate,
}) => {
  return (
    <Row alignItems={"center"} justifyContent={"space-between"}>
      <Row alignItems={"center"}>
        <Text>
          {coordinate.col}:{coordinate.row}
        </Text>
      </Row>
      <Row>
        <SecondaryButton label={"Clear map coordinate"} />
      </Row>
    </Row>
  );
};
