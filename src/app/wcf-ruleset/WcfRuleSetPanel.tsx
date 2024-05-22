import * as React from "react";
import { Text } from "@stenajs-webui/core";
import { Card, CardBody, CardHeader } from "@stenajs-webui/elements";
import { RuleSetPanel } from "./RuleSetPanel.tsx";
import { useAppSelector } from "../../Store.ts";

export interface WcfRuleSetPanelProps {}

export const WcfRuleSetPanel: React.FC<WcfRuleSetPanelProps> = () => {
  console.log("render WcfRuleSetPanel");
  const { ruleSet } = useAppSelector((state) => state.wcf);
  return (
    <Card width={"350px"}>
      <CardHeader text={"Rule set"} />
      <CardBody gap={2}>
        {ruleSet ? (
          <RuleSetPanel ruleSet={ruleSet} />
        ) : (
          <Text>No rule set.</Text>
        )}
      </CardBody>
    </Card>
  );
};
