import * as React from "react";
import { AllowedNeighbours } from "../../wfc/CommonTypes.ts";
import { Box, Row } from "@stenajs-webui/core";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { Switch } from "@stenajs-webui/forms";
import { RootState, useAppDispatch, useAppSelector } from "../../Store.ts";
import { wfcSlice } from "../wfc-ruleset/WfcSlice.ts";

export interface RuleTileCombinationSwitchProps {
  tileId: string;
  neighbourId: string;
  direction: keyof AllowedNeighbours;
}

const getRuleSet = (state: RootState) => state.wfc.ruleSet;

export const RuleTileCombinationSwitch: React.FC<
  RuleTileCombinationSwitchProps
> = ({ neighbourId, tileId, direction }) => {
  const dispatch = useAppDispatch();
  const ruleSet = useAppSelector(getRuleSet);
  const rule = ruleSet?.[tileId];
  const allowed = rule?.[direction];

  const value = allowed?.includes(neighbourId);

  const otherTileFirst = direction === "left" || direction === "up";
  const isRow = direction === "left" || direction === "right";

  const onValueChange = (val: boolean) => {
    if (val) {
      dispatch(
        wfcSlice.actions.addAllowedNeighbour({
          tileId,
          neighbourId,
          direction,
        }),
      );
    } else {
      dispatch(
        wfcSlice.actions.removeAllowedNeighbour({
          tileId,
          neighbourId,
          direction,
        }),
      );
    }
  };

  return (
    <Row gap={2}>
      <Box flexDirection={isRow ? "row" : "column"}>
        {otherTileFirst && <TileAtlasImage tileId={neighbourId} />}
        <TileAtlasImage tileId={tileId} />
        {!otherTileFirst && <TileAtlasImage tileId={neighbourId} />}
      </Box>
      <Switch value={value} onValueChange={onValueChange} />
    </Row>
  );
};
