import * as React from "react";
import { PropsWithChildren, ReactNode } from "react";
import { Column, Row } from "@stenajs-webui/core";
import { NavBar, NavBarHeading } from "@stenajs-webui/panels";

export interface PageLayoutProps extends PropsWithChildren {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  leftContent,
  rightContent,
  children,
}) => {
  return (
    <Column>
      <NavBar>
        <NavBarHeading>Wave function collapse</NavBarHeading>
      </NavBar>
      <Row indent={2} spacing={2} gap={2}>
        <Column>{leftContent}</Column>
        <Column flex={1}>{children}</Column>
        <Column>{rightContent}</Column>
      </Row>
    </Column>
  );
};
