import * as React from "react";
import { AllowedNeighbours } from "../../wfc/CommonTypes.ts";
import { Box } from "@stenajs-webui/core";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { Switch } from "@stenajs-webui/forms";
import { RootState, useAppDispatch, useAppSelector } from "../../Store.ts";
import { wfcSlice } from "../wfc-ruleset/WfcSlice.ts";
import { getInverseDirection } from "../../wfc/RuleSetModifier.ts";

export interface UpDownNeighbourCombinationSwitchProps {
  tileId: string;
  neighbourId: string;
  direction: keyof AllowedNeighbours;
  row?: boolean;
}

const getRuleSet = (state: RootState) => state.wfc.ruleSet;

export const UpDownNeighbourCombinationSwitch: React.FC<
  UpDownNeighbourCombinationSwitchProps
> = ({ tileId, neighbourId, direction, row }) => {
  const dispatch = useAppDispatch();
  const ruleSet = useAppSelector(getRuleSet);
  const rule = ruleSet?.[tileId];

  const valueUp = rule?.[direction]?.includes(neighbourId);
  const valueDown =
    rule?.[getInverseDirection(direction)]?.includes(neighbourId);

  const onUpValueChange = (
    val: boolean,
    direction: keyof AllowedNeighbours,
  ) => {
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
    <Box gap={2} flexDirection={row ? "column" : "row"}>
      <Box flexDirection={row ? "row" : "column"}>
        <TileAtlasImage tileId={neighbourId} />
        <TileAtlasImage tileId={tileId} />
        <TileAtlasImage tileId={neighbourId} />
      </Box>
      <Box
        justifyContent={"space-between"}
        flexDirection={row ? "row" : "column"}
      >
        <Switch
          value={valueUp}
          onValueChange={(v) => onUpValueChange(v, direction)}
        />
        <Switch
          value={valueDown}
          onValueChange={(v) =>
            onUpValueChange(v, getInverseDirection(direction))
          }
        />
      </Box>
    </Box>
  );
};
