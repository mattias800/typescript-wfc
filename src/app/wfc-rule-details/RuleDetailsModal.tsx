import * as React from "react";
import { ModalBody, ModalHeader, useDialogPromise } from "@stenajs-webui/modal";
import { RuleDetailsHeader } from "./RuleDetailsHeader.tsx";
import { RuleDetails } from "./RuleDetails.tsx";

export interface RuleDetailsModalProps {
  tileId: string;
}

export const RuleDetailsModal: React.FC<RuleDetailsModalProps> = ({
  tileId,
}) => {
  const { reject } = useDialogPromise();

  return (
    <ModalBody width={"800px"}>
      <ModalHeader heading={"Rule details"} onClickClose={reject} />
      <RuleDetailsHeader tileId={tileId} />
      <RuleDetails tileId={tileId} />
    </ModalBody>
  );
};
