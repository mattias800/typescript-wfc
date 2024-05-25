import * as React from "react";
import { ModalBody, ModalHeader, useDialogPromise } from "@stenajs-webui/modal";
import { TileAtlasImporterPanel } from "./TileAtlasImporterPanel.tsx";
import { RuleSet, TileId } from "../../wfc/CommonTypes.ts";

export interface TileAtlasImporterModalProps {}

export interface TileAtlasImporterModalResult {
  ruleSet: RuleSet;
  tileSizeX: number;
  tileSizeY: number;
  tiles: Array<ImageData>;
  tilesRecord: Record<TileId, string>;
  tileMap: Array<Array<number>>;
}

export const TileAtlasImporterModal: React.FC<
  TileAtlasImporterModalProps
> = () => {
  const { reject } = useDialogPromise();
  return (
    <ModalBody>
      <ModalHeader heading={"Import tiles atlas"} onClickClose={reject} />
      <TileAtlasImporterPanel />
    </ModalBody>
  );
};
