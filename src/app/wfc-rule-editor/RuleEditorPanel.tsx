import * as React from "react";
import { AllowedNeighbours, TileId } from "../../wfc/CommonTypes.ts";
import { Row } from "@stenajs-webui/core";
import { RootState, useAppSelector } from "../../Store.ts";
import { UpDownNeighbourCombinationSwitch } from "./UpDownNeighbourCombinationSwitch.tsx";
import { Banner, Cardy, CardyBody } from "@stenajs-webui/elements";

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
    <Cardy>
      <CardyBody>
        <Row flexWrap={"wrap"} gap={4} width={"700px"}>
          {tileIds.map((otherTileId) => (
            <UpDownNeighbourCombinationSwitch
              key={otherTileId}
              tileId={tileId}
              neighbourId={otherTileId}
              direction={direction}
              row={direction === "left"}
            />
          ))}
        </Row>
      </CardyBody>
    </Cardy>
  );
};
