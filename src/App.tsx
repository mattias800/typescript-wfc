import React from "react";
import "./App.css";
import { TileAtlasImporterPanel } from "./app/tile-atlas-importer/TileAtlasImporterPanel.tsx";
import { TileAtlasList } from "./app/tile-atlas/TileAtlasList.tsx";
import { PageLayout } from "./PageLayout.tsx";

export const App: React.FC = () => {
  return (
    <PageLayout leftContent={<TileAtlasList />}>
      <TileAtlasImporterPanel />
    </PageLayout>
  );
};
