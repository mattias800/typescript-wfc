import * as React from "react";
import { Row, Text } from "@stenajs-webui/core";
import { CircledIcon, stenaExclamationTriangle } from "@stenajs-webui/elements";
import { cssColor } from "@stenajs-webui/theme";

export interface ErrorPanelProps {
  text: string;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({ text }) => {
  return (
    <Row gap={2} alignItems={"center"}>
      <CircledIcon variant={"whiteBg"} icon={stenaExclamationTriangle} />
      <Text color={cssColor("--lhds-color-red-500")}>{text}</Text>
    </Row>
  );
};
