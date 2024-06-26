import * as React from "react";
import { useState } from "react";
import { Text } from "@stenajs-webui/core";
import {
  Card,
  CardBody,
  CardHeader,
  SecondaryButton,
} from "@stenajs-webui/elements";
import { RuleSetPanel } from "./RuleSetPanel.tsx";
import { RootState, useAppDispatch, useAppSelector } from "../../Store.ts";
import { useModalDialog } from "@stenajs-webui/modal";
import {
  TileAtlasImporterModal,
  TileAtlasImporterModalProps,
  TileAtlasImporterModalResult,
} from "../tile-atlas-importer/TileAtlasImporterModal.tsx";
import { wfcSlice } from "./WfcSlice.ts";
import { tileAtlasSlice } from "../tile-atlas/TileAtlasSlice.ts";

export interface WfcRuleSetPanelProps {}

const getWfcState = (state: RootState) => state.wfc;

export const WfcRuleSetPanel: React.FC<WfcRuleSetPanelProps> = () => {
  const { ruleSet } = useAppSelector(getWfcState);

  const [numDeletedTiles, setNumDeletedTiles] = useState<number | undefined>();

  const dispatch = useAppDispatch();
  const [dialog, { show }] = useModalDialog<
    TileAtlasImporterModalProps,
    TileAtlasImporterModalResult
  >(TileAtlasImporterModal);

  const onClickImport = async () => {
    try {
      const result = await show();

      if (result) {
        const { ruleSet, tilesRecord } = result;
        dispatch(tileAtlasSlice.actions.reset());
        dispatch(
          tileAtlasSlice.actions.setTileSize({
            tileWidth: result.tileSizeX,
            tileHeight: result.tileSizeY,
          }),
        );
        dispatch(
          tileAtlasSlice.actions.setTiles({
            tiles: tilesRecord,
          }),
        );

        setNumDeletedTiles(result.numDeletedTiles);

        dispatch(wfcSlice.actions.setRuleSet({ ruleSet }));
        dispatch(wfcSlice.actions.resetWfcData());
      }
    } catch (e) {
      /* empty */
    }
  };

  return (
    <Card width={"350px"}>
      {dialog}
      <CardHeader
        text={"Rule set"}
        contentRight={
          <SecondaryButton label={"Import"} onClick={onClickImport} />
        }
      />
      <CardBody gap={2}>
        {ruleSet && (
          <Text>
            {Object.keys(ruleSet).length} tiles{" "}
            {numDeletedTiles != null ? "(" + numDeletedTiles + " deleted)" : ""}
          </Text>
        )}
        {ruleSet ? (
          <RuleSetPanel ruleSet={ruleSet} />
        ) : (
          <Text>No rule set.</Text>
        )}
      </CardBody>
    </Card>
  );
};
