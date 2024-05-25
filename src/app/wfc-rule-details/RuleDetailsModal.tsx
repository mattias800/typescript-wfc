import * as React from "react";
import {
  ModalBody,
  ModalHeader,
  useDialogPromise,
  useModalDialog,
} from "@stenajs-webui/modal";
import { VerticalNeighbourList } from "./VerticalNeighbourList.tsx";
import { useAppDispatch, useAppSelector } from "../../Store.ts";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { HorizontalNeighbourList } from "./HorizontalNeighbourList.tsx";
import { Row, Text } from "@stenajs-webui/core";
import { SecondaryButton } from "@stenajs-webui/elements";
import { wfcSlice } from "../wfc-ruleset/WfcSlice.ts";
import { TileId } from "../../wfc/CommonTypes.ts";
import { RuleSelectModal, RuleSelectModalProps } from "./RuleSelectModal.tsx";

export interface RuleDetailsModalProps {
  tileId: string;
}

export const RuleDetailsModal: React.FC<RuleDetailsModalProps> = ({
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
    <ModalBody minWidth={"700px"}>
      {dialog}
      <ModalHeader heading={"Rule details"} onClickClose={resolve} />

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
    </ModalBody>
  );
};
