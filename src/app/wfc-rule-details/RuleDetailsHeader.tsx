import * as React from "react";
import { Row, Text } from "@stenajs-webui/core";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { Cardy, CardyBody, SecondaryButton } from "@stenajs-webui/elements";
import { TileId } from "../../wfc/CommonTypes.ts";
import { wfcSlice } from "../wfc-ruleset/WfcSlice.ts";
import { useAppDispatch } from "../../Store.ts";
import { useDialogPromise, useModalDialog } from "@stenajs-webui/modal";
import { RuleSelectModal, RuleSelectModalProps } from "./RuleSelectModal.tsx";

export interface RuleDetailsHeaderProps {
  tileId: string;
}

export const RuleDetailsHeader: React.FC<RuleDetailsHeaderProps> = ({
  tileId,
}) => {
  const dispatch = useAppDispatch();

  const [dialog, { show }] = useModalDialog<RuleSelectModalProps, TileId>(
    RuleSelectModal,
  );
  const { resolve } = useDialogPromise();

  const onClickDelete = (tileId: TileId) => {
    resolve();
    dispatch(wfcSlice.actions.deleteTileFromRules({ tileId }));
  };

  const onClickReplace = async (tileId: TileId) => {
    try {
      const selectedTileId = await show();
      if (selectedTileId) {
        resolve();
        dispatch(
          wfcSlice.actions.replaceTileWithOtherTile({
            tileIdToDelete: tileId,
            tileIdToReplaceIt: selectedTileId,
          }),
        );
      }
    } catch (e) {
      /* empty */
    }
  };

  return (
    <Row alignItems={"center"} gap={2} justifyContent={"space-between"}>
      {dialog}

      <Row alignItems={"center"} gap={2}>
        <TileAtlasImage tileId={tileId} />
        <Text>ID: {tileId}</Text>
      </Row>
      <Cardy>
        <CardyBody>
          <Row alignItems={"center"} gap={2}>
            <SecondaryButton
              label={"Delete & replace"}
              onClick={() => onClickReplace(tileId)}
            />
            <SecondaryButton
              label={"Delete"}
              onClick={() => onClickDelete(tileId)}
            />
          </Row>
        </CardyBody>
      </Cardy>
    </Row>
  );
};
