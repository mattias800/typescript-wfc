import * as React from "react";
import { ModalBody, ModalHeader, useDialogPromise } from "@stenajs-webui/modal";
import { RuleDetailsPanel } from "./RuleDetailsPanel.tsx";
import { Tab, TabMenu } from "@stenajs-webui/elements";
import { useState } from "react";
import { RuleEditorPanel } from "../wfc-rule-editor/RuleEditorPanel.tsx";
import { RuleDetailsHeader } from "./RuleDetailsHeader.tsx";

export interface RuleDetailsModalProps {
  tileId: string;
}

type TabCode = "details" | "updown" | "leftright";

export const RuleDetailsModal: React.FC<RuleDetailsModalProps> = ({
  tileId,
}) => {
  const { reject } = useDialogPromise();

  const [tab, setTab] = useState<TabCode>("details");

  return (
    <ModalBody width={"800px"}>
      <ModalHeader heading={"Rule details"} onClickClose={reject} />
      <RuleDetailsHeader tileId={tileId} />
      <TabMenu>
        <Tab
          label={"Details"}
          selected={tab === "details"}
          onClick={() => setTab("details")}
        />
        <Tab
          label={"Up & down"}
          selected={tab === "updown"}
          onClick={() => setTab("updown")}
        />
        <Tab
          label={"Left & right"}
          selected={tab === "leftright"}
          onClick={() => setTab("leftright")}
        />
      </TabMenu>
      {tab === "details" && <RuleDetailsPanel tileId={tileId} />}
      {tab === "updown" && <RuleEditorPanel tileId={tileId} direction={"up"} />}
      {tab === "leftright" && (
        <RuleEditorPanel tileId={tileId} direction={"left"} />
      )}
    </ModalBody>
  );
};
