import * as React from "react";
import { useCallback, useEffect, useId, useRef } from "react";
import sourceImage from "../../assets/smb3map.png";
import { Canvas } from "../../canvas/Canvas.tsx";
import { drawChessBoard } from "../../canvas/CanvasUtils.ts";
import { PrimaryButton, SecondaryButton } from "@stenajs-webui/elements";
import { TileAtlasImporterSettingsForm } from "./TileAtlasImporterSettingsForm.tsx";
import { useAppDispatch, useAppSelector } from "../../Store.ts";
import { Column, Row } from "@stenajs-webui/core";
import { extractUniqueTiles } from "../util/TileImporter.ts";
import { getImageDataFromImage } from "../util/ImageDataUtil.ts";
import { extractRuleSet } from "../../wfc/RuleExtractor.ts";
import { mapNumberMapToSourceMap } from "../../wfc/SourceMapMapper.ts";
import { wcfSlice } from "../wcf-ruleset/WcfSlice.ts";
import { tileAtlasSlice } from "../tile-atlas/TileAtlasSlice.ts";
import { useDialogPromise } from "@stenajs-webui/modal";

export interface TileAtlasImporterPanelProps {}

export const TileAtlasImporterPanel: React.FC<
  TileAtlasImporterPanelProps
> = () => {
  const id = useId();
  const dispatch = useAppDispatch();
  const { resolve, reject } = useDialogPromise();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { settingsX, settingsY } = useAppSelector(
    (state) => state.tileAtlasImporter,
  );

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
  }, [settingsX, settingsY]);

  const onClickImport = useCallback(() => {
    const image = imageRef.current;
    if (image) {
      const imageData = getImageDataFromImage(image);
      const r = extractUniqueTiles(settingsX, settingsY, imageData);
      console.log(r);
      const ruleSet = extractRuleSet(mapNumberMapToSourceMap(r.tileMap));

      dispatch(wcfSlice.actions.setRuleSet({ ruleSet }));
      dispatch(tileAtlasSlice.actions.reset());
      dispatch(
        tileAtlasSlice.actions.setTiles({
          tiles: r.tilesRecord,
        }),
      );
      dispatch(
        tileAtlasSlice.actions.setTileSize({
          tileWidth: settingsX.tileSize,
          tileHeight: settingsY.tileSize,
        }),
      );
      resolve();
    }
  }, [dispatch, resolve, settingsX, settingsY]);

  return (
    <Column gap={2}>
      <Row alignItems={"flex-end"} gap={6}>
        <TileAtlasImporterSettingsForm />
        <PrimaryButton label={"Import"} onClick={onClickImport} />
        <SecondaryButton label={"Cancel"} onClick={() => reject()} />
      </Row>

      <Canvas
        id={id}
        width={"320px"}
        height={"180px"}
        style={{
          width: "1280px",
          height: "720px",
          imageRendering: "pixelated",
        }}
        ref={canvasRef}
      />
    </Column>
  );
};
