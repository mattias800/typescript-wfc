import React from "react";
import "./App.css";
import { PageLayout } from "./PageLayout.tsx";
import { WcfRuleSetPanel } from "./app/wcf-ruleset/WcfRuleSetPanel.tsx";
import { WcfCanvasPanel } from "./app/wcf-canvas/WcfCanvasPanel.tsx";

export const App: React.FC = () => {
  return (
    <PageLayout
      leftContent={<WcfRuleSetPanel />}
      /* rightContent={<TileAtlasList />} */
    >
      <WcfCanvasPanel />
    </PageLayout>
  );
};
