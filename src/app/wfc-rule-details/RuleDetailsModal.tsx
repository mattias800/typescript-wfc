import * as React from "react";
import { ModalBody, ModalHeader, useDialogPromise } from "@stenajs-webui/modal";
import { RuleDetailsPanel } from "./RuleDetailsPanel.tsx";
import { Tab, TabMenu } from "@stenajs-webui/elements";
import { useState } from "react";
import { RuleEditorPanel } from "../wfc-rule-editor/RuleEditorPanel.tsx";

export interface RuleDetailsModalProps {
  tileId: string;
}

type TabCode = "details" | "up" | "down" | "left" | "right";

export const RuleDetailsModal: React.FC<RuleDetailsModalProps> = ({
  tileId,
}) => {
  const { reject } = useDialogPromise();

  const [tab, setTab] = useState<TabCode>("details");

  return (
    <ModalBody width={"800px"}>
      <ModalHeader heading={"Rule details"} onClickClose={reject} />
      <TabMenu>
        <Tab
          label={"Details"}
          selected={tab === "details"}
          onClick={() => setTab("details")}
        />
        <Tab
          label={"Up"}
          selected={tab === "up"}
          onClick={() => setTab("up")}
        />
        <Tab
          label={"Down"}
          selected={tab === "down"}
          onClick={() => setTab("down")}
        />
        <Tab
          label={"Left"}
          selected={tab === "left"}
          onClick={() => setTab("left")}
        />
        <Tab
          label={"Right"}
          selected={tab === "right"}
          onClick={() => setTab("right")}
        />
      </TabMenu>
      {tab === "details" && <RuleDetailsPanel tileId={tileId} />}
      {tab === "up" && <RuleEditorPanel tileId={tileId} direction={"up"} />}
      {tab === "down" && <RuleEditorPanel tileId={tileId} direction={"down"} />}
      {tab === "left" && <RuleEditorPanel tileId={tileId} direction={"left"} />}
      {tab === "right" && (
        <RuleEditorPanel tileId={tileId} direction={"right"} />
      )}
    </ModalBody>
  );
};
