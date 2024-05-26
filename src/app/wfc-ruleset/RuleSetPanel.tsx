import * as React from "react";
import { RuleSet, TileId } from "../../wfc/CommonTypes.ts";
import { Box, Row } from "@stenajs-webui/core";
import { cssColor } from "@stenajs-webui/theme";
import { TilePanel } from "../tile-atlas/TilePanel.tsx";
import { useModalDialog } from "@stenajs-webui/modal";
import { RuleDetailsModal } from "../wfc-rule-details/RuleDetailsModal.tsx";

export interface RuleSetPanelProps {
  ruleSet: RuleSet;
}

export const RuleSetPanel: React.FC<RuleSetPanelProps> = ({ ruleSet }) => {
  const tileIds = Object.keys(ruleSet) as Array<TileId>;
  const [dialog, { show }] = useModalDialog(RuleDetailsModal);

  const onClick = async (tileId: string) => {
    try {
      await show({ tileId });
    } catch (e) {
      /* empty */
    }
  };
  return (
    <Row gap={2} flexWrap={"wrap"}>
      {dialog}
      {tileIds.map((tileId) => (
        <button
          key={tileId}
          onClick={() => onClick(tileId)}
          style={{ margin: 0 }}
        >
          <Box
            background={cssColor("--silver-lighter")}
            spacing={1}
            indent={1}
            key={tileId}
          >
            <TilePanel tileId={tileId} />
          </Box>
        </button>
      ))}
    </Row>
  );
};
