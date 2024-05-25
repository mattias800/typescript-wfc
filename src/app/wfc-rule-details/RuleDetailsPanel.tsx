import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../Store.ts";
import { useDialogPromise, useModalDialog } from "@stenajs-webui/modal";
import { RuleSelectModal, RuleSelectModalProps } from "./RuleSelectModal.tsx";
import { TileId } from "../../wfc/CommonTypes.ts";
import { wfcSlice } from "../wfc-ruleset/WfcSlice.ts";
import { Row, Text } from "@stenajs-webui/core";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { SecondaryButton } from "@stenajs-webui/elements";
import { HorizontalNeighbourList } from "./HorizontalNeighbourList.tsx";
import { VerticalNeighbourList } from "./VerticalNeighbourList.tsx";

export interface RuleDetailsPanelProps {
  tileId: string;
}

export const RuleDetailsPanel: React.FC<RuleDetailsPanelProps> = ({
  tileId,
}) => {
  const dispatch = useAppDispatch();

  const [dialog, { show }] = useModalDialog<RuleSelectModalProps, TileId>(
    RuleSelectModal,
  );
  const { resolve } = useDialogPromise();
  const { ruleSet } = useAppSelector((state) => state.wfc);
  const allowedNeighbours = ruleSet?.[tileId];

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
    } catch (e) {}
  };

  return (
    <>
      {dialog}
      <Row alignItems={"center"} gap={2} justifyContent={"space-between"}>
        <Row alignItems={"center"} gap={2}>
          <TileAtlasImage tileId={tileId} />
          <Text>ID: {tileId}</Text>
        </Row>
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
      </Row>

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
    </>
  );
};
