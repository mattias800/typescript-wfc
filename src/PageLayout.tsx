import * as React from "react";
import { PropsWithChildren, ReactNode } from "react";
import { Column, Row } from "@stenajs-webui/core";

export interface PageLayoutProps extends PropsWithChildren {
  leftContent?: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  leftContent,
  children,
}) => {
  return (
    <Row indent={2} spacing={2} gap={2}>
      <Column>{leftContent}</Column>
      <Column>{children}</Column>
    </Row>
  );
};
