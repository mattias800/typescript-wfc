import * as React from "react";
import { Row } from "@stenajs-webui/core";
import { Label } from "@stenajs-webui/elements";
import { RootState, useAppDispatch, useAppSelector } from "../../Store.ts";
import { wfcSlice } from "../wfc-ruleset/WfcSlice.ts";

export interface WfcSettingsFormProps {}

const getWfcState = (s: RootState) => s.wfc;

export const WfcSettingsForm: React.FC<WfcSettingsFormProps> = () => {
  const { cols, rows } = useAppSelector(getWfcState);
  const dispatch = useAppDispatch();

  return (
    <Row>
      <Label text={"Cols: " + cols}>
        <input
          type={"range"}
          value={cols}
          min={2}
          max={64}
          onChange={(ev) =>
            dispatch(
              wfcSlice.actions.setNumColumns({
                cols: parseInt(ev.target.value),
              }),
            )
          }
        />
      </Label>
      <Label text={"Rows: " + rows}>
        <input
          type={"range"}
          value={rows}
          min={2}
          max={64}
          onChange={(ev) =>
            dispatch(
              wfcSlice.actions.setNumRows({ rows: parseInt(ev.target.value) }),
            )
          }
        />
      </Label>
    </Row>
  );
};
