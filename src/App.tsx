import React from "react";
import "./App.css";
import { TileAtlasList } from "./app/tile-atlas/TileAtlasList.tsx";
import { PageLayout } from "./PageLayout.tsx";
import { WcfRuleSetPanel } from "./app/wcf-ruleset/WcfRuleSetPanel.tsx";
import { WcfCanvasPanel } from "./app/wcf-canvas/WcfCanvasPanel.tsx";

export const App: React.FC = () => {
  return (
    <PageLayout
      leftContent={<TileAtlasList />}
      rightContent={<WcfRuleSetPanel />}
    >
      <WcfCanvasPanel />
    </PageLayout>
  );
};
