import * as React from "react";
import { AllowedNeighbours, TileId } from "../../wfc/CommonTypes.ts";
import { Row } from "@stenajs-webui/core";
import { RootState, useAppSelector } from "../../Store.ts";
import { UpDownNeighbourCombinationSwitch } from "./UpDownNeighbourCombinationSwitch.tsx";
import { Banner } from "@stenajs-webui/elements";

export interface RuleEditorPanelProps {
  tileId: TileId;
  direction: keyof AllowedNeighbours;
}

const getRuleSet = (state: RootState) => state.wfc.ruleSet;

export const RuleEditorPanel: React.FC<RuleEditorPanelProps> = ({
  direction,
  tileId,
}) => {
  const ruleSet = useAppSelector(getRuleSet);

  if (ruleSet == null) {
    return <Banner variant={"info"} text={"No rule set loaded."} />;
  }

  const tileIds = Object.keys(ruleSet) as Array<TileId>;

  return (
    <Row flexWrap={"wrap"} gap={4}>
      {tileIds.map((otherTileId) => (
        <UpDownNeighbourCombinationSwitch
          tileId={tileId}
          neighbourId={otherTileId}
          direction={direction}
          row={direction === "left"}
        />
      ))}
    </Row>
  );
};
