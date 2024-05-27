import * as React from "react";
import { useAppSelector } from "../../Store.ts";
import { Column, Row } from "@stenajs-webui/core";
import { HorizontalNeighbourList } from "./HorizontalNeighbourList.tsx";
import { VerticalNeighbourList } from "./VerticalNeighbourList.tsx";
import { RuleDetailsHeader } from "./RuleDetailsHeader.tsx";

export interface RuleDetailsPanelProps {
  tileId: string;
}

export const RuleDetailsPanel: React.FC<RuleDetailsPanelProps> = ({
  tileId,
}) => {
  const { ruleSet } = useAppSelector((state) => state.wfc);
  const allowedNeighbours = ruleSet?.[tileId];

  return (
    <Column gap={4}>
      <RuleDetailsHeader tileId={tileId} />
      {allowedNeighbours && (
        <Row gap={4}>
          <HorizontalNeighbourList
            tileId={tileId}
            allowedNeighbours={allowedNeighbours}
          />
          <VerticalNeighbourList
            tileId={tileId}
            allowedNeighbours={allowedNeighbours}
          />
        </Row>
      )}
    </Column>
  );
};
