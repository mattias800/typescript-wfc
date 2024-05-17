import * as React from "react";
import { RuleSet, TileId } from "../../wfc/CommonTypes.ts";
import { Box, Column, Text } from "@stenajs-webui/core";
import { AllowedNeighboursPanel } from "./AllowedNeighboursPanel.tsx";
import { cssColor } from "@stenajs-webui/theme";

export interface RuleSetPanelProps {
  ruleSet: RuleSet;
}

export const RuleSetPanel: React.FC<RuleSetPanelProps> = ({ ruleSet }) => {
  const tileIds = Object.keys(ruleSet) as Array<TileId>;
  return (
    <Column gap={2}>
      {tileIds.map((tileId) => (
        <Box
          background={cssColor("--silver-lighter")}
          spacing={1}
          indent={1}
          key={tileId}
        >
          <Text>Tile id: {tileId}</Text>
          <AllowedNeighboursPanel
            allowedNeighbours={ruleSet[tileId]}
            key={tileId}
          />
        </Box>
      ))}
    </Column>
  );
};
