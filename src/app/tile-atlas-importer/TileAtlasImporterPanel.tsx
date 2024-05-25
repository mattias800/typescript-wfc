import * as React from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import smb3map from "../../assets/smb3map.png";
import { Canvas } from "../../canvas/Canvas.tsx";
import { drawChessBoard } from "../../canvas/CanvasUtils.ts";
import { PrimaryButton, SecondaryButton } from "@stenajs-webui/elements";
import { TileAtlasImporterSettingsForm } from "./TileAtlasImporterSettingsForm.tsx";
import { useAppSelector } from "../../Store.ts";
import { Column, Row } from "@stenajs-webui/core";
import { extractUniqueTiles } from "../util/TileImporter.ts";
import { getImageDataFromImage } from "../util/ImageDataUtil.ts";
import { extractRuleSet } from "../../wfc/RuleExtractor.ts";
import { mapNumberMapToSourceMap } from "../../wfc/SourceMapMapper.ts";
import { useDialogPromise } from "@stenajs-webui/modal";
import { useDropTarget } from "./hooks/UseDropTarget.tsx";
import { cssColor } from "@stenajs-webui/theme";
import { validateRuleSet } from "../../wfc/RuleSetValidator.ts";
import { deleteInvalidTiles } from "../../wfc/RuleSetModifier.ts";
import { TileAtlasImporterModalResult } from "./TileAtlasImporterModal.tsx";

export interface TileAtlasImporterPanelProps {}

export const TileAtlasImporterPanel: React.FC<
  TileAtlasImporterPanelProps
> = () => {
  const id = useId();
  const { resolve, reject } = useDialogPromise<TileAtlasImporterModalResult>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [sourceImage, setSourceImage] = useState<string>(() => smb3map);
  const { settingsX, settingsY } = useAppSelector(
    (state) => state.tileAtlasImporter,
  );

  const { isOver, props } = useDropTarget((png) => {
    setSourceImage(png);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      console.log("Could not get context.");
      return;
    }
    const image = new Image();
    image.src = sourceImage;
    image.onload = () => {
      const scale = 1;
      ctx.reset();
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        image.width * scale,
        image.height * scale,
      );
      drawChessBoard(ctx, settingsX, settingsY);
      imageRef.current = image;
    };
  }, [settingsX, settingsY, sourceImage]);

  const onClickImport = useCallback(() => {
    const image = imageRef.current;
    if (image) {
      const imageData = getImageDataFromImage(image);
      const r = extractUniqueTiles(settingsX, settingsY, imageData);

      const importedRuleSet = extractRuleSet(
        mapNumberMapToSourceMap(r.tileMap),
      );

      const validationErrors = validateRuleSet(importedRuleSet);
      validationErrors.forEach((v) => console.log(v.tileId, v.message));
      const ruleSet = deleteInvalidTiles(importedRuleSet);

      resolve({
        ...r,
        ruleSet,
      });
    }
  }, [resolve, settingsX, settingsY]);

  return (
    <Column gap={2}>
      <Row alignItems={"flex-end"} gap={6}>
        <TileAtlasImporterSettingsForm />
        <Column gap={4}>
          <Row gap={2}>
            <PrimaryButton label={"Import"} onClick={onClickImport} />
            <SecondaryButton label={"Cancel"} onClick={() => reject()} />
          </Row>
        </Column>
      </Row>

      <Canvas
        id={id}
        width={"320px"}
        height={"180px"}
        style={{
          width: "1280px",
          height: "720px",
          imageRendering: "pixelated",
          border:
            "4px solid " +
            (isOver ? cssColor("--lhds-color-blue-400") : "transparent"),
        }}
        ref={canvasRef}
        {...props}
      />
    </Column>
  );
};
