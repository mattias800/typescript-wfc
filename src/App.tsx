import React from "react";
import "./App.css";
import { PageLayout } from "./PageLayout.tsx";
import { WfcRuleSetPanel } from "./app/wfc-ruleset/WfcRuleSetPanel.tsx";
import { WfcCanvasPanel } from "./app/wfc-canvas/WfcCanvasPanel.tsx";
import { TileAtlasList } from "./app/tile-atlas/TileAtlasList.tsx";

export const App: React.FC = () => {
  return (
    <PageLayout
      leftContent={<WfcRuleSetPanel />}
      rightContent={<TileAtlasList />}
    >
      <WfcCanvasPanel />
    </PageLayout>
  );
};
