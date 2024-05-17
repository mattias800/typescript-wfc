import * as React from "react";
import { ModalBody, ModalHeader } from "@stenajs-webui/modal";
import { TileAtlasImporterPanel } from "./TileAtlasImporterPanel.tsx";

export interface TileAtlasImporterModalProps {}

export const TileAtlasImporterModal: React.FC<
  TileAtlasImporterModalProps
> = () => {
  return (
    <ModalBody>
      <ModalHeader heading={"Import tiles atlas"} />
      <TileAtlasImporterPanel />
    </ModalBody>
  );
};
