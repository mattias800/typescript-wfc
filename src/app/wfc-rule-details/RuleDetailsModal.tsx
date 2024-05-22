import * as React from "react";
import { ModalBody, ModalHeader, useDialogPromise } from "@stenajs-webui/modal";
import { VerticalNeighbourList } from "./VerticalNeighbourList.tsx";
import { useAppDispatch, useAppSelector } from "../../Store.ts";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { HorizontalNeighbourList } from "./HorizontalNeighbourList.tsx";
import { Row, Text } from "@stenajs-webui/core";
import { SecondaryButton } from "@stenajs-webui/elements";
import { wcfSlice } from "../wcf-ruleset/WcfSlice.ts";
import { TileId } from "../../wfc/CommonTypes.ts";

export interface RuleDetailsModalProps {
  tileId: string;
}

export const RuleDetailsModal: React.FC<RuleDetailsModalProps> = ({
  tileId,
}) => {
  const dispatch = useAppDispatch();
  const { resolve } = useDialogPromise();
  const { ruleSet } = useAppSelector((state) => state.wcf);
  const allowedNeighbours = ruleSet?.[tileId];

  const onClickDelete = (tileId: TileId) => {
    resolve();
    dispatch(wcfSlice.actions.deleteTileFromRules({ tileId }));
  };

  return (
    <ModalBody minWidth={"700px"}>
      <ModalHeader heading={"Rule details"} onClickClose={resolve} />

      <Row alignItems={"center"} gap={2} justifyContent={"space-between"}>
        <Row alignItems={"center"} gap={2}>
          <TileAtlasImage tileId={tileId} />
          <Text>ID: {tileId}</Text>
        </Row>
        <Row alignItems={"center"} gap={2}>
          <SecondaryButton label={"Replace"} />
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
