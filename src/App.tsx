import React from "react";
import "./App.css";
import { TileAtlasImporter } from "./app/tile-atlas-importer/TileAtlasImporter.tsx";
import { TileAtlasList } from "./app/tile-atlas/TileAtlasList.tsx";
import { PageLayout } from "./PageLayout.tsx";

export const App: React.FC = () => {
  return (
    <PageLayout leftContent={<TileAtlasList />}>
      <TileAtlasImporter />
    </PageLayout>
  );
};
