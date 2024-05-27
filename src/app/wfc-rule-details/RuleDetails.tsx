import * as React from "react";
import { useState } from "react";
import { Tab, TabMenu } from "@stenajs-webui/elements";
import { RuleDetailsPanel } from "./RuleDetailsPanel.tsx";
import { RuleEditorPanel } from "../wfc-rule-editor/RuleEditorPanel.tsx";
import { Spacing } from "@stenajs-webui/core";

export interface RuleDetailsProps {
  tileId: string;
}

type TabCode = "details" | "updown" | "leftright";

export const RuleDetails: React.FC<RuleDetailsProps> = ({ tileId }) => {
  const [tab, setTab] = useState<TabCode>("details");
  return (
    <>
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
      <Spacing num={4} minWidth={"700px"}>
        {tab === "details" && <RuleDetailsPanel tileId={tileId} />}
        {tab === "updown" && (
          <RuleEditorPanel tileId={tileId} direction={"up"} />
        )}
        {tab === "leftright" && (
          <RuleEditorPanel tileId={tileId} direction={"left"} />
        )}
      </Spacing>
    </>
  );
};
